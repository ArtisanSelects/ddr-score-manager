import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import SongsDataService from "../services/songsdataservice";
import ScoresDataService from "../services/scoresDataService";
import { calculateStatus, calculateGrade, calculateScore, blankScore } from "../services/scoreCalculationsService";
import { decode } from 'html-entities';
import { format, parseJSON } from 'date-fns';
import LinkButton from "./LinkButton";
import ScoreHistoryTables from "./ScoreHistoryTables";
import ErrorMessage, { blankErrorHandler } from "./ErrorMessage";

export default function AddScore(props) {
    const blankBadInfoHandler = {hasBadInfo: false, badInfoArray: []};

    const [submitted, setSubmitted] = useState(false);
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [newScoreCalculated, setNewScoreCalculated] = useState(false);
    const [newScore, setNewScore] = useState({});
    const [oldScore, setOldScore] = useState({});
    const [song, setSong] = useState({});
    const [gotSong, setGotSong] = useState(false);
    const [badInfoHandler, setBadInfoHandler] = useState({...blankBadInfoHandler});
    const [isHighScore, setIsHighScore] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const history = useHistory();

    const getSong = async (songID) => {
        setErrorHandler({...blankErrorHandler});
        try {
            const { data: fetchedSong } = await SongsDataService.getSong(songID);
            fetchedSong.title = decode(fetchedSong.title);
            fetchedSong.artist = decode(fetchedSong.artist);
            setSong(fetchedSong);
            setGotSong(true);
            if (fetchedSong.score) {
                fetchedSong.score.date = format(parseJSON(fetchedSong.score.date), 'yyyy/MM/dd hh:mma');
                setOldScore(fetchedSong.score);
            } else {
                setOldScore(blankScore);
            }
            document.title = `DDR Score Manager - Add a new score for ${fetchedSong.title}`;
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err.response.data});
            document.title = "DDR Score Manager - Add a new score";
        }
    }

    useEffect(() => {
        getSong(props.match.params.songID);
    }, [props.match.params.songID]);

    const createNewScoreObject = (formData) => {
        return {
            marvellous: +formData.marvellous.value,
            perfect: +formData.perfect.value,
            great: +formData.great.value,
            good: +formData.good.value,
            boo: +formData.boo.value,
            miss: +formData.miss.value,
            ok: +formData.ok.value,
            combo: +formData.combo.value,
            score: 0,
            grade: '',
            status: '',
            song: null,
        }
    }
    
    const handleCalculateNewScore = (e) => {
        let badInfo = [];
        setBadInfoHandler({...blankBadInfoHandler});
        setNewScoreCalculated(false);
        setNewScore({});
        setIsHighScore(false);
        const data = createNewScoreObject(e.target.form);
        const stepCount = data.marvellous+data.perfect+data.great+data.good+data.boo+data.miss;
        const param = 'info';
        if (stepCount > song.maxCombo) {
            if (song.shockArrowCount === 0 || stepCount+(data.ok-song.freezeArrowCount) !== song.maxCombo)
            {
                badInfo.push({ param, msg: 'Score has more steps than the song does.'});
            }
        }
        if (data.ok > song.freezeAndShockArrowCount) {
            badInfo.push({ param, msg: `Score has more freeze/shock arrows than the song does (should be equal to or less than ${song.freezeAndShockArrowCount}).`});
        }
        if (data.ok+data.miss < song.freezeAndShockArrowCount) {
            badInfo.push({ param, msg: `Score doesn't have the proper number of freeze and shock arrows.`});
        }
        if (data.combo > song.maxCombo) {
            badInfo.push({ param, msg: `Score's combo is greater than the song's max combo of ${song.maxCombo}.`});
        }
        if (data.combo > stepCount-data.miss) {
            if (song.shockArrowCount === 0 || stepCount+(data.ok-song.freezeArrowCount) !== data.combo) {
                badInfo.push({ param, msg: 'Score\'s combo can\'t be that high with that many misses.'});
            }
        }
        if (song.shockArrowCount === 0 && stepCount !== song.maxCombo) {
            badInfo.push({ param, msg: `Score has the wrong number of steps for this song (should add to ${song.maxCombo}).`});
        }
        if (data.combo === 0) {
            badInfo.push({ param, msg: `Score can't have a combo of 0.`});
        }
        if (data.miss+data.boo === 0 && data.combo !== stepCount) {
            if (song.shockArrowCount === 0 || data.ok-song.freezeArrowCount !== song.shockArrowCount) {
                badInfo.push({ param, msg: `Score should be a full combo (${song.maxCombo}).`});
            }
        }

        if (badInfo.length > 0) {
            setBadInfoHandler({hasBadInfo: true, badInfoArray: badInfo});
        } else {
            data.score = calculateScore(song.stepScore, data.marvellous, data.perfect, data.great, data.good, data.ok);
            data.grade = calculateGrade(data.score);
            data.status = calculateStatus(data.perfect, data.great, data.good, data.boo, data.miss);
            if (song.score) {
                setIsHighScore(data.score > song.score.score);
            } else {
                setIsHighScore(true);
            }
            data.song = song._id;
            setNewScore(data);
            setNewScoreCalculated(true);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!props.isAuthed) {
            history.push('/login');
            return;
        }
        if (!newScoreCalculated || !canSubmit) {
            return;
        }
        setCanSubmit(false);
        if (!isHighScore) {
            if (!window.confirm('This score is less than or equal to the current high score.\nUpdate anyway?')) {
                return;
            }
        }
        try {
            const savedScore = await ScoresDataService.createScore(song._id, newScore);
            setSubmitted(true);
            props.updateSongs();
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err.response.data});
            setCanSubmit(true);
        }
    }

    const handleErrors = (err) => {
        setErrorHandler({hasErrors: true, errorArray: [{ param: 'scores', msg: err }]})
    }
    
    return (
        <div>
            { submitted ? (
                <div className='msg-container'>
                    <h2>Success!</h2>
                    <p>The score has been accepted.</p>
                    <div className="link-container">
                        <LinkButton classes="btn-form" to={`/songs/${song._id}`} displayText="Return to the song page" />
                        <LinkButton classes="btn-form" to={'/songs'} displayText="Return to the scores" />
                    </div>
                </div>
            ) : (
                <div>
                    {gotSong && (
                        <div>
                            <div className="create-form">
                            <form autoComplete="off">
                            <fieldset>
                                <legend>Add a new score for {song.title} ({song.chartMode}/{song.chartDifficulty}):</legend>
                                <div className="form-group">
                                    <label htmlFor="marvellous">Marvellous:</label>
                                    <input required type="number" id="marvellous" min="0" placeholder="0" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="Perfect">Perfect:</label>
                                    <input required type="number" id="perfect" min="0" placeholder="0" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="Great">Great:</label>
                                    <input required type="number" id="great" min="0" placeholder="0" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="Good">Good:</label>
                                    <input required type="number" id="good" min="0" placeholder="0" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="boo">Boo:</label>
                                    <input required type="number" id="boo" min="0" placeholder="0" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="Miss">Miss:</label>
                                    <input required type="number" id="miss" min="0" placeholder="0" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="ok">OK:</label>
                                    <input required type="number" id="ok" min="0" placeholder={song.freezeAndShockArrowCount} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="Combo">Combo:</label>
                                    <input required type="number" id="combo" min="0" placeholder={song.maxCombo} />
                                </div>
                                
                                <div className="form-group">
                                    <input className="btn-form" type="button" onClick={handleCalculateNewScore} value="Calculate Score" />
                                    <input className={`btn-form ${newScoreCalculated && canSubmit ? "" : "cant-submit"}`} type="submit" onClick={handleSubmit} value="Submit" />
                                </div>

                                <div id="score-calculation-table">
                                    <div className="score-calculation-table-group">
                                        <p className="score-calculation-table-header">Score:</p>
                                        <p className="score-calculation-table-body">{newScore.score ? newScore.score : ""}</p>
                                    </div>
                                    <div className="score-calculation-table-group">
                                        <p className="score-calculation-table-header">Grade:</p>
                                        <p className="score-calculation-table-body">{newScore.grade ? newScore.grade : ""}</p>
                                    </div>
                                    <div className="score-calculation-table-group">
                                        <p className="score-calculation-table-header">Status:</p>
                                        <p className="score-calculation-table-body">{newScore.status ? newScore.status : ""}</p>
                                    </div>
                                </div>


                                {badInfoHandler.hasBadInfo && (
                                    <ErrorMessage errorArray={badInfoHandler.badInfoArray} />
                                )}
                                {errorHandler.hasErrors && (
                                    <ErrorMessage errorArray={errorHandler.errorArray} />
                                )}
                            </fieldset>
                            </form>
                    </div>
                    <ScoreHistoryTables isAuthed={props.isAuthed} song={song} currentScore={oldScore} updateSongs={props.updateSongs} handleErrors={handleErrors} />                
            </div>
                )}
            </div>
               
            )}

        </div>
    );
}