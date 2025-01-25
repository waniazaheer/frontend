"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
}
export default function Dashbord() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const fetchJobs = async (page: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/admin/jobs?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch {
      toast.error("Failed to fetch jobs.");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log('token', token)
    if (!token) {
      router.push("/login");
    } else {
      fetchJobs(currentPage);
    }
  }, [currentPage, router]);
  const handleDelete = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/jobs/${jobId}`);
      toast.success("Job deleted successfully.");
      fetchJobs(currentPage);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    }
  };
  const handleCreateJob = () => {
    router.push("/dashbord/create");
  };
  const handleEditJob = (id: string) => {
    router.push(`/dashboard/${id}/edit`);
  };
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-red-600 text-white p-6 shadow-md">
          <h1 className="text-2xl font-bold">Admin Job Management</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">All Jobs</h2>
            <button
              onClick={handleCreateJob}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Create Job
            </button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-4 border-b">Job Title</th>
                    <th className="p-4 border-b">Department</th>
                    <th className="p-4 border-b">Location</th>
                    <th className="p-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-100">
                        <td className="p-4 border-b">{job.title}</td>
                        <td className="p-4 border-b">{job.department}</td>
                        <td className="p-4 border-b">{job.location}</td>
                        <td className="p-4 border-b">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditJob(job._id)}
                              className="text-blue-500 hover:text-blue-700 p-2 rounded-full transition"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(job._id)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 border-b text-center" colSpan={4}>
                        No jobs available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
