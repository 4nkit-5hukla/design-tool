import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useLocalStorage } from "Hooks";

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

  const OpenReq = async (
    url: string,
    method: string = "Get",
    config?: AxiosRequestConfig<any>
  ) => {
    try {
      const res = await Axios({ url, method: method, ...config });
      return { data: res.data, status: res.status, statusText: res.statusText };
    } catch (err: any) {
      return { api_error: err.message };
    }
  };

  const AuthenticatedReq = async (
    url: string,
    method: string = "Get",
    config?: AxiosRequestConfig<any>
  ) => {
    try {
      AddCommonHeaders(Axios);
      const res = await Axios({ url, method: method, ...config });
      return { data: res.data, status: res.status, statusText: res.statusText };
    } catch (err: any) {
      return { api_error: err.message };
    }
  };

  return { AuthenticatedReq, OpenReq };
};
