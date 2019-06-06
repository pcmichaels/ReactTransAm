import React from 'react';

function Obstacle(props) {
    const left = Math.round(props.centreX - (props.width / 2));
    const top = Math.round(props.centreY - (props.height / 2));

    const style = {        
        width: `calc(${props.width}px)`, 
        height: `calc(${props.height}px)`, 
        top: `calc(${top}px)`,
        left: `calc(${left}px)`,                 
        position: 'absolute',        
        zIndex: 1        
    };

    return (
        <img src={props.image} style={style} />
    );
}

export default Obstacle;
