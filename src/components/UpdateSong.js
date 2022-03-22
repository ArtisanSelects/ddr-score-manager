import React, { useEffect, useState, useRef } from "react";
import { decode } from 'html-entities';
import { useHistory } from "react-router";
import SongsDataService from "../services/songsdataservice.js";
import LinkButton from "./LinkButton.js";
import ErrorMessage, { blankErrorHandler } from "./ErrorMessage.jsx";
import imageUploadHandler from "../services/imageUploadHandler.js";

export default function UpdateSong(props) {

    const formRef = useRef();
    const history = useHistory();
    const [gotSong, setGotSong] = useState(false);
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [song, setSong] = useState({});
    const [songAdded, setSongAdded] = useState(false);
    const [songJacketString, setSongJacketString] = useState("");
    const [updateSongJacket, setUpdateSongJacket] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);


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

    useEffect(() => {
        getSong(props.match.params.id);
    }, [props.match.params.id]);

    const getSong = async (id) => {
        setErrorHandler({...blankErrorHandler});
        try {
            const { data: fetchedSong } = await SongsDataService.getSong(id);
            setSong(fetchedSong);
            setGotSong(true);
            formRef.current.title.value = decode(fetchedSong.title);
            formRef.current.artist.value = decode(fetchedSong.artist);
            formRef.current.difficulty.value = fetchedSong.difficulty;
            formRef.current.difficultyRank.value = fetchedSong.difficultyRank;
            formRef.current.chartDifficulty.value = fetchedSong.chartDifficulty;
            formRef.current.chartMode.value = fetchedSong.chartMode;
            formRef.current.appearance.value = fetchedSong.appearance;
            if (!fetchedSong.songJacket) {
                setUpdateSongJacket(true);
            } else {
                const buff = Buffer.from(fetchedSong.songJacket).toString('base64');
                setSongJacketString(buff);
            }
            document.title = `DDR Score Manager - Edit ${fetchedSong.title}`;
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err.response.data});
            document.title = "DDR Score Manager - Edit song"
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!props.isAuthed) {
            history.push('/login');
            return;
        }
        if (!canSubmit) {
            return;
        }
        setCanSubmit(false);
        setErrorHandler({...blankErrorHandler});
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
            songJacket: songJacketString,
        };
        for (let k in data) {
            if (data[k] === "") {
                if (k === "songJacket" && !updateSongJacket) {
                    continue;
                }
                unfilledFields.push({param: "missingField", msg: `Please fill out the ${k} field.`});
            }
        }
        if (unfilledFields.length > 0) {
            setErrorHandler({hasErrors: true, errorArray: unfilledFields});
            return;
        }
        try {
            const { data: response } = await SongsDataService.updateSong(song._id, data);
            if (response.status === 'failure') {
                setErrorHandler({hasErrors: true, errorArray: [{param: 'duplicate', msg: 'A song with this title, artist, chart difficulty, chart mode, and appearance already exists.'}]});
                setCanSubmit(true);
            } else {
                setSongAdded(response.status === 'success');
                props.updateSongs();
            }
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err.response.data});
            setCanSubmit(true);
        }
    }

    const handleSongJacketUpdate = (e) => {
        setUpdateSongJacket(true);
    }

    const difficulties = [...Array(6).keys()].map(i => i+14);
    const chartDifficulties = ["Beginner", "Basic", "Difficult", "Expert", "Challenge"];
    const chartMode = ["Single", "Double"];
    const appearances = ['DDR A3', 'DDR A20 PLUS', 'DDR A20', 'DDR A', 'DDR 2014', 'DDR 2013', 'DDR X3', 'DDR X2', 'DDR X', 'SuperNOVA2', 'SuperNOVA', 'EXTREME', 'MAX2', 'MAX', '5th Mix', '4th Mix', '3rd Mix', '2nd Mix', '1st Mix', 'Other'];

    return (
        <div>
            {!gotSong && (
                <div className="msg-container">
                    <h2>Loading...</h2>
                    {errorHandler.hasErrors && (
                        <ErrorMessage errorArray={errorHandler.errorArray} />
                    )}
                </div>
            )}

            {gotSong && songAdded && (
                <div className="msg-container">
                    <h2>Success!</h2>
                    <p>The song has been updated.</p>
                    <div className="link-container">
                        <LinkButton classes="btn-form" to={`/songs/${song._id}`} displayText="Return to the song page" />
                        <LinkButton classes="btn-form" to={`/songs`} displayText="Return to the scores" />
                    </div>
                </div>
            )}

            {gotSong && !songAdded && (
                <div className="create-form">
                    <form ref={formRef} autoComplete="off">
                        <fieldset>
                            <legend>{`Edit ${song.title}`}</legend>
                            <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input required type="text" id="title" />
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
                                <label htmlFor="songJacket">Song Jacket:</label>
                                {updateSongJacket ? (
                                    <input required type="file" multiple={false} accept=".png, .jpg, .jpeg" id="songJacket" onChange={handleSongJacket}></input>
                                ) : (
                                    <button onClick={handleSongJacketUpdate}>Update song jacket</button>
                                )}
                                
                            </div>

                            <input className={`btn-form ${canSubmit ? "" : "cant-submit"}`} type="submit" onClick={handleSubmit} value="Submit" />

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