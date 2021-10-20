import React, { useEffect } from "react";
import { useHistory } from "react-router";
import UserAuthDataService from "../../services/userAuthDataService";

export default function Logout(props) {

    const history = useHistory();

    const logout = async () => {
        await UserAuthDataService.logout();
        props.checkAuth();
        history.go(-1);
    };

    useEffect(() => {
        logout();
    }, []);

    return (
        <div>

        </div>
    )
}