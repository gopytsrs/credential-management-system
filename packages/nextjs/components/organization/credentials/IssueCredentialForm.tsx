"use client";

import React from "react";
import { Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface IFormInput {
  title: string;
  userAddress: string;
  data: string;
}
const IssueCredentialForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const {
    writeAsync: issueCredential,
    isLoading,
    isMining,
  } = useScaffoldContractWrite({
    contractName: "CredentialManager",
    functionName: "issueCredential",
    args: ["", "", ""],
  });
  const onSubmit: SubmitHandler<IFormInput> = async data => {
    try {
      await issueCredential({ args: [data.title, data.data, data.userAddress] });
      toast.success("Credential successfully issued");
      reset({ title: "", userAddress: "", data: "" });
    } catch (e) {
      toast.error("Error issuing credential");
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
            <span className="label-text">User</span>
            {errors.userAddress && <span className="text-error">{errors.userAddress.message}</span>}
          </div>
          <input
            disabled={isLoading || isMining}
            {...register("userAddress", { required: "User address is required" })}
            type="text"
            placeholder="Enter the user's address here"
            className={`input input-bordered w-full rounded-lg ${errors.userAddress ? "input-error" : ""}`}
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
        <button type="submit" className="btn w-full mt-4" disabled={isLoading || isMining}>
          {isLoading || isMining ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <>
              {" "}
              <Save />
              Issue Credential
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default IssueCredentialForm;
