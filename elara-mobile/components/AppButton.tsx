import { Button, IButtonProps } from "native-base";

export default function AppButton(props: IButtonProps) {
  return <Button colorScheme="brand" variant="solid" {...props} />;
}
