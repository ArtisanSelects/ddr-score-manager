import React, { useState } from "react";
import { useHistory } from "react-router";
import UserAuthDataService from "../../services/userAuthDataService";
import ErrorMessage, { blankErrorHandler } from "../ErrorMessage";

export default function Login(props) {

    const history = useHistory();
    const [errorHandler, setErrorHandler] = useState({...blankErrorHandler});
    const [canSubmit, setCanSubmit] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) {
            return;
        }
        try {
            const response = await UserAuthDataService.login({
                username: e.target.form.username.value,
                password: e.target.form.password.value
            });
            props.checkAuth();
            history.go(-1);
        } catch (err) {
            let messages = [];
            for (let e of err.response.data) {
                if (e.msg !== 'Invalid value') {
                    messages.push({param: 'auth', msg: e.msg });
                }
            }
            setErrorHandler({hasErrors: true, errorArray: messages});
            setCanSubmit(true);
        }
    }

    return (
        <div>
            <div className="create-form">
                <form autoComplete="off">
                    <fieldset>
                        <legend>Login</legend>

                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input required type="text" id="username" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input required type="password" id="password" />
                        </div>

                        <input type="submit" className={`btn-form ${canSubmit ? "" : "cant-submit"}`} onClick={handleSubmit} value="Submit" />
                    </fieldset>
                </form>
            </div>

            {errorHandler.hasErrors && (
                <ErrorMessage errorArray={errorHandler.errorArray} />
            )}

        </div>
    )
}