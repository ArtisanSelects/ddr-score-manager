import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import SongsDataService from "../services/songsdataservice";
import { blankScore } from "../services/scoreCalculationsService";
import { decode } from 'html-entities';
import { format, parseJSON } from 'date-fns';
import DeleteButton from "./DeleteButton";
import LinkButton from "./LinkButton";
import ScoreHistoryTables from "./ScoreHistoryTables";
import ErrorMessage, { blankErrorHandler } from "./ErrorMessage";

export default function SongDetail(props) {

    const [song, setSong] = useState({});
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [gotSong, setGotSong] = useState(false);
    const [currentScore, setCurrentScore] = useState({});
    const [songDeleted, setSongDeleted] = useState(false);
    const [jacketSrc, setJacketSrc] = useState("/images/jackets/default.png");
    const history = useHistory();

    const getSong = async (id) => {
        setErrorHandler({...blankErrorHandler});
        try {
            const { data: songData } = await SongsDataService.getSong(id);
            songData.title = decode(songData.title);
            songData.artist = decode(songData.artist);
            setSong(songData);
            if (songData.songJacket) {
                setJacketSrc(`data:image/jpg;base64,${Buffer.from(songData.songJacket).toString("base64")}`);
            }
            if (songData.score) {
                songData.score.date = format(parseJSON(songData.score.date), 'yyyy/MM/dd hh:mma');
                setCurrentScore(songData.score);
            } else {
                setCurrentScore(blankScore);
            }
            setGotSong(true);
            document.title = `DDR Score Manager - ${songData.title}`;
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: [{ param: 'backend', msg: "A problem occurred when trying to find this song." }]})
            document.title = "DDR Score Manager";
        }
    }

    useEffect(() => {
        getSong(props.match.params.id);
    }, [props.match.params.id]);

    const handleDeleteSong = async (e) => {
        e.preventDefault();
        if (!props.isAuthed) {
            history.push('/login');
            return;
        }
        setErrorHandler({...blankErrorHandler});
        try {
            const { data: res } = await SongsDataService.deleteSong(song._id);
            if (res.status === 'success') {
                setSongDeleted(true);
                props.updateSongs();
            } else {
                setErrorHandler({hasErrors: true, errorArray: [{ param: 'backend', msg: 'A problem occurred when trying to delete this song.' }]});
            }
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: [{ param: 'backend', msg: 'A problem occurred when trying to delete this song.' }]});
        }
    }

    const handleErrors = (msg) => {
        setErrorHandler({hasErrors: true, errorArray: [ { param: 'scores', msg: msg }]});
    }
    
    return (
        <div>
            {errorHandler.hasErrors && (
                <div className="msg-container">
                    <ErrorMessage errorArray={errorHandler.errorArray} />
                    <div className="link-container">
                        <LinkButton classes="btn-form" to="/" displayText="Return home" />
                    </div>
                </div>
            )}

            {!errorHandler.hasErrors && songDeleted && (
                <div className="msg-container">
                    <h2>The song was successfully deleted.</h2>
                    <div className="link-container">
                        <LinkButton classes="btn-form" to="/" displayText="Return home" />
                    </div>
                </div>
            )}

            {!errorHandler.hasErrors && !songDeleted && gotSong && (
                <div>
                    <div className="song-detail-box">
                        <div className="song-detail-box-main-row">
                            <div className="song-detail-box-main-info">
                                <div className="song-detail-box-song-title">{song.title}</div>
                                <div className="song-detail-box-song-artist">{song.artist}</div>
                                <div className="song-detail-box-song-appearance">From {song.appearance}</div>
                            </div>
                            <div className="song-detail-box-jacket">
                                <img alt={`Jacket for ${song.title}`} src={jacketSrc}></img>
                            </div>
                        </div>
                        <div className="song-detail-box-secondary-row">
                            <div className="statcard-info-container">
                                <div className="statcard-info-container-title">Difficulty Rating</div>
                                <div className="statcard-info-container-info">{song.difficulty}</div>
                            </div>
                            <div className="statcard-info-container">
                                <div className="statcard-info-container-title">Chart Difficulty</div>
                                <div className="statcard-info-container-info">{song.chartDifficulty}</div>
                            </div>
                            <div className="statcard-info-container">
                                <div className="statcard-info-container-title">Chart Mode</div>
                                <div className="statcard-info-container-info">{song.chartMode}</div>
                            </div>
                            <div className="statcard-info-container">
                                <div className="statcard-info-container-title">Notecount</div>
                                <div className="statcard-info-container-info">{song.maxCombo} / {song.freezeArrowCount} / {song.shockArrowCount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="link-container">
                        <div className="link-container-row">
                            <LinkButton classes="btn-form btn-form-fullwidth" to={`/scores/${song._id}/create`} displayText="Add a new score" />
                        </div>
                        <div className="link-container-row">
                            <LinkButton classes="btn-form" to={`/songs/${song._id}/update`} displayText="Edit this song" />
                            <DeleteButton handleDelete={handleDeleteSong} isAuthed={props.isAuthed} classNames="btn-form" />
                        </div>
                    </div>

                    <ScoreHistoryTables isAuthed={props.isAuthed} song={song} currentScore={currentScore} updateSongs={props.updateSongs} handleErrors={handleErrors} />

                </div>
            )}

            {!errorHandler.hasErrors && !songDeleted && !gotSong && (
                <div className="msg-container">
                    <h2>Loading...</h2>
                </div>
            )}
        </div>
    );
}