import React from 'react';
import backgroundImg from '../Assets/Background.png';
import treeImg from '../Assets/Tree.png';
import carImg from '../Assets/Car.png';
import brokenCarImg from '../Assets/Crash.png';
import cupImg from '../Assets/Cup.png';
import Background from './Background';
import Car from './Car';
import GameItem from './GameItem';
import GameStatus from './GameStatus';

class Game extends React.Component {
    SPEED = 1;
    TOPLEVEL = 10;

    constructor(props) {
        super(props);

        document.body.style.overflow = "hidden";

        this.state = {
            playerX: 100,
            playerY: 100,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            playerMomentum: 0,
            playerRotation: 0,
            playerVelocityX: 0,
            playerVelocityY: 0,
            playerLives: 3,
            playerCrashed: false,
            gameLoopActive: false,
            message: "",
            score: 0,
            level: 1,
            cupCount: 1,            
            remainingTime: 0,
            username: ''
        };

        this.spriteWidth = 25;
        this.spriteHeight = 25;

        this.halfWidth = this.spriteWidth / 2;
        this.halfHeight = this.spriteHeight / 2;        

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);                  
        
    }

    initiateNewGame() {
        this.setState({ 
            playerLives: 3,
            level: 1
        });        

        this.updateMessage("New game");

        this.startLevel(this.state.level);
    }

    updateMessage(message) {
        this.setState({ 
            message: message
        });        

        setTimeout(function() {this.setState({ message: "" });}.bind(this), 5000);
    }

    stopCar() {
        this.setState({ 
            playerMomentum: 0,
            playerVelocityX: 0,
            playerVelocityY: 0           
        });
    }

    updateUserName(newUserName) {
        this.setState({
            username: newUserName
        });
    }

    resetCarPosition() {
        this.stopCar();

        this.setState({ 
            playerRotation: 0
        });
    }

    buildObstacles() {
        let obstacles = [];
        const obstacleCount = Math.floor(Math.random() * (this.state.level * 2)) + 1;
        for (let i = 1; i <= obstacleCount; i++) {
            const centreX = Math.floor(Math.random() * this.state.windowWidth) + 1;
            const centreY = Math.floor(Math.random() * this.state.windowHeight) + 1;            

            obstacles.push(<GameItem key={i} image={treeImg} centreX={centreX} centreY={centreY} width={this.spriteWidth} height={this.spriteHeight} itemType={1} />);
        }

        return obstacles;
    }

    placeCups() {
        let cups = [];
        
        for (let i = 1; i <= this.state.cupCount; i++) {            
            const centreX = Math.floor(Math.random() * (this.state.windowWidth - this.spriteWidth)) + this.halfWidth;
            const centreY = Math.floor(Math.random() * (this.state.windowHeight - this.spriteHeight)) + this.halfHeight;            

            cups.push(<GameItem key={i} image={cupImg} centreX={centreX} centreY={centreY} width={this.spriteWidth} height={this.spriteHeight} itemType={2} />);
        }

        return cups;
    }

    gameLoop() {
        if (!this.state.gameLoopActive) return;
        
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
    
        let rect1 = this.getPlayerRect()

        // Check for crash
        if (this.detectAnyCollision(rect1)) {
            this.playerDying(1000);                    
        }

        // Check for collected cup
        const item = this.detectGameItemCollision(this.halfWidth, this.halfHeight, rect1, this.cups);
        if (item !== undefined) {
            this.collectedCup(item.key);
        }
        
        let remaining = (this.endLevelTimeMS - (new Date()).getTime()) / 1000;

        if (remaining <= 0) {
            this.updateMessage("Out of time!");
            this.playerDies();
        }

        this.setState({
            remainingTime: Math.round(remaining)
        });                

    }

    getPlayerRect(halfWidth, halfHeight) {
        return {
            x: this.state.playerX - this.halfWidth, y: this.state.playerY - this.halfHeight,
            width: this.spriteWidth, height: this.spriteHeight
        };
    }

    updateHighScore() {
        fetch('http://localhost:7071/api/AddHighScores?name=' + this.state.username + '&score=' + this.state.score, {
            method: 'POST'
        });            
    }

    collectedCup(key) {
        this.setState({ 
            score: this.state.score + 1            
        });

        this.cups = this.cups.filter(cup => cup.key != key);
        
        this.updateMessage("Collected cup");

        if (this.cups.length == 0) {
            this.completedLevel();
        }        
    }

    completedLevel() {
        if (this.state.level >= 10) {
            this.updateMessage("Congratulations, you've completed the game");
        }        

        this.startLevel(this.state.level + 1);
    }

    startLevel(level) {        
        
        this.setState({
            level: level,
            cupCount: level * 2 
        });        

        this.obstacles = this.buildObstacles();        
        this.cups = this.placeCups();

        this.resetCarPosition();
                
        this.totalLevelTimeMS = (this.TOPLEVEL - (this.state.level - 1)) * 60 * 1000 
        let startLevelTimeMS = (new Date()).getTime();
        this.endLevelTimeMS = startLevelTimeMS + this.totalLevelTimeMS;        
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

    onChangeUsername(e) {
        this.updateUserName(e.target.value);
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

        this.setState({ gameLoopActive: true });

        this.initiateNewGame();
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown, false);
        window.removeEventListener('resize', this.updateWindowDimensions);
        clearInterval(this.intervalId);
    }    

    updateWindowDimensions() {        
        this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });

        console.log('width: ' + this.state.windowWidth + ', height: ' + this.state.windowHeight);
    }

    detectAnyCollision(rect1) {        
        // Have we crashed or left the screen
        if (this.detectOutScreen(rect1)) {
            return true;
        }

        let collided = this.detectGameItemCollision(this.halfWidth, this.halfHeight, rect1, this.obstacles);
        if (collided !== undefined) {
            return true;
        }

        return false;
    }

    detectGameItemCollision(halfWidth, halfHeight, rect1, gameItemList) {
        const collided = gameItemList.find(a => {
            var rect2 = {
            x: a.props.centreX - halfWidth, y: a.props.centreY - halfHeight,
                width: this.spriteWidth, height: this.spriteHeight
            };
            return (this.detectCollision(rect1, rect2));
        });        

        return collided;
    }
    
    detectCollision(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
                return true;
        }
        return false;
    }

    detectOutScreen(rect1) {
        if (rect1.x < 0 || rect1.x + rect1.width > this.state.windowWidth
            || rect1.y < 0 || rect1.y + rect1.height > this.state.windowHeight) {
            return true;
        }
        return false;
    }

    repositionPlayer() {        

        do {
            // Pace the player at a random point on the map
            const centreX = Math.floor(Math.random() * this.state.windowWidth) + 1;
            const centreY = Math.floor(Math.random() * this.state.windowHeight) + 1;            

            this.playerMove(centreX, centreY);            

            // Check that we haven't caused a colision
        } while (this.playerHasCrashed());
    }

    playerHasCrashed() {
        let rect1 = this.getPlayerRect(this.halfWidth, this.halfHeight); 
        return this.detectAnyCollision(rect1);
    }

    playerDying(tillDeath) {
        this.setState({
            playerCrashed: true,
            gameLoopActive: false
        });

        this.stopCar();

        setTimeout(this.playerDies.bind(this), tillDeath);
    }

    playerDies() {               
        this.setState({
            playerLives: this.state.playerLives - 1,
            gameLoopActive: false
        });

        if (this.state.playerLives <= 0) {
            this.updateHighScore();
            this.initiateNewGame();
        } else {
            this.startLevel(this.state.level);
        }

        this.repositionPlayer();

        this.setState({            
            playerCrashed: false,
            gameLoopActive: true
        });
    }

    render() {        
        return <div onKeyDown={this.onKeyDown} tabIndex="0">

            <GameStatus Lives={this.state.playerLives} 
                Message={this.state.message} 
                Score={this.state.score} 
                RemainingTime={this.state.remainingTime}
                Level={this.state.level}
                Username={this.state.username} 
                onChangeUsername={this.onChangeUsername.bind(this)} />

            <Background backgroundImage={backgroundImg}
                windowWidth={this.state.windowWidth} 
                windowHeight={this.state.windowHeight} />  

            <Car carImage={this.state.playerCrashed ? brokenCarImg : carImg} 
                centreX={this.state.playerX} centreY={this.state.playerY} 
                width={this.spriteWidth} height={this.spriteHeight} 
                rotation={this.state.playerRotation} />     

            {this.obstacles}  

            {this.cups}  
        </div>
    }
}

export default Game;