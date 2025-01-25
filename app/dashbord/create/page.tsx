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

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = localStorage.getItem("user");
      const userId = user ? JSON.parse(user)._id : null;

      if (!userId) {
        toast.error("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/jobs", {
        ...job,
        createdBy: userId,
      });

      const { success } = response.data;

      if (success) {
        toast.success("Job created successfully");
        setTimeout(() => router.push("/dashbord/jobs"), 1500); 
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightgrey text-black">
      <ToastContainer />
      <div className="w-full max-w-lg p-8 bg-grey shadow-lg rounded-lg">
        <form onSubmit={submitHandler}>
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => router.push("/jobs")}
              className="text-red-500 hover:underline flex items-center"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-red-500 text-center flex-1">
              Create Job
            </h1>
            <span className="w-6" />
          </div>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={job.title}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={job.company}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary (optional)"
            value={job.salary}
            onChange={changeHandler}
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={job.description}
            onChange={changeHandler}
            required
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <textarea
            name="requirements"
            placeholder="Requirements (optional)"
            value={job.requirements}
            onChange={changeHandler}
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
          />

          <textarea
            name="additionalNotes"
            placeholder="Additional Notes (optional)"
            value={job.additionalNotes}
            onChange={changeHandler}
            className="w-full p-3 mb-4 border border-grey bg-lightgrey text-black placeholder-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-grey transition duration-200 ease-in-out"
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
