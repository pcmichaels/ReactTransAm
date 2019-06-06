import React from 'react';
import backgroundImg from '../Assets/Background.png';
import treeImg from '../Assets/Tree.png';
import carImg from '../Assets/Car.png';
import Background from './Background';
import Car from './Car';
import Obstacle from './Obstacle';

class Game extends React.Component {
    SPEED = 1;

    constructor(props) {
        super(props);

        document.body.style.overflow = "hidden";

        this.state = {
            playerX: 100,
            playerY: 100,
            windowWidth: 1500,
            windowHeight: 1500,
            playerMomentum: 0,
            playerRotation: 0,
            playerVelocityX: 0,
            playerVelocityY: 0
        };

        this.spriteWidth = 25;
        this.spriteHeight = 25;

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);      
        
        this.obstacles = this.buildObstacles();        
    }

    buildObstacles() {
        let obstacles = [];
        const obstacleCount = Math.floor(Math.random() * 10) + 1;
        console.log('Obstacle count ' + obstacleCount);
        for (let i = 1; i <= obstacleCount; i++) {
            const centreX = Math.floor(Math.random() * this.state.windowWidth) + 1;
            const centreY = Math.floor(Math.random() * this.state.windowHeight) + 1;

            console.log('Obstacle x / y ' + centreX + ' / ' + centreY);

            obstacles.push(<Obstacle key={i} image={treeImg} centreX={centreX} centreY={centreY} width={this.spriteWidth} height={this.spriteHeight} />);
        }

        return obstacles;
    }

    gameLoop() {        
        const radians = (this.state.playerRotation - 90) * Math.PI / 180;        

        const aX = (this.state.playerMomentum * Math.cos(radians));
        const aY = (this.state.playerMomentum * Math.sin(radians));

        const velocityX = this.state.playerVelocityX;
        const velocityY = this.state.playerVelocityY;
        const velocitySq = Math.pow(velocityX, 2) + Math.pow(velocityY, 2);
        const posSq = Math.pow(aX, 2) + Math.pow(aY, 2);
        const velocityPosSq = Math.pow(velocityX * aX + velocityY * aY, 2);
       
        let skidFactor = (posSq == 0 || velocitySq == 0) ? 0 : 1 - (velocityPosSq / posSq / velocitySq);
        if (skidFactor <= 0) skidFactor = 0;        

        this.setState({
            playerVelocityX: (skidFactor * velocityX) + ((1 - skidFactor) * aX),
            playerVelocityY: (skidFactor * velocityY) + ((1 - skidFactor) * aY)
        });        
        this.playerMove(
            this.state.playerX + this.state.playerVelocityX,
            this.state.playerY + this.state.playerVelocityY 
        );

        this.playerDecelerate(-(0.1 + skidFactor));
        
    }

    playerMove(x, y) {
        this.setState({
            playerX: x,
            playerY: y
        });        
    }

    playerAccelerate(speed) {
        this.setState({
            playerMomentum: this.state.playerMomentum + speed
        });
    }

    playerDecelerate(speed) {
        if (this.state.playerMomentum > 0) {
            this.setState({
                playerMomentum: this.state.playerMomentum + speed
            });
        } else if (this.state.playerMomentum < 0) {
            this.setState({
                playerMomentum: this.state.playerMomentum - speed
            });
        }
    }

    playerSteer(direction) {
        this.setState({
            playerRotation: this.state.playerRotation + direction
        });
    }
  
    onKeyDown(e) {
        switch (e.which) {
            case 37: // Left
                this.playerSteer(-10);
                break;
            case 38: // Up
                this.playerAccelerate(0.3);
                break;
            case 39: // Right
                this.playerSteer(10);
                break;
            case 40: // Down
                this.playerDecelerate(-0.5);
                break;
            default:
                break;
        }
    }  

    componentDidMount(){
        document.addEventListener("keydown", this.onKeyDown, false);

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        
        this.intervalId = setInterval(this.gameLoop.bind(this), 100);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown, false);
        window.removeEventListener('resize', this.updateWindowDimensions);
        clearInterval(this.intervalId);
    }    

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
    }

    render() {        
        return <div onKeyDown={this.onKeyDown} tabIndex="0">
            <Background backgroundImage={backgroundImg}
                windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight} />     
            <Car carImage={carImg} centreX={this.state.playerX} 
                centreY={this.state.playerY} width={this.spriteWidth}
                height={this.spriteHeight} rotation={this.state.playerRotation} />     
            {this.obstacles}  
        </div>
    }
}

export default Game;