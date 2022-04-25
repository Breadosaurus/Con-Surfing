let config = {
    type: Phaser.AUTO,
    width: 650,
    height: 825,
    physics: {
        default: 'arcade',
    },
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Play, ]
}
let game = new Phaser.Game(config); 


// reserve keyboard vars
let keyR, keyM, keyLEFT, keyRIGHT, keyUP, keyDOWN; //keyA, keyD, keyW;

// set scroll speed
let scrollSpeed = 1.5;
let obScale = .6;

let borderUISize = game.config.height / 25; 
let borderPadding = borderUISize / 3;