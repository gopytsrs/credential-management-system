"use client";

import React from "react";
import { Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface Props {
  refetch: (
    options?:
      | {
          throwOnError: boolean;
          cancelRefetch: boolean;
        }
      | undefined,
  ) => Promise<
    readonly {
      requestId: bigint;
      requester: string;
      requestee: string;
      purpose: string;
      title: string;
      status: number;
      credentialId: bigint;
    }[]
  >;
}
interface IFormInput {
  purpose: string;
  title: string;
  user: string;
}
const CreateRequestForm = ({ refetch }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const {
    writeAsync: createRequest,
    isLoading,
    isMining,
  } = useScaffoldContractWrite({
    contractName: "RequestManager",
    functionName: "createRequest",
    args: ["", "", ""],
  });
  const onSubmit: SubmitHandler<IFormInput> = async data => {
    try {
      await createRequest({ args: [data.purpose, data.title, data.user] });
      toast.success("Request created successfully");
      reset({ purpose: "", title: "", user: "" });
      await refetch();
    } catch (e) {
      console.log(e);
      toast.error("Could not create request");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Title</span>
            {errors.title && <span className="text-error">{errors.title.message}</span>}
          </div>
          <input
            disabled={isMining || isLoading}
            {...register("title", { required: "Title is required" })}
            type="text"
            placeholder="Enter the title of the request here"
            className={`input input-bordered w-full rounded-lg ${errors.title ? "input-error" : ""}`}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">User</span>
            {errors.user && <span className="text-error">{errors.user.message}</span>}
          </div>
          <input
            disabled={isMining || isLoading}
            {...register("user", { required: "User address is required" })}
            type="text"
            placeholder="Enter the user's address here"
            className={`input input-bordered w-full rounded-lg ${errors.user ? "input-error" : ""}`}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Purpose</span>
            {errors.purpose && <span className="text-error">{errors.purpose.message}</span>}
          </div>
          <input
            disabled={isMining || isLoading}
            {...register("purpose", { required: "Purpose is required" })}
            type="text"
            placeholder="Enter the purpose for the request here"
            className={`input input-bordered w-full rounded-lg ${errors.purpose ? "input-error" : ""}`}
          />
        </label>
        <button disabled={isMining || isLoading} type="submit" className="btn w-full mt-4">
          {isLoading || isMining ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <>
              {" "}
              <Save />
              Create Request
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateRequestForm;
