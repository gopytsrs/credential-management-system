"use client";

import React from "react";
import { Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ZERO_ADDRESS } from "~~/utils/scaffold-eth";

interface IFormInput {
  title: string;
  issuer: string;
  data: string;
}
const CreateCredentialForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const {
    writeAsync: createCredential,
    isLoading,
    isMining,
  } = useScaffoldContractWrite({
    contractName: "CredentialManager",
    functionName: "createCredential",
    args: ["", "", ""],
  });
  const onSubmit: SubmitHandler<IFormInput> = async data => {
    console.log(data);
    try {
      await createCredential({
        args: [data.title, data.issuer || ZERO_ADDRESS, data.data],
      });
      toast.success("Credential succesfully created!");
      reset();
    } catch (e) {
      console.log(e);
      toast.error("Error creating credential");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Title</span>
            {errors.title && <span className="text-error">Title is required</span>}
          </div>
          <input
            disabled={isLoading || isMining}
            {...register("title", { required: true })}
            type="text"
            placeholder="Enter the title of the credential here"
            className={`input input-bordered w-full rounded-lg ${errors.title ? "input-error" : ""}`}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Issuer</span>
          </div>
          <input
            disabled={isLoading || isMining}
            {...register("issuer", { required: false })}
            type="text"
            placeholder="Enter the issuing organization address or leave this empty"
            className="input input-bordered w-full rounded-lg"
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Data</span>
          </div>
          <input
            disabled={isLoading || isMining}
            {...register("data", { required: false })}
            type="text"
            placeholder="Enter any data for the credential here"
            className="input input-bordered w-full rounded-lg"
          />
        </label>
        <button disabled={isLoading || isMining} type="submit" className="btn w-full mt-4">
          {isLoading || isMining ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <>
              {" "}
              <Save />
              Create Credential
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateCredentialForm;
