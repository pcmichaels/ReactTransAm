import React from 'react';
import clockImg from '../Assets/Clock.png';

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

    const containerStyle = {
        position: 'relative',
        textAlign: 'center',
        color: 'red'
    }

    const textDivStyle = {        
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        fontWeight: 'bold'
    }

    const imgStyle = {
        width: '100%',
        zIndex: 0
    }


    return (    
        <div className="flex-container" style={flexStyle}>
            <label style={labelStyle}>
                Lives Remaining: {props.Lives}
            </label>
            <label style={labelStyle}>
                Score: {props.Score}
            </label>
            <label style={labelStyle}>
                Level: {props.Level}
            </label>            
            
            <div style={containerStyle}>  
                <img src={clockImg} style={imgStyle} />
                <div style={textDivStyle}>{props.RemainingTime}</div>
            </div>

            <label style={labelStyle}>
                {props.Message}
            </label>

            <div style={containerStyle}>
                <input type='text' value={props.Username}
                    onChange={props.onChangeUsername} />
            </div>
        </div>  
    );
}

export default GameStatus;
