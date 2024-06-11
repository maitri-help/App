import Axios from 'axios';
import { API_URL } from '../constants/config';
import { getAccessToken } from '../authStorage';

export const api = Axios.create({ baseURL: API_URL, withCredentials: true });

api.interceptors.request.use(async function (config) {
    const accessToken = await getAccessToken();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
