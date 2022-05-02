let config = {
    type: Phaser.AUTO,
    width: 650,
    height: 825,
    physics: {
        default: 'arcade',
    },
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Tutorial, Play, ]
}
let game = new Phaser.Game(config); 

// reserve keyboard vars
let keyF, keyR, keyM, keyLEFT, keyRIGHT, keyUP, keyDOWN; //keyA, keyD, keyW;


let borderUISize = game.config.height / 30; 
let borderPadding = borderUISize / 3; 
// set scroll speed
let scrollSpeed = 1.6;

let leftBound = 50;
let rightBound = game.config.width - leftBound;

let lastEnemy = {};

