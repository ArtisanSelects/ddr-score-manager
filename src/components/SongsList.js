import React, { useState, useEffect } from "react";
import SongTableRow from "./SongTableRow";

export default function SongsList({ songList }) {

    const initialDifficultyFilter = {"14": false, "15": false, "16": false, "17": false, "18": false, "19": false, "All": false };
    const initialStatusFilter =  {"MFC": true, "PFC": true, "GFC": true, "GoFC": true, "Cleared": true, "Unplayed": true};
    const difficulties = ["14", "15", "16", "17", "18", "19", "All"];

    const [difficultyFilters, setDifficultyFilters] = useState({"14": false, "15": false, "16": false, "17": false, "18": false, "19": false, "All": true});
    const [displayedSongs, setDisplayedSongs] = useState([]);
    const [sortMethod, setSortMethod] = useState('ascending');
    const [sortOrder, setSortOrder] = useState('difficulty');
    const [statusFilters, setStatusFilters] = useState({...initialStatusFilter});
    const [statusFiltersAll, setStatusFiltersAll] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let filteredSongs;
        if (difficultyFilters['All']) {
            filteredSongs = songList.filter(song => { return statusFilters[song.score.status]; });
        } else {   
            filteredSongs = songList.filter(song => { return difficultyFilters[song.difficulty] && statusFilters[song.score.status]; });
        }
        const newDisplayedSongs = sortSongs(filteredSongs, sortOrder);
        setDisplayedSongs(newDisplayedSongs);
    }, [difficultyFilters, statusFilters, songList]);

    useEffect(() => {
        const songs = [...songList];
        const newDisplayedSongs = sortSongs(songs, sortOrder);
        setDisplayedSongs(newDisplayedSongs);
        setIsLoading(false);
    }, []);

    const changeDifficultyFilter = (e) => {
        let newDifficultyFilter = {...initialDifficultyFilter};
        newDifficultyFilter[e.target.innerText] = true;
        setDifficultyFilters(newDifficultyFilter);
    }

    const sortByTitle = (a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
    }

    const sortByScore = (a, b) => {
        const scoreCompare = a.score.score - b.score.score;
        if (scoreCompare === 0) {
            return sortByTitle(a,b);
        }
        return scoreCompare;
    }

    const sortByDifficulty = (a, b) => {
        const difficultyCompare = a.difficulty - b.difficulty;
        if (difficultyCompare === 0) {
            const difficultyRankCompare = a.difficultyRank - b.difficultyRank;
            if (difficultyRankCompare === 0) {
                return sortByTitle(a,b);
            } 
            return difficultyRankCompare;
        }
        return difficultyCompare;
    }

    const sortSongs = (songs, sortOrdering) => {
        let sortFunction;
        switch (sortOrdering) {
            case "title":
                sortFunction = (sortMethod === 'ascending') ? (a, b) => sortByTitle(a, b) : (a, b) => sortByTitle(b, a);
                break;

            case "score":
                sortFunction = (sortMethod === 'ascending') ? (a, b) => sortByScore(a, b) : (a, b) => sortByScore(b, a);
                break;

            case "difficulty":
                sortFunction = (sortMethod === 'ascending') ? (a,b) => sortByDifficulty(a, b) : (a, b) => sortByDifficulty(b, a);
                break;

            default:
                sortFunction = (sortMethod === 'ascending') ? (a,b) => sortByDifficulty(a, b) : (a, b) => sortByDifficulty(b, a);
                break;
        }
        songs.sort(sortFunction);
        return songs;
    }

    const changeSortOrder = (e) => {
        const newDisplayedSongs = sortSongs([...displayedSongs], e.target.value);
        setDisplayedSongs(newDisplayedSongs);
        setSortOrder(e.target.value);
    };

    const changeSortMethod = (e) => {
        const newSortMethod = e.target.value;
        if (newSortMethod !== sortMethod) {
            let newDisplayedSongs = [...displayedSongs];
            newDisplayedSongs.reverse();
            setDisplayedSongs(newDisplayedSongs);
            setSortMethod(newSortMethod);
        }
    }

    const changeStatusFilter = (e) => {
        let newStatusFilter = {...statusFilters};
        if (e.target.value === 'All') {
            if (e.target.checked) {
                setStatusFiltersAll(true);
                newStatusFilter = {...initialStatusFilter};
            }
        } else {
            newStatusFilter[e.target.value] = e.target.checked;
            setStatusFiltersAll(!Object.values(newStatusFilter).includes(false));
        }
        setStatusFilters(newStatusFilter);
    }

    const statusFilterButton = (value_array) => {
        let [value, tooltip] = value_array;
        return (
            <span key={value} className="sort-options-status-input-group">
                <input id={`sort-options-status-${value}`} type="checkbox" value={value} checked={statusFilters[value]} onChange={changeStatusFilter} />
                <label htmlFor={`sort-options-difficulty-${value}`}>{tooltip ? (<abbr title={tooltip}>{value}</abbr>) : value}</label>
            </span>
        );
    }

    return (
        <div>
            <div id="songs-table">
                <div id="sort-options-container">
                    <div className="sort-option-group" id="sort-options-sort-order-container" onChange={changeSortOrder}>
                        <label htmlFor="sort-options-sort-order-container">Sort by</label>
                        <br/>
                        <label htmlFor="sort-options-sort-order-difficulty">Difficulty</label>
                        <input type="radio" defaultChecked value="difficulty" id="sort-options-sort-order-difficulty" name="sort-options-sort-order-radio" />

                        <label htmlFor="sort-options-sort-order-title">Title</label>
                        <input type="radio" value="title" id="sort-options-sort-order-title" name="sort-options-sort-order-radio" />

                        <label htmlFor="sort-options-sort-order-score">Score</label>
                        <input type="radio" value="score" id="sort-options-sort-order-score" name="sort-options-sort-order-radio" />
                    </div>

                    <div className="sort-option-group" id="sort-options-sort-order-method" onChange={changeSortMethod}>
                        <label htmlFor="sort-options-sort-order-method">Sort method</label>
                        <br/>
                        <label htmlFor="sort-options-sort-order-ascending">Ascending</label>
                        <input type="radio" defaultChecked value="ascending" id="sort-options-sort-order-ascending" name="sort-options-sort-order-method-radio" />
                        <label htmlFor="sort-options-sort-order-descending">Descending</label>
                        <input type="radio" value="descending" id="sort-options-sort-order-descending" name="sort-options-sort-order-method-radio" />
                        
                    </div>

                    <div className="sort-option-group" id="sort-options-status-container">
                        <div id="sort-options-status-header">Status</div>
                        <div id="sort-options-status-selects">
                            {[["MFC", "Marvellous Full Combo"], ["PFC", "Perfect Full Combo"], ["GFC", "Great Full Combo"], ["GoFC", "Good Full Combo"], ["Cleared", ""], ["Unplayed", ""]].map(status => statusFilterButton(status))}
                            <span key="AllStatus" className="sort-options-status-input-group">
                                <input id={`sort-options-status-all`} type="checkbox" value="All" checked={statusFiltersAll} onChange={changeStatusFilter} />
                                <label htmlFor={`sort-options-difficulty-all`}>All</label>
                            </span>
                        </div>
                    </div>

                </div>

                <div id="difficulty-tabs-container">
                    <ul>
                        {difficulties.map(difficulty => { return ( <li key={difficulty} onClick={changeDifficultyFilter} className={`difficulty-tab ${difficultyFilters[difficulty] ? 'selected' : ''}`} >{difficulty}</li> );})}
                    </ul>
                </div>

                    <table id="songs-list-table">
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <th className="hide-on-mobile">Score</th>
                                <th className="hide-on-mobile">Grade</th>
                                <th className="hide-on-mobile">Marvellous</th>
                                <th className="hide-on-mobile">Perfect</th>
                                <th className="hide-on-mobile">Great</th>
                                <th className="hide-on-mobile">Good</th>
                                <th className="hide-on-mobile">Boo</th>
                                <th className="hide-on-mobile">Miss</th>
                                <th className="hide-on-mobile">OK</th>
                                <th className="hide-on-mobile">Combo</th>
                                <th className="hide-on-desktop" colSpan="2">Score</th>
                            </tr>
                            {isLoading ? (
                                <tr>
                                    <td className="table-loading" colSpan="12">Loading...</td>
                                </tr>
                            ) : (
                                    displayedSongs.map(song => <SongTableRow key={song._id} song={song} /> )                   
                            )}
                            {displayedSongs.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan="12">No songs matching that criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                <div className="text-center songs-list-footer"><button onClick={() => window.scrollTo(0,0)}>Go For The Top</button></div>
            </div>
        </div>
    );
}