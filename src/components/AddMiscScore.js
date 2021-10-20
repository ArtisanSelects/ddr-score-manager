import React, { useState, useRef } from "react";
import { useHistory } from "react-router";
import MiscScoresDataService from "../services/miscScoresDataService";
import LinkButton from "./LinkButton";
import ErrorMessage, { blankErrorHandler } from "./ErrorMessage";
import imageUploadHandler from "../services/imageUploadHandler";

export default function AddMiscScore(props) {
    const [submitted, setSubmitted] = useState(false);
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [screenshotString, setScreenshotString] = useState("");
    const [canSubmit, setCanSubmit] = useState(true);
    const history = useHistory();
    const formRef = useRef();

    const handleScreenshot = async (e) => {
        setErrorHandler({...blankErrorHandler});
        try {
            const res = await imageUploadHandler(e, 5000000, 'miscscore', 'Screenshot must be under 5MB in size.');
            setScreenshotString(res);
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err});
            e.target.value = "";
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
        let unfilledFields = false;
        const formData = e.target.form;
        const data = {
            caption: formData.caption.value,
            screenshot: screenshotString,
        };
        for (let k in data) {
            if (data[k] === "") {
                unfilledFields = true;
                break;
            }
        }
        if (unfilledFields) {
            setErrorHandler({hasErrors: true, errorArray: [{param: "missingField", msg: "Please fill out all fields."}]});
            setCanSubmit(true);
            return;
        }
        try {
            const response = await MiscScoresDataService.createMiscScore(data);
            setSubmitted(true);
            props.updateSongs();
        } catch (err) {
            setErrorHandler({hasErrors: true, errorArray: err.response.data});
            setCanSubmit(true);
        }
    }

    const handleReset = e => {
        setSubmitted(false);
        setCanSubmit(true);
    }

    return (
        <div>
            { submitted ? (
                <div className="msg-container">
                    <h2>Success!</h2>
                    <p>The miscellaneous score has been added.</p>
                    <div className="link-container">
                        <LinkButton classes="btn-form" to="/miscscores/" displayText="View the scores here" />
                        <button className="btn-form" onClick={handleReset}><span className="btn-span">Add another misc score</span></button>
                    </div>
                </div>
            ) : (
                <div className="create-form">
                    <form ref={formRef} autoComplete="off">
                    <fieldset>
                        <legend>Create a new miscellaneous score:</legend>
                        <div className="form-group">
                            <label htmlFor="caption">Caption:</label>
                            <input required type="text" id="caption" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="screenshot">Screenshot:</label>
                            <input required type="file" accept=".png, .jpg, .jpeg" id="screenshot" onChange={handleScreenshot}></input>
                        </div>

                        <input className={`btn-form ${canSubmit ? '' : 'cant-submit'}`} type="submit" onClick={handleSubmit} value="Submit" />
                        
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