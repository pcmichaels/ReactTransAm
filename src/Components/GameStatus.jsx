import React from 'react';

function GameStatus(props) {

    const flexStyle = {
        display: 'flex',
        position: 'absolute',
        zIndex: 1,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    };

    const labelStyle = {        
        zIndex: 1,
        margin: 50
    };

    return (      
        <div className="flex-container" style={flexStyle}>
            <label style={labelStyle}>
                Lives Remaining: {props.Lives}
            </label>
            <label style={labelStyle}>
                Score: {props.Score}
            </label>
            <label style={labelStyle}>
                {props.Message}
            </label>
        </div>  
    );
}

export default GameStatus;
