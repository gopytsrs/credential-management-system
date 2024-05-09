import { useAccount } from "wagmi";

export const useIsConnected = () => {
  const account = useAccount();
  return { isConnected: account.isConnected };
};
