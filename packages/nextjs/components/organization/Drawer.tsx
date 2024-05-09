"use client";

import { Dispatch, SetStateAction } from "react";
import { CreditCard, FileClock, HardDriveDownload, Send, SquareUser } from "lucide-react";
import { OrganizationTabs } from "~~/app/organization/page";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface Props {
  activeTab: OrganizationTabs;
  setActiveTab: Dispatch<SetStateAction<OrganizationTabs>>;
}

const Drawer = ({ activeTab, setActiveTab }: Props) => {
  const changeTab = (tab: OrganizationTabs) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };
  return (
    <ul className="menu bg-base-300 w-1/6 h-screen gap-2">
      <li>
        <RainbowKitCustomConnectButton />
      </li>
      <li>
        <button onClick={() => changeTab(OrganizationTabs.Profile)}>
          <SquareUser size={16} />
          Profile
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(OrganizationTabs.Credentials)}>
          <CreditCard size={16} />
          Credentials
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(OrganizationTabs.Requests)}>
          <Send size={16} />
          Requests
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(OrganizationTabs.Approved)}>
          <HardDriveDownload size={16} />
          Approved
        </button>
      </li>
      <li>
        <button onClick={() => changeTab(OrganizationTabs.Rejected)}>
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
