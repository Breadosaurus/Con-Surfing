class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('crowd', './assets/crowd.png');
        this.load.image('player', './assets/player.png');
        this.load.image('tall', './assets/tall.png');
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

        // add tall people
        // NOTE: please feel free to change the y-values below, not sure how to space them out more evenly
        this.tall1 = new Tall(this, 0, 0, 'tall').setOrigin(0.5, 1).setScale(.8);
        this.tall2 = new Tall(this, 0, -game.config.height/3 - this.tall1.height/2, 'tall').setOrigin(0.5, 1).setScale(.8);
        this.tall3 = new Tall(this, 0, -2*game.config.height/3 - this.tall1.height, 'tall').setOrigin(0.5, 1).setScale(.8);

        // GAME OVER flag
        this.gameOver = false;

    }

    
    update() {  
        if(!this.gameOver) {         // upd8 ONLY if game not over + one player
            this.player.update();     // player mvt
            this.tall1.update();
            this.tall2.update();
            this.tall3.update();
        } 

        // scroll crowd background
        this.crowd.tilePositionY -= scrollSpeed;

        // spawn tall people

    }


} // end Play scene