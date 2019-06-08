import React from 'react';

function GameStatus(props) {
    const style = {
        position: 'absolute',
        zIndex: 1
    };

    return (        
        <label style={style}>
            Lives Remaining: {props.Lives}
        </label>
    );
}

export default GameStatus;
