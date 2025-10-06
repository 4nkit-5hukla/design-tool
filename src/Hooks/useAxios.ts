import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { useLocalStorage } from "Hooks";

interface ApiResponse<T = unknown> {
  data?: T;
  status?: number;
  statusText?: string;
  api_error?: string;
}

export const useAxios = (useStatic: boolean = false) => {
  const [businessId] = useLocalStorage("businessId", "");
  const [accessToken] = useLocalStorage("token", "");
  const Axios = axios.create({
    baseURL: useStatic
      ? `/static`
      : `${import.meta.env.REACT_APP_API_URL}/${import.meta.env.REACT_APP_API_VER}`,
    timeout: 15000,
  });

  const AddCommonHeaders = (Axios: AxiosInstance) => {
    Axios.defaults.headers.common["x-businessId"] = businessId;
    Axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  const OpenReq = async <T = unknown>(
    url: string,
    method: string = "Get",
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const res = await Axios({ url, method: method, ...config });
      return { data: res.data, status: res.status, statusText: res.statusText };
    } catch (err) {
      const error = err as AxiosError;
      return { api_error: error.message };
    }
  };

  const AuthenticatedReq = async <T = unknown>(
    url: string,
    method: string = "Get",
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      AddCommonHeaders(Axios);
      const res = await Axios({ url, method: method, ...config });
      return { data: res.data, status: res.status, statusText: res.statusText };
    } catch (err) {
      const error = err as AxiosError;
      return { api_error: error.message };
    }
  };

  return { AuthenticatedReq, OpenReq };
};
