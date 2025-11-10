import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getUpcomingJobs = () => axios.get(`${BASE_URL}/jobs/upcoming`);
export const getHistoryJobs = () => axios.get(`${BASE_URL}/jobs/history`);
export const addJob = (job) => axios.post(`${BASE_URL}/schedule/job`, job);
export const updateJob = (id, job) => axios.put(`${BASE_URL}/jobs/${id}`, job);
export const deleteJob = (id) => axios.delete(`${BASE_URL}/jobs/${id}`);
export const getJobDetails = (id) => axios.get(`${BASE_URL}/jobs/${id}`);