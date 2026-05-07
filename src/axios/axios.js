import axios from "axios";

const instance = axios.create({
    baseURL: 'https://carsale-backend-1-o5nm.onrender.com'
  
    
});
export default instance;