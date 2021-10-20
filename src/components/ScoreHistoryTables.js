import React from "react";
import { useHistory } from "react-router";
import ScoresDataService from "../services/scoresDataService";
import { format, parseJSON } from 'date-fns';

export default function ScoreHistoryTables({ isAuthed, song, currentScore, updateSongs, handleErrors }) {
    const history = useHistory();
    
    const handleDeleteScore = async (e) => {
        if (!isAuthed) {
            history.push('/login');
            return;
        }
        if (window.confirm("Are you sure you want to delete this score?\nThis action can't be undone.")) {
            try {
                const response = await ScoresDataService.deleteScore(e.target.getAttribute('scoreid'));
                updateSongs();
                history.go(0);
            } catch (err) {
                handleErrors('A problem occurred when trying to delete this score.')
            }
        }
    }

    const handleDeleteAllScores = async (e) => {
        if (!isAuthed) {
            history.push('/login');
            return;
        }
        if (window.confirm("Are you sure you want to delete every score for this song?\nThis action can't be undone.")) {
            try {
                const response = await ScoresDataService.deleteAllSongScores(song._id);
                updateSongs();
                history.go(0);
            } catch (err) {
                handleErrors("A problem occurred when trying to delete this song's scores.")
            }
       }
    }

    const tableHeader = (
        <tr>
            <th className="hide-on-mobile">Score</th>
            <th className="hide-on-mobile">Grade</th>
            <th className="hide-on-mobile">Marvellous</th>
            <th className="hide-on-mobile">Perfect</th>
            <th className="hide-on-mobile">Great</th>
            <th className="hide-on-mobile">Good</th>
            <th className="hide-on-mobile">Boo</th>
            <th className="hide-on-mobile">Miss</th>
            <th className="hide-on-mobile">OK ({song.freezeArrowCount} / {song.shockArrowCount})</th>
            <th className="hide-on-mobile">Combo</th>
            <th className="hide-on-mobile">Date</th>
            <th className="hide-on-desktop" colSpan="2">Score</th>
            <th></th>
        </tr>
    );

    const tableRow = (score, isCurrent) => {
        const scoreDate = isCurrent ? score.date : format(parseJSON(score.date), 'yyyy/MM/dd hh:mma');
        return (
            <tr className={score.status} key={score._id}>
                <td className="hide-on-mobile">{score.score}</td>
                <td className={`${score.grade === 'AAA' ? 'text-AAA' : ''} hide-on-mobile`}>{score.grade}</td>
                <td className="hide-on-mobile">{score.marvellous}</td>
                <td className="hide-on-mobile">{score.perfect}</td>
                <td className="hide-on-mobile">{score.great}</td>
                <td className="hide-on-mobile">{score.good}</td>
                <td className="hide-on-mobile">{score.boo}</td>
                <td className="hide-on-mobile">{score.miss}</td>
                <td className="hide-on-mobile">{score.ok}</td>
                <td className="hide-on-mobile">{score.combo}</td>
                <td className="hide-on-mobile">{scoreDate}</td>
                <td className="hide-on-desktop" colSpan="2">
                    <span className="mobile-score">{score.score}</span>
                    <hr/>
                    <span className={`${score.grade === 'AAA' ? 'text-AAA' : ''}`}>{score.grade}</span>
                    <hr/>
                    {score.marvellous} / {score.perfect} / {score.great} / {score.good} / {score.boo} / {score.miss} / {score.ok} / {score.combo}
                    <hr/>
                    {scoreDate}
                </td>
                <td><button onClick={handleDeleteScore} scoreid={score._id}>Delete</button></td>
            </tr>
        );
    }
    
    return (
        <div className="score-history">

            <h3>Current best:</h3>
            <table>
                <thead>
                    {tableHeader}
                </thead>
                {currentScore.status !== "Unplayed" ? (
                    <tbody>
                        {tableRow(currentScore, true)}
                    </tbody>
                ) : (
                    <tbody>
                        <tr className="footer">
                            <td className="hide-on-mobile" colSpan="12">This song has yet to be played.</td>
                            <td className="hide-on-desktop" colSpan="3">This song has yet to be played.</td>
                        </tr>
                    </tbody>
                )}
            </table>

            <h3>Score history:</h3>
            <table>
                <thead>
                    {tableHeader}
                </thead>
                {song.scoreHistory.length > 0 ? (
                    <tbody>
                        {song.scoreHistory.map(historicScore => tableRow(historicScore, false)).reverse()}
                        <tr className="footer">
                            <td colSpan="12"><button id="deleteScore" onClick={handleDeleteAllScores}>Delete Every Score</button></td>
                        </tr>
                    </tbody>
                    ) : ( 
                    <tbody>
                        <tr className="footer">
                            <td colSpan="12">No score history to display.</td>
                        </tr>
                        </tbody>
                )}
            </table>
        </div>
    )
}