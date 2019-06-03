import React from 'react';

function Background(props) {
    console.log('width: ' + props.windowWidth);
    console.log('height: ' + props.windowHeight);

    const bgStyle = {        
        width: `calc(${props.windowWidth}px)`, 
        height: `calc(${props.windowHeight}px)`, 
        top: 0,
        left: 0,
        position: 'absolute'        
    };

    return (
        <img src={props.backgroundImage} style={bgStyle} />
    );
}

export default Background;