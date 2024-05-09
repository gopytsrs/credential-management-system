"use client";

import { Dispatch, SetStateAction } from "react";
import { CreditCard, FileClock, MailOpen, Share2, SquareUser } from "lucide-react";
import { IndividualTabs } from "~~/app/individual/page";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface Props {
  activeTab: IndividualTabs;
  setActiveTab: Dispatch<SetStateAction<IndividualTabs>>;
}

const Drawer = ({ activeTab, setActiveTab }: Props) => {
  const changeTab = (tab: IndividualTabs) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };
  return (
    <ul className="menu bg-base-300 w-1/6 h-screen gap-2">
      <li>
        <RainbowKitCustomConnectButton />
      </li>
      <li>
        <button onClick={() => changeTab(IndividualTabs.Profile)}>
          <SquareUser size={16} />
          Profile
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(IndividualTabs.Credentials)}>
          <CreditCard size={16} />
          Credentials
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(IndividualTabs.Requests)}>
          <MailOpen size={16} />
          Requests
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(IndividualTabs.Shared)}>
          <Share2 size={16} />
          Shared
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(IndividualTabs.Rejected)}>
          <FileClock size={16} />
          Rejected
        </button>
      </li>

      <li className="justify-self-start">
        <SwitchTheme />
      </li>
    </ul>
  );
};

export default Drawer;
