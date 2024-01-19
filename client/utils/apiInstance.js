import axios from "axios";
import config from "../app.constant";

const axiosInstance = axios.create({
  baseURL: `${config.API_URL}`
});

export default axiosInstance;
