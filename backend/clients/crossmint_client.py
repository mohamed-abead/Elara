import logging
from typing import Any

import httpx
from fastapi import HTTPException

from core.settings import settings


logger = logging.getLogger(__name__)


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
            logger.error("Crossmint API error: %s", error_data)
            raise HTTPException(
                status_code=502,
                detail={
                    "error": "Failed to create order with Crossmint",
                    "details": error_data,
                },
            )

        result = self._safe_json(response)
        logger.info("Crossmint order response: %s", result)
        return result

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
