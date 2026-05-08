import axios from "axios";

const instance = axios.create({
    baseURL: 'https://carsale-backend-2.onrender.com'
  
    
});
export default instance;