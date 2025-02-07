"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/forgetPassword`, { Email: email });


      if (response.data.success) {
        toast.success("Password reset link sent to your email.");
      } else {
        toast.error("Email not found.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightgrey text-black">
      <ToastContainer />
      <div className="w-full max-w-md p-8 bg-grey shadow-lg rounded-lg">
        <form onSubmit={submitHandler}>
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-red-500 hover:underline flex items-center"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-red-500 text-center flex-1">
              Forgot Password
            </h1>
            <span className="w-6" />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center mt-4">
          Remembered your password?{" "}
          <button
            onClick={() => router.push("/Login")}
            className="text-red-500 hover:underline transition duration-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
