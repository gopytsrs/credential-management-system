import React from "react";
import toast from "react-hot-toast";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface Props {
  requestId: bigint;
  closeDialog: () => void;
}

const RejectRequestConfirmationDialog = ({ requestId, closeDialog }: Props) => {
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "RequestManager",
    functionName: "rejectRequest",
    args: [BigInt(0)],
  });

  const rejectRequest = async () => {
    try {
      await writeAsync({ args: [requestId] });
      toast.success("Request rejected successfully");
      closeDialog();
    } catch (e) {
      console.log(e);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-md font-medium">Confirm to reject this request?</div>
      <button className="btn btn-primary rounded-lg max-w-xs" onClick={rejectRequest}>
        Yes
      </button>
      <button className="btn btn-primary rounded-lg max-w-xs">No</button>
    </div>
  );
};

export default RejectRequestConfirmationDialog;
