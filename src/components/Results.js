import React, { Component } from 'react';
import './Results.css';

const Results = (props) => {
    var color = props.fave ? " greenStar" : " greyStar";
    var starClassName = "fas fa-star" + color;
    return(
        <div className="wrapper">
            <div id="title">
                <button onClick={props.clicked}><i className={starClassName}></i></button> {props.title}
            </div>
            <div id="description">
                <p dangerouslySetInnerHTML={{__html: props.description}} />
            </div>
            <div style={{clear: 'both'}}></div>
        </div>
    );
}

export default Results;