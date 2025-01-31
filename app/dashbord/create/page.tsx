"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

const CreateJob = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    additionalNotes: "",
  });

  const router = useRouter();

  // Handle input changes
  const changeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({ ...prevJob, [name]: value }));
  };


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        job,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        }
      );

      if (response.data?.success) {
        toast.success("Job created successfully!");
        setTimeout(() => router.push("/dashbord"), 1500);
      } else {
        const errorMsg = response.data?.message || "Failed to create job.";
        console.error("Backend Error:", errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage = error.response?.data?.message || "An error occurred";
        console.error("Axios Error:", serverMessage, error.response);
        toast.error(serverMessage);
      } else {
        console.error("Unexpected Error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <ToastContainer />
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <form onSubmit={submitHandler}>
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => router.push("/dashbord")}
              className="text-red-500 hover:underline flex items-center"
            >
              <FiArrowLeft size={24} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-red-500 text-center flex-1">
              Create Job
            </h1>
            <span className="w-6" />
          </div>

       
          {["title", "company", "location", "salary"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={job[field as keyof typeof job]}
              onChange={changeHandler}
              required={field !== "salary"}
              className="w-full p-3 mb-4 border border-gray-300 bg-gray-100 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ))}

          <textarea
            name="description"
            placeholder="Job Description"
            value={job.description}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-gray-300 bg-gray-100 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            name="requirements"
            placeholder="Requirements (optional)"
            value={job.requirements}
            onChange={changeHandler}
            className="w-full p-3 mb-4 border border-gray-300 bg-gray-100 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            name="additionalNotes"
            placeholder="Additional Notes (optional)"
            value={job.additionalNotes}
            onChange={changeHandler}
            className="w-full p-3 mb-4 border border-gray-300 bg-gray-100 text-black placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300">
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;

