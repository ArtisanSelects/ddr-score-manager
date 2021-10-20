import React from 'react';
import LinkButton from './LinkButton';

export default function Homepage(props) {
    return (
        <div>
            <div className="homepage-bg">
                <img className="homepage-bg-img" alt="A StepmaniaX dance pad." src='/images/pad.jpg' />
            </div>
            <div className="homepage-main">
                <div className="homepage-text">
                    <h1>Dance Dance Revolution Score Manager</h1>
                    <span>For those who wish to be shown my moves...<br/>I will show you my moves...</span>
                </div>
                <div className="homepage-links">
                    <LinkButton classes="btn-homepage" to="/scores" displayText="View the Scores" />
                    <LinkButton classes="btn-homepage" to="/about" displayText="Learn More" />
                </div>
            </div>
        </div>
    );
}