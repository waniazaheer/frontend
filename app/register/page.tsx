"use client";
import React, { useState } from "react";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import axios, { AxiosError } from 'axios';


const Register = () => {
  const [user, setUser] = useState({
    Name: '',
    Email: '',
    Phone_num: '',
    Password: '',
    confirmPassword: '',
    image: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (user.Password !== user.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
  
      await axios.post(`${API_URL}/register`, {
        Name: user.Name,
        Email: user.Email,
        Phone_num: user.Phone_num,
        Password: user.Password,
        image: user.image,
      });
  
      toast.success('User Registered Successfully');
      router.push('/login');
    } catch (error) {
      const err = error as AxiosError<{ msg?: string }>; 
      toast.error(err.response?.data?.msg || "An error occurred");
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
              Sign Up
            </h1>
            <span className="w-6" />
          </div>

          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={user.Name}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={user.Email}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <input
            type="text"
            name="Phone_num"
            placeholder="Phone Number"
            value={user.Phone_num}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border rounded-lg"
          />
        
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              placeholder="Password"
              value={user.Password}
              onChange={changeHandler}
              required
              className="w-full p-3 mb-4 border rounded-lg pr-10"
            />
            <div
              className="absolute inset-y-4 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={changeHandler}
              required
              className="w-full p-3 mb-6 border rounded-lg pr-10"
            />
            <div
              className="absolute inset-y-4 right-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>

          <button className="w-full py-3 bg-red-500 text-white rounded-lg">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already registered?{" "}
          <button
            onClick={() => router.push('/Login')}
            className="text-red-500 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
