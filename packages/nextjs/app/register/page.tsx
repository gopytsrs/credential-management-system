"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Cat } from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useIsConnected, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { AccountType, useGlobalState } from "~~/services/store/store";

const RegisterPage: NextPage = () => {
  const { accountType, setAccountType } = useGlobalState(state => ({
    accountType: state.accountType,
    setAccountType: state.setAccountType,
  }));
  const account = useAccount();
  const { isConnected } = useIsConnected();
  const { data: userType, refetch } = useScaffoldContractRead({
    account: account.address,
    contractName: "AuthContract",
    functionName: "getUserType",
  });

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "AuthContract",
    functionName: "register",
    args: [0],
  });

  useEffect(() => {
    (async () => {
      await refetch();
      if (isConnected && userType !== undefined) {
        setAccountType(userType);
        console.log("after refetch", userType);
      }
    })();
  }, [userType, isConnected, setAccountType, refetch]);

  if (isConnected && accountType === AccountType.Organizaton) {
    redirect("/organization");
  }
  if (isConnected && accountType === AccountType.Individual) {
    redirect("/individual");
  }

  return (
    <div className="hero min-h-screen ">
      <div className="hero-content text-center">
        <div className="flex flex-col items-center max-w-lg">
          <Cat size={40} />
          <h1 className="text-5xl font-bold">Credential Management System</h1>
          <p className="text-2xl py-6">Register as individual or organization</p>
          <RainbowKitCustomConnectButton />
          {isConnected && (
            <div className="mt-8 flex flex-col gap-3">
              <button
                className="btn btn-accent rounded-lg btn-sm"
                onClick={() => writeAsync({ args: [AccountType.Organizaton] })}
              >
                Register as Organization
              </button>
              <button
                className="btn btn-accent rounded-lg btn-sm"
                onClick={() => writeAsync({ args: [AccountType.Individual] })}
              >
                Register as Individual
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
