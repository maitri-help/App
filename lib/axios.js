import Axios from 'axios';
import { API_URL } from '../constants/config';

export const api = Axios.create({ baseURL: API_URL });
