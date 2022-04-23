class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('player', './assets/player.png');
    }

    create() {
        this.add.text(20,20, "ConSurfing Play"); 
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x4E4E4E).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x4E4E4E).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x4E4E4E).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x4E4E4E).setOrigin(0, 0);
        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        
        // add raccoon
        this.player = new Player(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'player', 0, keyLEFT, keyRIGHT, keyUP).setOrigin(0.5, .9);

        // GAME OVER flag
        this.gameOver = false;

    }

    
    update() {    
        if(!this.gameOver) {         // upd8 ONLY if game not over + one player
            this.player.update();     // player mvt
            // this.ship01.update();       // update & move spaceships (x3)
            // this.ship02.update();
            // this.ship03.update();
        } 
    }


} // end Play scene