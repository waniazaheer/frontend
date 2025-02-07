"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

const Login = () => {
  const [user, setUser] = useState({ Email: "", Password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/validate`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.valid) {
            router.replace("/dashbord");
          }
        } catch (err) {
          console.error("Token validation failed:", err);
          localStorage.clear();
        }
      }
    };

    checkUserLoggedIn();
  }, [router]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.Email || !user.Password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      console.log("API_URL:", API_URL);
      const response = await axios.post(`${API_URL}/login`, user);
      console.log("Login response:", response);

      const { success, token, userData } = response.data;
      if (success) {
        toast.success("User Logged in Successfully");
        localStorage.setItem("isUserLoggedIn", JSON.stringify(true));
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);

        if (userData.role === "admin") {
          router.push("/dashbord");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
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
              Login
            </h1>
            <span className="w-6" />
          </div>
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={user.Email}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-grey rounded-lg"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              placeholder="Password"
              value={user.Password}
              onChange={changeHandler}
              required
              className="w-full p-3 mb-4 border border-grey rounded-lg pr-10"
            />
            <div
              className="absolute inset-y-0 right-3 top-4 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
          <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg">
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          New here?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-red-500 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
