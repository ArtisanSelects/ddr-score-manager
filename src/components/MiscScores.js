import React, { useState, useEffect } from "react";
import MiscScoresDataService from "../services/miscScoresDataService";
import { useHistory } from "react-router";
import DeleteButton from "./DeleteButton";
import LinkButton from "./LinkButton";
import ErrorMessage, { blankErrorHandler } from "./ErrorMessage";
import { decode } from 'html-entities';

export default function MiscScores(props) {

    const [miscScoreList, setMiscScoreList] = useState([]);
    const [showFullImg, setShowFullImg] = useState(false);
    const [fullImgSrc, setFullImgSrc] = useState("");
    const [fullImgCaption, setFullImgCaption] = useState("");
    const [fullImgID, setFullImgID] = useState("");
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [pageList, setPageList] = useState([1]);
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    const limit = 10;
    const maxPageButtons = 3;
    const maxPageButtonsDisplayed = 7;

    useEffect(() => {
        async function loadRoutine() {
            try {
                const {data: scoreCount} = await MiscScoresDataService.getMiscScoreCount();
                const pageMax = Math.floor(scoreCount / limit) + (scoreCount % limit !== 0);
                setMaxPage(pageMax);
                updatePageList(1, pageMax);
            } catch (err) {
                setErrorHandler({hasErrors: true, errorArray: [{ param: 'backend', msg: 'Unable to contact the server. Please try again later.' }]});
            }
        }
        loadRoutine();        
    }, []);

    useEffect(() => {
        async function fetchMiscScores() {
            setErrorHandler({...blankErrorHandler});
            try {
                const {data: miscScores} = await MiscScoresDataService.getMiscScores(page);
                for (let score of miscScores) {
                    score.caption = decode(score.caption);
                }
                setMiscScoreList(miscScores);
                setIsLoading(false);
            } catch (err) {
                setErrorHandler({hasErrors: true, errorArray: [{ param: 'backend', msg: 'Unable to contact the server. Please try again later.' }]});
            }
        }
        fetchMiscScores();
    }, [page]);

    const updatePageList = (currentPage, pageMax) => {
        let res;
        if (pageMax <= maxPageButtonsDisplayed) {
            res = [...Array(pageMax).keys()].map(i => i+1);
        } else {
            let start;
            if (currentPage <= maxPageButtons) {
                start = 1;
            } else if (currentPage > pageMax-maxPageButtons) {
                start = pageMax-maxPageButtonsDisplayed+1;
            } else {
                start = currentPage-maxPageButtons;
            }
            res = [...Array(maxPageButtonsDisplayed).keys()].map(i => i+start);
            res[0] = 1;
            res[res.length-1] = pageMax;
        }
        setPageList(res);
    }

    const handlePageChange = async (e) => {
        const newPage = +e.target.value;
        if (newPage === page) {
            return;
        }
        setPage(newPage);
        updatePageList(newPage, maxPage);
    }

    const resetFullImgInfo = () => {
        setFullImgSrc("");
        setFullImgCaption("");
        setFullImgID("");
        setShowFullImg(false);
    }

    const handleClick = (e) => {
        if (e.target.classList.contains('do-not-close')) {
            return;
        }
        if (showFullImg) {
            resetFullImgInfo();
        } else {
            setShowFullImg(true);
            setFullImgSrc(e.target.src);
            setFullImgCaption(e.target.alt);
            setFullImgID(e.target.attributes.scoreid.value);
        }
    }

    const handleDeleteMiscScore = async (e) => {
        if (!props.isAuthed) {
            history.push('/login');
            return;
        }
        const id = fullImgID;
        try {
            const response = await MiscScoresDataService.deleteMiscScore(id);
            resetFullImgInfo();
            props.updateSongs();
            history.go(0);
        } catch (err) {
            resetFullImgInfo();
            setErrorHandler({hasErrors: true, errorArray: [{ param: 'backend', msg: 'Something went wrong when trying to delete the miscellaneous score.' }]})
        }
    }

    const handleImgClick = (e) => {
        const newTab = window.open(e.target.src, '_blank', 'noopener,noreferrer');
        if (newTab) newTab.opener = null;
    }

    return (
        <div id="misc-score-bg">
            {showFullImg && (
                <div onClick={handleClick} className='full-img-box'>
                    <div className='full-img-box-container do-not-close'>
                        <div className='full-img-box-img-container'>
                            <img onClick={handleImgClick} className='full-img-box-img do-not-close' alt={fullImgCaption} src={fullImgSrc} />
                        </div>
                        <p className="do-not-close">{fullImgCaption}</p>
                        <div className="link-container">
                            <div className="link-container-row">
                                <button className="btn-form"><span className="btn-span">Close</span></button>
                                <DeleteButton classNames="btn-form do-not-close" isAuthed={props.isAuthed} handleDelete={handleDeleteMiscScore} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        
                {errorHandler.hasErrors && (<ErrorMessage errorArray={errorHandler.errorArray} />)}
                {isLoading && !errorHandler.hasErrors && (
                    <div className="msg-container"><h2>Loading...</h2></div>
                )}
                {!isLoading && !errorHandler.hasErrors && (
                    <div id="misc-score-page" className={`${showFullImg ? 'dim' : ''}`}>
                        <LinkButton classes="btn-form" to={`/miscscores/create`} displayText="Add a new miscellaneous score" />

                        <div id="misc-score-container">
                            {miscScoreList.map((score) => { 
                                return (
                                <div className="misc-score-card" key={score._id}>
                                    <h3>{score.caption}</h3>
                                    <div className="misc-score-card-img-container">
                                        <img onClick={handleClick} scoreid={score._id} alt={score.caption} src={`data:image/png;base64,${Buffer.from(score.screenshot).toString("base64")}`} />
                                    </div>
                                    
                                </div>
                                )}
                            )}
                        </div>

                        <div className="misc-score-page-container">
                            {pageList.map(p => <button onClick={handlePageChange} className={`misc-score-page-button ${p === page ? 'active' : ''}`} key={p} value={p}>{p}</button>)}
                        </div>
                    </div>
                )}
        </div>
    );
}