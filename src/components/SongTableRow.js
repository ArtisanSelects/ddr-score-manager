import React from "react";
import SongPreview from "./SongPreview";

export default function SongTableRow({song}) {
    return (
        <tr className={`${song.score.status}`} >
            <SongPreview song={song} />
            <td className="hide-on-mobile">{song.score.score === 0 ? '-' : song.score.score}</td>
            <td className={`${song.score.grade === 'AAA' ? 'text-AAA' : ''} hide-on-mobile`}>{song.score.grade}</td>
            <td className="hide-on-mobile">{song.score.marvellous}</td>
            <td className="hide-on-mobile">{song.score.perfect}</td>
            <td className="hide-on-mobile">{song.score.great}</td>
            <td className="hide-on-mobile">{song.score.good}</td>
            <td className="hide-on-mobile">{song.score.boo}</td>
            <td className="hide-on-mobile">{song.score.miss}</td>
            <td className="hide-on-mobile">{song.score.ok}</td>
            <td className="hide-on-mobile">{song.score.combo}</td>
            <td colSpan="2" className="hide-on-desktop">
                {song.score.score === 0 ? (
                    <span className="mobile-score">-</span>
                ) : (
                    <div>
                        <span className="mobile-score">{song.score.score}</span>
                        <hr/>
                        <span className={`${song.score.grade === 'AAA' ? 'text-AAA' : ''}`}>{song.score.grade}</span>
                        <hr/>
                        {song.score.marvellous} / {song.score.perfect} / {song.score.great} / {song.score.good} / {song.score.boo} / {song.score.miss} / {song.score.ok} / {song.score.combo}
                    </div>
                )}
                
            </td>
        </tr>
    );
}