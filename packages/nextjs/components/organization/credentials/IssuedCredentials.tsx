import React from "react";
import IssueCredentialForm from "./IssueCredentialForm";
import { Plus } from "lucide-react";
import { useAddress, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const IssuedCredentials = () => {
  const { address } = useAddress();
  const { data: credentials } = useScaffoldContractRead({
    contractName: "CredentialManager",
    functionName: "viewIssuerToCredentials",
    args: [address || ""],
  });
  console.log(credentials);
  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-4xl font-medium">Credentials</h1>
      <h2 className="mt-4 text-2xl">
        This page shows credentials your organization has issued. You can also issue new ones.
      </h2>
      <button
        className="mt-6 mb-8 btn btn-wide rounded-lg btn-primary"
        onClick={() => (document.getElementById("issue_credential_dialog_form") as HTMLDialogElement).showModal()}
      >
        Issue credential <Plus />
      </button>
      <dialog id="issue_credential_dialog_form" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Issue New Credential</h3>
          <IssueCredentialForm />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="close-dialog"></button>
        </form>
      </dialog>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {!credentials?.length && (
              <tr>
                <td className="text-center" colSpan={3}>
                  No issued credentials yet. Start issuing one now.
                </td>
              </tr>
            )}
            {credentials?.map(c => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.ownerAddress}</td>
                <td>{c.data || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssuedCredentials;
