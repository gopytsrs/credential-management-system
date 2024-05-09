import React from "react";
import CreateRequestForm from "./CreateRequestForm";
import { Plus } from "lucide-react";
import { useAddress, useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const PendingRequests = () => {
  const { address } = useAddress();
  const {
    data: requests,
    isLoading,
    isRefetching,
    isFetching,
    refetch,
  } = useScaffoldContractRead({
    account: address,
    contractName: "RequestManager",
    functionName: "viewPendingRequests",
  });

  const inLoadingState = isLoading || isRefetching || isFetching;

  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-4xl font-medium">Requests</h1>
      <h2 className="mt-4 text-2xl">This page shows outgoing pending requests from your organisation.</h2>
      <button
        className="mt-6 mb-8 btn btn-wide rounded-lg btn-primary"
        onClick={() => (document.getElementById("create_new_request_form") as HTMLDialogElement).showModal()}
      >
        Create new request <Plus />
      </button>
      <dialog id="create_new_request_form" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create New Request</h3>
          <CreateRequestForm refetch={refetch} />
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
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {inLoadingState ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              <>
                {" "}
                {!requests?.length && (
                  <tr>
                    <td colSpan={3} className="text-center">
                      No requests yet, create a new one
                    </td>
                  </tr>
                )}
                {requests?.map(r => (
                  <tr key={r.requestId}>
                    <td>{r.title}</td>
                    <td>{r.requestee}</td>
                    <td>{r.purpose}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRequests;
