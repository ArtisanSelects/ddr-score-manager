import React from "react";
import { useHistory } from "react-router-dom";

export default function LinkButton(props) {

    const history = useHistory();

    const handleClick = (e) => {
        if (props.protected && !props.isAuthed) {
            history.push('/login');
        } else {
            history.push(props.to);
        }
    }

    return (
        <button className={`${props.classes}`} onClick={handleClick}><span className="btn-span">{props.displayText}</span></button>
    )
}