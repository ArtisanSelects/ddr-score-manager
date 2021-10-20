import http from "../http-common.js";

class MiscScoresDataService {
    getMiscScores(page) {
        return http.get(`/miscscores/get/${page}`);
    }

    getMiscScoreCount() {
        return http.get('/miscscores/count');
    }

    createMiscScore(data) {
        return http.post(`/miscscores/create`, data);
    }

    deleteMiscScore(id) {
        return http.post(`/miscscores/${id}/delete`);
    }
}

export default new MiscScoresDataService();