"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>(); // Explicit typing for useParams
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      toast.error("Token is missing or invalid.");
      setTimeout(() => {
        router.push("/"); // Redirect to login if no token
      }, 3000);
    }
  }, [token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { password });


      console.log("API Response:", response.data); 
      if (response.data.success) {
        toast.success("Password reset successfully.");
        setTimeout(() => {
          router.push("/"); 
        }, 2000);
      } else {
        toast.error(response.data.msg || "Error resetting password.");
      }
    } catch (error) {
      console.error("API Error:", error); 
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg || "An error occurred.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
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
            <h1 className="text-3xl font-bold text-red-500 text-center flex-1">
              Reset Password
            </h1>
          </div>


          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password"
            value={password}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />
          <div
            className="absolute inset-y-0 right-3 top-4 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>

       
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />
          <div
            className="absolute inset-y-0 right-3 top-4 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

