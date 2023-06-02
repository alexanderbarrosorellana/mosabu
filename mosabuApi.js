import axios from 'axios';

const PROD_API = 'https://mosabu-api.onrender.com/';
const LOCAL_API = 'http://localhost:3000/';

const baseApi = () => {
  if (process.env.NODE_ENV === 'development') {
    return LOCAL_API;
  }

  return PROD_API;
};

const getIteration = async () => {
  try {
    const response = await axios.get(`${baseApi()}iterations`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error?.message}`);
  }
};

const generateIteration = async () => {
  try {
    const response = await axios.post(`${baseApi()}iterations`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error?.message}`);
  }
};

export {getIteration, generateIteration, baseApi};
