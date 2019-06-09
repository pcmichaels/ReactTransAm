import React from 'react';

function GameStatus(props) {
    const style = {
        position: 'absolute',
        zIndex: 1
    };

    return (      
        <div>
            <label style={style}>
                Lives Remaining: {props.Lives}
            </label>
            <label>
                {props.Message}
            </label>
        </div>  
    );
}

export default GameStatus;
