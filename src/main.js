let config = {
    type: Phaser.AUTO,
    width: 650,
    height: 825,
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Play, ]
}
let game = new Phaser.Game(config); 


// reserve keyboard vars
let keyR, keyM, keyLEFT, keyRIGHT, keyUP, keyA, keyD, keyW;

let borderUISize = game.config.height / 25; 
let borderPadding = borderUISize / 3;

