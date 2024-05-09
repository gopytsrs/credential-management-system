import React from "react";
import CreateCredentialForm from "./CreateCredentialForm";
import UpdateCredentialForm from "./UpdateCredentialForm";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useAddress } from "~~/hooks/scaffold-eth";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth";

const OwnedCredentials = () => {
  const { address } = useAddress();

  const { data: credentials } = useScaffoldContractRead({
    contractName: "CredentialManager",
    functionName: "viewUserToCredentials",
    args: [address || ""],
  });

  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-4xl font-medium">Credentials</h1>
      <h2 className="mt-4 text-2xl">
        This page shows the credentials you created or have been issued. You can also create new ones
      </h2>
      <button
        className="mt-6 mb-8 btn btn-wide rounded-lg btn-primary"
        onClick={() => (document.getElementById("create_credential_dialog_form") as HTMLDialogElement).showModal()}
      >
        Add new credential <Plus />
      </button>
      <dialog id="create_credential_dialog_form" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Credential</h3>
          <CreateCredentialForm />
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
              <th>Issuer</th>
              <th>Data</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!credentials?.length && (
              <tr>
                <td className="text-center" colSpan={4}>
                  You have no credentials yet. Create one or wait for an organization to issue you one.
                </td>
              </tr>
            )}
            {credentials?.map(c => (
              <>
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.issuerAddress === ZERO_ADDRESS ? "-" : c.issuerAddress}</td>
                  <td>{c.data || "-"}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn rounded-lg btn-primary"
                      onClick={() =>
                        (
                          document.getElementById(`update_credential_${c.id}_dialog_form`) as HTMLDialogElement
                        ).showModal()
                      }
                    >
                      <Pencil />
                    </button>
                    {/* <button className="btn rounded-lg btn-primary">
                      <Trash2 />
                    </button> */}
                  </td>
                </tr>
                <dialog id={`update_credential_${c.id}_dialog_form`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Update Credential</h3>
                    <UpdateCredentialForm {...c} />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button aria-label="close-dialog"></button>
                  </form>
                </dialog>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnedCredentials;
