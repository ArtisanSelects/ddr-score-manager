import http from "../http-common.js";

class SongsDataService {
    getAllSongs() {
        return http.get('/songs');
    }

    getSong(id) {
        return http.get(`/songs/${id}`);
    }

    getSongJacket(id) {
        return http.get(`/songs/jacket/${id}`);
    }

    createSong(data) {
        return http.post(`/songs/create`, data);
    }

    updateSong(id, data) {
        return http.post(`/songs/${id}/update`, data);
    }

    deleteSong(id) {
        return http.post(`/songs/${id}/delete`);
    }
}

export default new SongsDataService();