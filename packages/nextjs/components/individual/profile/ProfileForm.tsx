"use client";

import React from "react";
import { Save } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Address } from "~~/components/scaffold-eth/Address";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAddress } from "~~/hooks/scaffold-eth";

interface IFormInput {
  name: string;
  emailAddress: string;
  phoneNumber: string;
}

const ProfileForm = () => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const { address } = useAddress();
  const {
    writeAsync: createOrUpdateProfile,
    isLoading,
    isMining,
  } = useScaffoldContractWrite({
    account: address,
    contractName: "IndividualAccount",
    args: ["", "", ""],
    functionName: "createOrUpdateProfile",
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { data: initialData } = useScaffoldContractRead({
    account: address,
    contractName: "IndividualAccount",
    functionName: "viewProfile",
  });

  const inLoadingState = isLoading || isMining;

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    console.log(data);
    const { name, emailAddress, phoneNumber } = data;
    try {
      await createOrUpdateProfile({ args: [name, emailAddress, phoneNumber] });
      toast.success("Profile updated successfully");
    } catch (e) {
      console.log(e);
      toast.error("Error updating profile");
    }
  };

  return (
    <form className="w-full h-screen p-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-4xl font-medium">Profile</h1>
      <div className="flex flex-col gap-4">
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Address</span>
          </div>
          <Address address={address} />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Name</span>
          </div>
          <input
            disabled={inLoadingState}
            defaultValue={initialData?.name}
            {...register("name", { required: true })}
            type="text"
            placeholder="Type your name here"
            className="input input-bordered w-full "
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Email address</span>
          </div>
          <input
            disabled={inLoadingState}
            defaultValue={initialData?.email}
            {...register("emailAddress", { required: true })}
            type="text"
            placeholder="Type your email here"
            className="input input-bordered w-full "
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">Phone number</span>
          </div>
          <input
            disabled={inLoadingState}
            defaultValue={initialData?.phoneNumber}
            {...register("phoneNumber", { required: true })}
            type="text"
            placeholder="Type your phone number here"
            className="input input-bordered w-full "
          />
        </label>
        <button disabled={inLoadingState} type="submit" className="btn btn-primary w-1/6 mt-4">
          {inLoadingState ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <>
              {" "}
              <Save />
              Update
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
