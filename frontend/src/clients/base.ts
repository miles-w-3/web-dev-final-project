import axios, { AxiosError } from "axios";
import { useAuthContext } from "../state/useAuthContext";

const webClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export default webClient;