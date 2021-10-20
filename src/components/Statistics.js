import React from 'react';
import { Link } from 'react-router-dom';

export default function Statistics(props) {

    const difficulties = Object.getOwnPropertyNames(props.statisticsDict);
    difficulties.pop();

    const statisticCard = (statsheet) => {
        return (
            <div className="statcard" key={`statcard-${statsheet.difficulty}`}>
                <div className="statcard-row">
                    <div className="statcard-difficulty-display statcard-row-half">
                        <div className="statcard-difficulty-display-title">Difficulty</div>
                        <div className="statcard-difficulty-display-difficulty">{statsheet.difficulty}</div>
                    </div>
                    <div className="statcard-main-info">
                        <div className="statcard-info-container-row">{statsheet.songCount} Songs</div>
                        <div className="statcard-info-container-row">{statsheet.AAAs} AAA{statsheet.AAAs !== 1 && 's'}</div>
                        <div className="statcard-info-container-row">{statsheet.lamp} Lamp</div>
                    </div>
                </div>
                <div className="statcard-row statcard-center-row">
                    <div className="statcard-row-half">
                        <div className="text-mfc statcard-info-container">
                            <div className="statcard-info-container-title">MFCs</div>
                            <div className="statcard-info-container-info">{statsheet.statuses.MFC}</div>
                        </div>
                        <div className="text-pfc statcard-info-container">
                            <div className="statcard-info-container-title">PFCs</div>
                            <div className="statcard-info-container-info">{statsheet.statuses.PFC}</div>
                        </div>
                        <div className="text-gfc statcard-info-container">
                            <div className="statcard-info-container-title">GFCs</div>
                            <div className="statcard-info-container-info">{statsheet.statuses.GFC}</div>
                        </div>
                    </div>
                    <div className="statcard-row-half">
                        <div className="text-gofc statcard-info-container">
                            <div className="statcard-info-container-title">GoFCs</div>
                            <div className="statcard-info-container-info">{statsheet.statuses.GoFC}</div>
                        </div>
                        <div className="statcard-info-container">
                            <div className="statcard-info-container-title">Cleared</div>
                            <div className="statcard-info-container-info">{statsheet.statuses.Cleared}</div>
                        </div>
                        <div className="text-unplayed statcard-info-container">
                            <div className="statcard-info-container-title">Unplayed</div>
                            <div className="statcard-info-container-info">{statsheet.statuses.Unplayed}</div>
                        </div>
                    </div>
                </div>
                <div className="statcard-row">
                    <div className="statcard-info-container statcard-row-half">
                        <p>Highest Score</p>
                        <p className="statcard-info-song-title">{statsheet.highestScore && statsheet.highestScore.status !== "Unplayed" ? <Link to={'/songs/'+statsheet.highestScore.songID}>{`${statsheet.highestScore.title} (${statsheet.highestScore.score})`}</Link> : "-"}</p>
                    </div>
                    <div className="statcard-info-container statcard-row-half">
                        <p>Lowest Score</p>
                        <p className="statcard-info-song-title">{statsheet.lowestScore && statsheet.lowestScore.status !== "Unplayed" ? <Link to={'/songs/'+statsheet.lowestScore.songID}>{`${statsheet.lowestScore.title} (${statsheet.lowestScore.score})`}</Link> : "-"}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="statCard-container">
            {difficulties.map(diff => {
                return statisticCard(props.statisticsDict[diff]);
            })}
            {statisticCard(props.statisticsDict["All"])}
        </div>
    );
}