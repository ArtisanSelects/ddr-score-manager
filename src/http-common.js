import axios from "axios";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    const baseUrl = "http://localhost:5000/api/v1/scores";
} else { 
    const baseUrl = "https://ddr-score-manager.herokuapp.com/api/v1/scores";
}

export default axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",  
    }
});