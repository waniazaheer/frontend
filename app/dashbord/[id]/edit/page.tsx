"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const UpdateJob = () => {
    const router = useRouter();
    const { id } = useParams();

    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        requirements: '',
        additionalNotes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setJobData({ ...jobData, [name]: value });
    };

   
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token not found!");
                    return;
                }

                const response = await axios.get(`http://localhost:5000/getSinglejobs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setJobData(response.data);
            } catch (error) {
                console.error("Error fetching job:", error);
            }
        };

        if (id) fetchJob();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Token not found!");
                return;
            }

            const response = await axios.patch(`http://localhost:5000/updatejobs/${id}`, jobData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Job updated:", response.data);
            router.push("/dashbord");
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    return (
        <div className="w-3/5 mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-center text-red-600">Update Job</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={jobData.title} onChange={handleChange} required />

                <label htmlFor="company">Company</label>
                <input type="text" name="company" value={jobData.company} onChange={handleChange} required />

                <label htmlFor="location">Location</label>
                <input type="text" name="location" value={jobData.location} onChange={handleChange} required />

                <label htmlFor="salary">Salary</label>
                <input type="text" name="salary" value={jobData.salary} onChange={handleChange} />

                <label htmlFor="description">Description</label>
                <textarea name="description" value={jobData.description} onChange={handleChange} />

                <label htmlFor="requirements">Requirements</label>
                <textarea name="requirements" value={jobData.requirements} onChange={handleChange} />

                <label htmlFor="additionalNotes">Additional Notes</label>
                <textarea name="additionalNotes" value={jobData.additionalNotes} onChange={handleChange} />

                <button type="submit">Update Job</button>
            </form>
        </div>
    );
};

export default UpdateJob;
