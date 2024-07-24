import axios, { AxiosRequestHeaders, Method } from 'axios';

interface RequestFormat {
  method: Method;
  uri: string;
  token?: string;
  query?: object;
  body?: any;
  headers?: AxiosRequestHeaders;
  config?: any;
}

axios.interceptors.response.use(
  (res) => res.data,
  (err) => err.response.data,
);

export const restApi = (request: RequestFormat): Promise<any> => {
  const { method, uri, token, body, headers, config } = request;
  axios.defaults.baseURL = process.env.IAM_URL;

  if (token && token.includes('Bearer')) {
    axios.defaults.headers.common['Authorization'] = token;
  } else if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return axios({
    method: method,
    url: `${uri}`,
    data: body,
    headers: { ...axios.defaults.headers, ...headers },
    ...config,
  });
};
