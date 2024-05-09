"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Cat } from "lucide-react";
import type { NextPage } from "next";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useIsConnected } from "~~/hooks/scaffold-eth/useIsConnected";

const Home: NextPage = () => {
  const { isConnected } = useIsConnected();
  useEffect(() => {
    if (isConnected) {
      redirect("/register");
    }
  }, [isConnected]);
  return (
    <div className="hero min-h-screen ">
      <div className="hero-content text-center">
        <div className="flex flex-col items-center max-w-lg">
          <Cat size={40} />
          <h1 className="text-5xl font-bold">Credential Management System</h1>
          <p className="text-2xl py-6">
            Create, issue and manage credentials. Both as an individual and as an organization. Start by connecting your
            wallet.
          </p>
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Home;
