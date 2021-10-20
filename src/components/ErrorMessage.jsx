import React from "react"

export default function ErrorMessage({errorArray}) {
    return (
        <div className="error-alert">
            <h3>ERROR{errorArray.length > 1 ? "S" : ""}</h3>
            <ul>
                {errorArray.map(err => <li key={`${err.msg}`}>{err.msg}</li>)}
            </ul>
        </div>
    )
}

export const blankErrorHandler = {hasErrors: false, errorArray: []};