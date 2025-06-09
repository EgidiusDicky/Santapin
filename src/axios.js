import axios from "axios"
import router from "./router"


const axiosClient = axios.create(
    {
        baseURL : 'http://localhost:8000/'
    }
)
export default axiosClient