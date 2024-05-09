import React from "react";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth";

interface Props {
  credentialId: bigint;
}

const ViewCredentialDialog = ({ credentialId }: Props) => {
  const { data: credential } = useScaffoldContractRead({
    contractName: "CredentialManager",
    functionName: "viewCredential",
    args: [credentialId],
  });
  console.log(credentialId, credential);
  return (
    <form>
      <div className="flex flex-col gap-4">
        Credential ID: {`${credentialId}`}
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg"
            defaultValue={credential?.title}
            disabled
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">User</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg"
            defaultValue={credential?.ownerAddress}
            disabled
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Data</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg"
            defaultValue={credential?.data}
            disabled
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Issuer</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg"
            defaultValue={credential?.issuerAddress === ZERO_ADDRESS ? "-" : credential?.issuerAddress}
            disabled
          />
        </label>
      </div>
    </form>
  );
};

export default ViewCredentialDialog;
