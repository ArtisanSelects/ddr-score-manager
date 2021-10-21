import axios from "axios";

export default axios.create({
    baseURL: "https://ddr-score-manager.netlify.app/api",
    withCredentials: false,
    headers: {
        "Content-type": "application/json",  
    }
});