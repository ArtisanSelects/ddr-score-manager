import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { hideAll } from "tippy.js";
import LinkButton from "./LinkButton";
import SongsDataService from "../services/songsdataservice";


export default function SongPreview({song}) {

    const [jacketSrc, setJacketSrc] = useState("");
    const [gotJacket, setGotJacket] = useState(false);

    const history = useHistory();

    let isRendered = true;

    useEffect(() => {
        return () => {
            isRendered = false;
        }
    }, []);
    
    const SongPreviewBox = () => {
        return (
                <div className="song-preview-box">
                    <div className="song-preview-box-details">
                        <p><strong>Title:</strong> {song.title}</p>
                        <p><strong>Artist:</strong> {song.artist}</p>
                        <p><strong>Appearance:</strong> {song.appearance}</p>
                        <div className="song-preview-box-img-container">{gotJacket && <img onClick={() => history.push('/songs/'+song._id)} alt={`Jacket for ${song.title}`} src={jacketSrc} />}</div>
                    </div>
                    <div className="song-preview-link-container">
                        <LinkButton classes="btn-form" to={"/scores/"+song._id+"/create"} displayText="Add Score" />
                        <LinkButton classes="btn-form" to={"/songs/"+song._id} displayText="Song Details" />
                    </div>
                </div>
            );
    }

    const handleTrigger = async (e) => {
        hideAll({duration: 0});
        if (!gotJacket) {
            try {
                const response = await SongsDataService.getSongJacket(song._id);
                if (isRendered) {
                    setJacketSrc(`data:image/jpg;base64,${Buffer.from(response.data).toString("base64")}`);
                    setGotJacket(true);
                }
            } catch (err) {
                return;
            } 
        }
    }

    return (

        <td>
            <div className="hide-on-mobile">
                <Tippy content={<SongPreviewBox />} interactive={true} interactiveBorder={10} placement={'right'} onTrigger={handleTrigger} delay={100} >
                    <Link to={"/songs/"+song._id}>{song.title}<br/>({song.chartDifficulty}, {song.difficulty})</Link>
                </Tippy>
            </div>
            <div className="hide-on-desktop song-link"><Link to={"/songs/"+song._id}>{song.title}<br/>({song.chartDifficulty}, {song.difficulty})</Link></div>
        </td>
    );
}