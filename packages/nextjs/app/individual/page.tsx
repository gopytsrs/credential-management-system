"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Drawer from "~~/components/individual/Drawer";
import OwnedCredentials from "~~/components/individual/credentials/OwnedCredentials";
import ProfileForm from "~~/components/individual/profile/ProfileForm";
import RejectedRequests from "~~/components/individual/rejected/RejectedRequests";
import IncomingRequests from "~~/components/individual/requests/IncomingRequests";
import SharedCredentials from "~~/components/individual/shared/SharedCredentials";
import { AccountType, useGlobalState } from "~~/services/store/store";

export enum IndividualTabs {
  Profile,
  Credentials,
  Requests,
  Shared,
  Rejected,
}

const IndividualMainPage = () => {
  const [activeTab, setActiveTab] = useState<IndividualTabs>(IndividualTabs.Profile);
  const { accountType } = useGlobalState(state => ({
    accountType: state.accountType,
  }));
  if (accountType === AccountType.None) redirect("/register");
  return (
    <div className="flex w-full h-full">
      <Drawer activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === IndividualTabs.Profile && <ProfileForm />}
      {activeTab === IndividualTabs.Credentials && <OwnedCredentials />}
      {activeTab === IndividualTabs.Requests && <IncomingRequests />}
      {activeTab === IndividualTabs.Shared && <SharedCredentials />}
      {activeTab === IndividualTabs.Rejected && <RejectedRequests />}
    </div>
  );
};
export default IndividualMainPage;
