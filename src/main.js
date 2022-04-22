let config = {
    type: Phaser.AUTO,
    width: 650,
    height: 825,
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Play ]
}
let game = new Phaser.Game(config); 

let borderUISize = game.config.height / 25; 
let borderPadding = borderUISize / 3;

