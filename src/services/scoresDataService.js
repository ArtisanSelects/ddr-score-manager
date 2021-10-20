import http from "../http-common.js";

class ScoresDataService {
    getScore(id) {
        return http.get(`/scores/${id}`);
    }

    createScore(songID, data) {
        return http.post(`/scores/${songID}/create`, data);
    }

    deleteScore(id) {
        return http.post(`/scores/${id}/delete`);
    }

    deleteAllSongScores(songID) {
        return http.post(`/songs/${songID}/deleteScores`);
    }

}

export default new ScoresDataService();