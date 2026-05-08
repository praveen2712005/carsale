import axios from "axios";

const instance = axios.create({
    baseURL: 'https://carsale-backend-3.onrender.com',
  
    
});
export default instance;