import axios from "axios";
import { supabase } from "../utils/supabase";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

export default apiClient;
