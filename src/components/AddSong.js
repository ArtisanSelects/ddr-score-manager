import React, { useState } from "react";
import { useHistory } from "react-router";
import LinkButton from "./LinkButton.js";
import SongsDataService from "../services/songsdataservice.js";
import ErrorMessage, { blankErrorHandler } from "./ErrorMessage";
import imageUploadHandler from "../services/imageUploadHandler.js";

export default function AddSong(props) {

    const [submitted, setSubmitted] = useState(false);
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [songID, setSongID] = useState("");
    const [songAdded, setSongAdded] = useState(false);
    const [songJacketString, setSongJacketString] = useState("");
    const [canSubmit, setCanSubmit] = useState(true);
    const history = useHistory();

    const handleSongJacket = async (e) => {
        setErrorHandler({...blankErrorHandler});
        try {
            const res = await imageUploadHandler(e, 1000000, 'songJacket', 'Song jacket must be under 1MB in size.');
            setSongJacketString(res);
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err});
            e.target.value = "";
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (!props.isAuthed) {
            history.push('/login');
            return;
        }
        if (!canSubmit) {
            return;
        }
        setErrorHandler({...blankErrorHandler});
        setCanSubmit(false);
        let unfilledFields = [];
        const formData = e.target.form;
        const data = {
            title: formData.title.value,
            artist: formData.artist.value,
            difficulty: +formData.difficulty.value,
            difficultyRank: (formData.difficultyRank.value !== "") ? +formData.difficultyRank.value : "",
            chartDifficulty: formData.chartDifficulty.value,
            chartMode: formData.chartMode.value,
            appearance: formData.appearance.value,
            maxCombo: (formData.maxCombo.value !== "") ? +formData.maxCombo.value : "",
            freezeArrowCount: +formData.freezeArrowCount.value,
            shockArrowCount: +formData.shockArrowCount.value,
            songJacket: songJacketString,
        };
        data["freezeAndShockArrowCount"] = data.freezeArrowCount + data.shockArrowCount;
        for (let k in data) {
            if (data[k] === "") {
                unfilledFields.push({param: "missingField", msg: `Please fill out the ${k} field.`});
            }
        }
        if (unfilledFields.length > 0) {
            setErrorHandler({hasErrors: true, errorArray: unfilledFields});
            setCanSubmit(true);
            return;
        }
        try {
            const { data: savedSong } = await SongsDataService.createSong(data);
            setSongID(savedSong.songID);
            setSongAdded(savedSong.status === 'success');
            setSubmitted(true);
            props.updateSongs();
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err.response.data});
            setCanSubmit(true);
        }
    }

    const handleReset = (e) => {
        setSubmitted(false);
        setSongID("");
        setSongAdded(false);
        setSongJacketString("");
        setCanSubmit(true);
    }

    const difficulties = [...Array(6).keys()].map(i => i+14);
    const chartDifficulties = ["Beginner", "Basic", "Difficult", "Expert", "Challenge"];
    const chartMode = ["Single", "Double"];
    const appearances = ['DDR A3', 'DDR A20 PLUS', 'DDR A20', 'DDR A', 'DDR 2014', 'DDR 2013', 'DDR X3', 'DDR X2', 'DDR X', 'SuperNOVA2', 'SuperNOVA', 'EXTREME', 'MAX2', 'MAX', '5th Mix', '4th Mix', '3rd Mix', '2nd Mix', '1st Mix', 'Other'];

    return (
        <div>
            { submitted ? (
                <div className="msg-container">
                    { songAdded ? (
                        <div>
                        <h2>Success!</h2>
                        <p>The song has been created.</p>
                        </div>
                    ) : (
                        <div>
                        <h2>Failure!</h2>
                        <p>A song with this title, artist, chart difficulty, and chart mode already exists.</p>
                        </div>
                    )}
                    <div className="link-container">
                        <LinkButton classes="btn-form" to={songID} displayText="View the song detail page" />
                        <button className="btn-form" onClick={handleReset}><span className="btn-span">Add another song</span></button>
                    </div>
                </div>
                
            ) : (
                <div className="create-form">
                    <form autoComplete="off">
                        <fieldset>
                            <legend>Create a new song:</legend>
                            <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input required type="text" id="title"  />
                            </div>

                            <div className="form-group">
                                <label htmlFor="artist">Artist:</label>
                                <input required type="text" id="artist" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="difficulty">Difficulty rating:</label>
                                <div className="form-group-radio-container">
                                    {
                                        difficulties.map(difficulty => {
                                            return (
                                                <div className="form-group-radio" key={difficulty}>
                                                    <label htmlFor={difficulty}>{difficulty}</label>
                                                    <input required type="radio" value={difficulty} name="difficulty" key={difficulty} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="difficultyRank">Difficulty ranking:</label>
                                <input required type="number" id="difficultyRank" min="1" placeholder="0" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="chartDifficulty">Chart difficulty:</label>
                                <div className="form-group-radio-container">
                                {
                                    chartDifficulties.map((difficulty) => {
                                        return (
                                            <div className="form-group-radio" key={difficulty}>
                                                <label htmlFor={difficulty}>{difficulty}</label>
                                                <input required type="radio" value={difficulty} name="chartDifficulty" key={difficulty} />
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="chartMode">Chart mode:</label>
                                <div className="form-group-radio-container">
                                    {
                                        chartMode.map((mode => {
                                            return (
                                                <div className="form-group-radio" key={mode}>
                                                    <label htmlFor={mode}>{mode}</label>
                                                    <input required type="radio" value={mode} name="chartMode" key={mode} />
                                                </div>
                                            )
                                        }))
                                    }
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="appearance">Appearance:</label>
                                <select required id="appearance">
                                {
                                    appearances.map((appearance) =>
                                    <option value={appearance} key={appearance}>{appearance}</option>)
                                }
                            </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="maxCombo">Max combo:</label>
                                <input required type="number" id="maxCombo" min="1" placeholder="0" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="freezeArrowCount">Freeze Arrows:</label>
                                <input required type="number" id="freezeArrowCount" min="0" placeholder="0" />
                            </div>      

                            <div className="form-group">
                                <label htmlFor="shockArrowCount">Shock Arrows:</label>
                                <input required type="number" id="shockArrowCount" min="0" placeholder="0" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="songJacket">Song Jacket:</label>
                                <input required type="file" multiple={false} accept=".png, .jpg, .jpeg" id="songJacket" onChange={handleSongJacket}></input>
                            </div>
                            <input className={`btn-form ${canSubmit ? "" : "cant-submit"}`} type="submit" onClick={handleClick} value="Submit" />
                            
                            {errorHandler.hasErrors && (
                                <ErrorMessage errorArray={errorHandler.errorArray} />
                            )}
                        </fieldset>
                    </form>
                </div>
            )}  
        </div>
    );
}