import axios from "axios";
export default axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://homedoc-backend-69l2.onrender.com",
  withCredentials: true,
});
