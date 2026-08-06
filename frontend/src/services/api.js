import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-recruitment-system-3.onrender.com",
});

export default api;