class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('crowd', './assets/crowd.png');
        this.load.image('player', './assets/player.png');
    }

    create() {
        // place crowd background 
        this.crowd = this.add.tileSprite(0, 0, 650, 825, 'crowd').setOrigin(0, 0);

        /* test border and text. commenting this out for now ~
        this.add.text(20,20, "ConSurfing Play"); 
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0x4E4E4E).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x4E4E4E).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x4E4E4E).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x4E4E4E).setOrigin(0, 0);
        */

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

        // this.deathTimer = this.time.delayedCall(game.settings.gameTimer, () => {
        //     this.add.image(0, 0, 'end').setOrigin(0, 0);
        //     this.gameOver = true;
        // }, null, this);

    }

    
    update() {  
        if(!this.gameOver) {         // upd8 ONLY if game not over + one player
            this.player.update();     // player mvt
            // this.enemies.update(); 
            //this.platform.update();
        }

        // scroll crowd background
        this.crowd.tilePositionY -= scrollSpeed;
        // scroll player
        this.player.y += scrollSpeed;

        if(this.player.y >= game.config.height * 2) {
            this.gameOver = true;
            this.crowd.tilePositionY = 0;
        }

    }// end update()


} // end Play scene