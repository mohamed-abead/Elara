from typing import Any

import httpx
from fastapi import HTTPException
from supabase import Client, create_client

from core.settings import settings
from clients.supabase_client import postgrest_as_user


def _crossmint_headers() -> dict[str, str]:
    return {
        "X-API-KEY": settings.CROSSMINT_SERVER_SIDE,
        # "Content-Type": "application/json",
    }


_supabase_client: Client | None = None


def _get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
        )
    return _supabase_client


def create_crossmint_user(email: str, token: str, user_id: str) -> dict[str, Any]:
    """
    Create a Crossmint wallet for a user email and persist the response in Supabase.
    """
    body = {
        "chainType": "evm",
        "type": "smart",
        "config": {
            "adminSigner": {
                "type": "email",
                "email": email,
            }
        },
        "owner": "email:" + email,
    }
    print("###############\n\n######################\n\n")
    print("BODY OF create_crossmint_user: ", body)
    print("headers:", _crossmint_headers())
    with httpx.Client(timeout=20) as client:
        response = client.post(
            f"{settings.CROSSMINT_API_BASE}/api/2025-06-09/wallets",
            headers=_crossmint_headers(),
            json=body,
        )
    response.raise_for_status()
    wallet = response.json()
    print("####\n", wallet, "#####\n\n")
    if not isinstance(wallet, dict):
        raise HTTPException(
            status_code=502,
            detail="Unexpected wallet response from Crossmint",
        )

    admin_signer = (
        (wallet.get("config") or {}).get("adminSigner") or {}
    )
    record = {
        "id": user_id,
        "chain_type": wallet.get("chainType"),
        "type": wallet.get("type"),
        "address": wallet.get("address"),
        "adminSigner_type": admin_signer.get("type"),
        "adminSigner_email": admin_signer.get("email"),
        "adminSigner_locator": admin_signer.get("locator"),
    }
    print("record:\n", record)
    try:
        # Persist using PostgREST as the current user, similar to profiles.py
        with postgrest_as_user(token) as pg:
            pg.post("/crossmint", json=record, params={"on_conflict": "id"},)
            print("SUCCESSFUL PG POST\n\n")
    except Exception as exc:  # pragma: no cover - network failure
        print("ERROR:\n", exc)
        raise HTTPException(
            status_code=502,
            detail="Crossmint wallet created but persistence failed",
        ) from exc

    return wallet


class CrossmintClient:
    def __init__(self, *, base_url: str, api_key: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key

    def create_order(self, payload: dict[str, Any]) -> dict[str, Any]:
        url = f"{self.base_url}/api/2022-06-09/orders"
        headers = {
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json",
        }

        with httpx.Client(timeout=20) as client:
            response = client.post(url, headers=headers, json=payload)

            if response.is_error:
                error_data = self._safe_json(response)
                print("Crossmint API error:", error_data)
                raise HTTPException(
                    status_code=502,
                    detail={
                        "error": "Failed to create order with Crossmint",
                        "details": error_data,
                    },
                )

            result = self._safe_json(response)
            print("Crossmint order response:", result)
            transaction_result = self._submit_payment_transaction(
                client, headers, payload, result
            )
            if transaction_result is not None:
                result["paymentTransaction"] = transaction_result
            return result

    def _submit_payment_transaction(
        self,
        client: httpx.Client,
        headers: dict[str, str],
        request_payload: dict[str, Any],
        order_result: dict[str, Any],
    ) -> dict[str, Any] | None:
        order = order_result.get("order")
        if not isinstance(order, dict):
            return None
        payment = order.get("payment")
        if not isinstance(payment, dict):
            return None
        preparation = payment.get("preparation")
        if not isinstance(preparation, dict):
            return None

        serialized_transaction = preparation.get("serializedTransaction")
        if not serialized_transaction:
            return None

        payment_payload = request_payload.get("payment")
        if not isinstance(payment_payload, dict):
            payment_payload = {}
        payer_address = payment_payload.get("payerAddress")
        if not payer_address:
            print(
                "Skipping Crossmint transaction submission: missing payer address"
            )
            return None

        chain = (
            preparation.get("chain")
            or payment.get("chain")
            or payment_payload.get("method")
            or "base-sepolia"
        )

        transaction_payload = {
            "params": {
                "calls": [{"transaction": serialized_transaction}],
                "chain": chain,
            }
        }

        transaction_url = (
            f"{self.base_url}/api/2022-06-09/wallets/{payer_address}/transactions"
        )
        print(
            "Submitting Crossmint payment transaction",
            {"order_id": order.get("id"), "chain": chain},
        )
        transaction_response = client.post(
            transaction_url, headers=headers, json=transaction_payload
        )

        if transaction_response.is_error:
            error_data = self._safe_json(transaction_response)
            print(
                "Failed to submit Crossmint transaction",
                {"order_id": order.get("id"), "error": error_data},
            )
            raise HTTPException(
                status_code=502,
                detail={
                    "error": "Order created but payment transaction failed",
                    "details": error_data,
                    "orderId": order.get("id"),
                },
            )

        transaction_result = self._safe_json(transaction_response)
        print(
            "Crossmint payment transaction submitted",
            {"order_id": order.get("id"), "transaction": transaction_result},
        )
        return transaction_result

    @staticmethod
    def _safe_json(response: httpx.Response) -> dict[str, Any]:
        try:
            data = response.json()
            if isinstance(data, dict):
                return data
            return {"data": data}
        except ValueError:
            return {"raw": response.text}


crossmint_client = CrossmintClient(
    base_url=settings.CROSSMINT_API_BASE,
    api_key=settings.CROSSMINT_SERVER_SIDE,
)
