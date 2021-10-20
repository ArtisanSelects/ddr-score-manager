import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ isAuthed }) {
    const location = useLocation();

    const navItems = [  {urlLocation: "/", displayText: "Home"},
                        {urlLocation: "/scores", displayText: "Scores"},
                        {urlLocation: "/stats", displayText: "Statistics"},
                        {urlLocation: "/miscscores", displayText: "Miscellaneous Scores"},
                        {urlLocation: "/songs/create", displayText: "Add Song"},
                        {urlLocation: "/about", displayText: "About"}
                    ];

    const NavItem = ({urlLocation, displayText}) => {
        return (<li key={urlLocation}><Link to={urlLocation} className={`${location.pathname === urlLocation ? 'active' : ''}`}>{displayText}</Link></li>)
    }

    return (
        <nav>
            <ul>
                {navItems.map(navitem => { return ( NavItem(navitem) ) })}
                {isAuthed ? ( NavItem({urlLocation: "/logout", displayText: "Logout"}) ) : ( NavItem({urlLocation: "/login", displayText: "Login"}) ) }
            </ul>
        </nav>
    );
}