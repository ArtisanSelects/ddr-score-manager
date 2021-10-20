import React, { useState } from "react";

export default function DeleteButton(props) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);

    const handleConfirmDelete = (e) => {
        setConfirmDelete(true);
    }

    const handleCancelDelete = (e) => {
        setConfirmDelete(false);
    }

    const handleSubmit = (e) => {
        if (!canSubmit) {
            return;
        }
        setCanSubmit(false);
        props.handleDelete(e);
    }

    return (
        <div className="delete-button-container">
            {confirmDelete ? ( <div className="link-container-delete">
                    <button onClick={handleCancelDelete} className={`${props.classNames} btn-cancel`}><span className="btn-span do-not-close">Cancel Delete</span></button>
                    <button onClick={handleSubmit} className={`${props.classNames} btn-danger`}><span className="btn-span do-not-close">Confirm Delete</span></button>
                </div> ) : ( <div className="link-container-delete">
                        <button onClick={handleConfirmDelete} className={`${props.classNames} btn-form-fullwidth`}><span className="btn-span do-not-close">Delete</span></button>
                    </div>)
            }
        </div>
    )
}