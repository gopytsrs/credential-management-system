import { useAccount } from "wagmi";

export const useAddress = () => {
  const account = useAccount();
  return { address: account.address };
};
