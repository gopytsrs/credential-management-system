import React from "react";
import { Info } from "lucide-react";
import ViewCredentialDialog from "~~/components/organization/approved/ViewCredentialDialog";
import { useAddress, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const SharedCredentials = () => {
  const { address: individual } = useAddress();
  const { data: events } = useScaffoldEventHistory({
    contractName: "RequestManager",
    eventName: "RequestAccepted",
    fromBlock: BigInt(0),
    filters: { individual },
  });

  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-4xl font-medium">Shared</h1>
      <h2 className="mt-4 mb-6 text-2xl">
        This page shows the credentials that you have approved to share with organisations.
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Title</th>
              <th>Requesting Organisation</th>
              <th>Credential ID</th>
              <th>Credential Details</th>
            </tr>
          </thead>
          <tbody>
            {!events?.length && (
              <tr>
                <td className="text-center" colSpan={4}>
                  You have not shared any credentials with organizations currently.
                </td>
              </tr>
            )}
            {events?.map(e => (
              <tr key={e.args.requestId}>
                <td>{e.args.title}</td>
                <td>{e.args.organization}</td>
                <td>{`${e.args.credentialId}`}</td>
                <td>
                  <button
                    className="btn btn-md btn-primary rounded-lg"
                    onClick={() =>
                      (
                        document.getElementById(`view_credential_${e.args.requestId}_dialog`) as HTMLDialogElement
                      ).showModal()
                    }
                  >
                    <Info />
                    View Details
                  </button>
                  <dialog id={`view_credential_${e.args.requestId}_dialog`} className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Credential Details</h3>
                      <ViewCredentialDialog credentialId={e.args.credentialId as bigint} />
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button aria-label="close-dialog"></button>
                    </form>
                  </dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SharedCredentials;
