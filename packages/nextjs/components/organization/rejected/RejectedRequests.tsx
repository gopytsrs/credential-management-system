import React from "react";
import { useAddress, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const RejectedRequests = () => {
  const { address: organization } = useAddress();
  const { data: events } = useScaffoldEventHistory({
    contractName: "RequestManager",
    eventName: "RequestRejected",
    fromBlock: BigInt(0),
    filters: { organization },
  });
  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-4xl font-medium">Rejected</h1>
      <h2 className="mt-4 mb-6 text-2xl">
        This page shows the history of all past requests that users have rejected from your organisation.
      </h2>
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
            {!events?.length && (
              <tr>
                <td className="text-center" colSpan={2}>
                  Your organization has no rejected requests currently.
                </td>
              </tr>
            )}
            {events?.map(e => (
              <tr key={e.args.requestId}>
                <td>{e.args.title}</td>
                <td>{e.args.individual}</td>
                <td>{e.args.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectedRequests;
