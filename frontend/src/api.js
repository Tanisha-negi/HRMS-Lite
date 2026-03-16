import axios from 'axios';

// Ensure this matches your Django server address
const API_URL = 'https://hrms-lite-f0w0.onrender.com/api'; 

// Fetch all employees
export const getEmployees = () => {
    return axios.get(`${API_URL}/employees/`);
};

// Add new employee
export const addEmployee = (data) => {
    return axios.post(`${API_URL}/employees/`, data);
};

// Delete an employee
export const deleteEmployee = (id) => {
    return axios.delete(`${API_URL}/employees/${id}/`);
};

// Mark attendance
export const markAttendance = (data) => {
    return axios.post(`${API_URL}/attendance/`, data);
};