import axios from "axios";

export default axios.create({
    baseURL: "https://ddr-score-manager.herokuapp.com/api/v1/scores",
    withCredentials: false,
    headers: {
        "Content-type": "application/json",  
    }
});