import axios from 'axios';

export const lolApi = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`  // 환경변수로 지정한 BASE_URL을 사용
});

