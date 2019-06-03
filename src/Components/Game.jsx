import React from 'react';
import backgroundImg from '../Assets/Background.png';
import carImg from '../Assets/Car.png';
import Background from './Background';
import Car from './Car';

class Game extends React.Component {
    SPEED = 1;

    constructor(props) {
        super(props);

        this.state = {
            playerX: 100,
            playerY: 100,
            windowWidth: 0,
            windowHeight: 0
        };

        this.playerWidth = 50;
        this.playerHeight = 50;

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }    

    playerMove(x, y) {
        this.setState({
            playerX: x,
            playerY: y
        });        
    }
  
    onKeyDown(e) {
        switch (e.which) {
            case 37: // Left
                this.playerMove(this.state.playerX - this.SPEED, this.state.playerY);                
                break;
            case 38: // Up
                this.playerMove(this.state.playerX, this.state.playerY - this.SPEED);
                break;
            case 39: // Right
                this.playerMove(this.state.playerX + this.SPEED, this.state.playerY);                
                break;
            case 40: // Down
                this.playerMove(this.state.playerX, this.state.playerY + this.SPEED);
                break;
            default:
                break;
        }
    }  

    componentDidMount(){
        document.addEventListener("keydown", this.onKeyDown, false);

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown, false);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }    

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }

    render() {        
        return <div onKeyDown={this.onKeyDown} tabIndex="0">
            <Background backgroundImage={backgroundImg}
                windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight} />     
            <Car carImage={carImg} centreX={this.state.playerX} 
                centreY={this.state.playerY} width={this.playerWidth}
                height={this.playerHeight} />       
        </div>
    }
}

export default Game;