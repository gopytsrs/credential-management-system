import React from "react";
import CredentialSelectDialog from "./CredentialSelectDialog";
import RejectRequestConfirmationDialog from "./RejectRequestConfirmationDialog";
import { Check, X } from "lucide-react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useAddress } from "~~/hooks/scaffold-eth";

const IncomingRequests = () => {
  const { address } = useAddress();
  const { data: requests } = useScaffoldContractRead({
    account: address,
    contractName: "RequestManager",
    functionName: "viewUserPendingRequests",
  });
  console.log(requests);
  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-4xl font-medium">Requests</h1>
      <h2 className="mt-4 mb-6 text-2xl">
        This page shows incoming requests from organisations, you can accept or reject.
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Requesting Organisation</th>
              <th>Purpose</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!requests?.length && (
              <tr>
                <td className="text-center" colSpan={4}>
                  <p>No incoming requests yet. Wait for organizations to send you requests.</p>
                </td>
              </tr>
            )}
            {requests?.map(r => (
              <React.Fragment key={r.requestId}>
                <tr>
                  <td>{r.title}</td>
                  <td>{r.requester}</td>
                  <td>{r.purpose}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-primary rounded-lg"
                      onClick={() =>
                        (
                          document.getElementById(`approve_request_${r.requestId}_dialog_form`) as HTMLDialogElement
                        ).showModal()
                      }
                    >
                      Accept <Check />
                    </button>
                    <button
                      className="btn btn-primary rounded-lg"
                      onClick={() =>
                        (
                          document.getElementById(`reject_request_${r.requestId}_dialog`) as HTMLDialogElement
                        ).showModal()
                      }
                    >
                      Reject <X />
                    </button>
                  </td>
                </tr>
                <dialog id={`approve_request_${r.requestId}_dialog_form`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Select Credential to Share</h3>
                    <CredentialSelectDialog requestId={r.requestId} />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button aria-label="close-dialog"></button>
                  </form>
                </dialog>
                <dialog id={`reject_request_${r.requestId}_dialog`} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Reject Request</h3>
                    <RejectRequestConfirmationDialog
                      requestId={r.requestId}
                      closeDialog={() =>
                        (document.getElementById(`reject_request_${r.requestId}_dialog`) as HTMLDialogElement).close()
                      }
                    />
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button aria-label="close-dialog"></button>
                  </form>
                </dialog>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomingRequests;
