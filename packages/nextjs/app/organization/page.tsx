"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Drawer from "~~/components/organization/Drawer";
import ApprovedRequests from "~~/components/organization/approved/ApprovedRequests";
import IssuedCredentials from "~~/components/organization/credentials/IssuedCredentials";
import ProfileForm from "~~/components/organization/profile/ProfileForm";
import RejectedRequests from "~~/components/organization/rejected/RejectedRequests";
import PendingRequests from "~~/components/organization/requests/PendingRequests";
import { AccountType, useGlobalState } from "~~/services/store/store";

export enum OrganizationTabs {
  Profile,
  Credentials,
  Requests,
  Approved,
  Rejected,
}

const OrganizationMainPage = () => {
  const [activeTab, setActiveTab] = useState<OrganizationTabs>(OrganizationTabs.Profile);
  const { accountType } = useGlobalState(state => ({
    accountType: state.accountType,
  }));
  if (accountType === AccountType.None) redirect("/register");
  return (
    <div className="flex w-full h-full">
      <Drawer activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === OrganizationTabs.Profile && <ProfileForm />}
      {activeTab === OrganizationTabs.Credentials && <IssuedCredentials />}
      {activeTab === OrganizationTabs.Requests && <PendingRequests />}
      {activeTab === OrganizationTabs.Approved && <ApprovedRequests />}
      {activeTab === OrganizationTabs.Rejected && <RejectedRequests />}
    </div>
  );
};
export default OrganizationMainPage;
