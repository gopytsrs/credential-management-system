"use client";

import React from "react";
import { Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth";

interface IFormInput {
  title: string;
  issuer: string;
  data: string;
}

interface Props {
  id: bigint;
  title: string;
  issuerAddress: string;
  data: string;
}

const UpdateCredentialForm = ({ id, title, issuerAddress, data }: Props) => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const { writeAsync: createCredential } = useScaffoldContractWrite({
    contractName: "CredentialManager",
    functionName: "updateCredential",
    args: [BigInt(0), "", "", ""],
  });
  const onSubmit: SubmitHandler<IFormInput> = async data => {
    console.log(data);
    try {
      await createCredential({
        args: [id, data.title, data.issuer || ZERO_ADDRESS, data.data],
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Title</span>
          </div>
          <input
            defaultValue={title}
            {...register("title", { required: true })}
            type="text"
            placeholder="Enter the title of the credential here"
            className="input input-bordered w-full "
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">User</span>
          </div>
          <input
            defaultValue={issuerAddress === ZERO_ADDRESS ? "" : issuerAddress}
            {...register("issuer", { required: false })}
            type="text"
            placeholder="Enter the issuing organization address or leave this empty"
            className="input input-bordered w-full "
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Data</span>
          </div>
          <input
            defaultValue={data}
            {...register("data", { required: true })}
            type="text"
            placeholder="Enter any data for the credential here"
            className="input input-bordered w-full "
          />
        </label>
        <button type="submit" className="btn w-full mt-4">
          <Save />
          Update Credential
        </button>
      </div>
    </form>
  );
};

export default UpdateCredentialForm;
