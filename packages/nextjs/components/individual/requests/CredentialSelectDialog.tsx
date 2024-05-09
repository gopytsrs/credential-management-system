import React from "react";
import { CheckCheck } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddress, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface Props {
  requestId: bigint;
}

interface IFormInput {
  credentialId: string;
}
const CredentialSelectDialog = ({ requestId }: Props) => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const { address } = useAddress();
  const { data: credentials } = useScaffoldContractRead({
    contractName: "CredentialManager",
    functionName: "viewUserToCredentials",
    args: [address || ""],
  });

  const {
    writeAsync: acceptRequest,
    isMining,
    isLoading,
  } = useScaffoldContractWrite({
    contractName: "RequestManager",
    functionName: "acceptRequest",
    args: [BigInt(0), BigInt(0)],
  });

  const inLoadingState = isMining || isLoading;

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    console.log(data);
    try {
      await acceptRequest({ args: [requestId, BigInt(data.credentialId)] });
      toast.success("Request accepted and credential shared succesfully!");
    } catch (e) {
      console.log(e);
      toast.error("Error accepting request");
    }
  };

  return (
    <form className="flex flex-col gap-4 items-start" onSubmit={handleSubmit(onSubmit)}>
      <div>Available Credentials</div>
      <select
        className="select select-bordered w-full rounded-lg"
        {...register("credentialId")}
        disabled={inLoadingState}
      >
        <option disabled>Select the credential to share</option>
        {credentials?.map(c => (
          <option key={c.id} value={`${c.id}`}>
            {c.title}
          </option>
        ))}
      </select>
      <button className="btn w-full btn-primary rounded-lg" type="submit" disabled={inLoadingState}>
        {inLoadingState ? (
          <span className="loading loading-bars loading-lg"></span>
        ) : (
          <>
            Share
            <CheckCheck />
          </>
        )}
      </button>
    </form>
  );
};

export default CredentialSelectDialog;
