class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('crowd', './assets/crowd.png');
        this.load.image('player', './assets/player.png');
        this.load.image('tempEnd', './assets/tempEnd.png');
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
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // add raccoon
        this.player = new Player(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'player', 0, keyLEFT, keyRIGHT, keyUP).setOrigin(0.5, .9);

        // add tall people
        // NOTE: please feel free to change the y-values below, not sure how to space them out more evenly
        this.tall1 = new Tall(this, 0, 0, 'tall').setOrigin(0.5, 1).setScale(.8);
        this.tall2 = new Tall(this, 0, -game.config.height/3 - this.tall1.height/2, 'tall').setOrigin(0.5, 1).setScale(.8);
        this.tall3 = new Tall(this, 0, -2*game.config.height/3 - this.tall1.height, 'tall').setOrigin(0.5, 1).setScale(.8);

        // GAME OVER flag
        this.gameOver = false;

        // this.deathTimer = this.time.delayedCall(game.settings.gameTimer, () => {
        //     this.add.image(0, 0, 'end').setOrigin(0, 0);
        //     this.gameOver = true;
        // }, null, this);

    }

    
    update() {  
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        // check for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.scene.start('menuScene');
        }
        
        
        if(!this.gameOver && !this.player.isHit) {         // upd8 ONLY if game not over + one player
            this.player.update();     // player mvt
            this.tall1.update();    // this.enemies.update(); 
            this.tall2.update();    //this.platform.update();
            this.tall3.update();
        }

        // scroll crowd background
        this.crowd.tilePositionY -= scrollSpeed;
        // scroll player
        this.player.y += scrollSpeed;

        // game end condition -> player too long off screen
        if(this.player.y >= game.config.height * 2) {
            this.gameOver = true;
            this.add.image(0, 0, 'tempEnd').setOrigin(0, 0);
        }

        // check collisions for raccoon
        if(this.checkCollision(this.player, this.tall1)) {
            // this.player.isHit();
            // this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.player, this.tall2)) {
            // this.player.isHit();
            // this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.player, this.tall3)) {
            // this.shipExplode(this.ship01);
        }

        // spawn tall people

    }// end update()

    checkCollision(player, tall) {
        // simple AABB checking
        if(player.x < tall.x + tall.width && player.x + player.width > tall.x && player.y < tall.y + tall.height && player.height + player.y > tall.y) {
            return true;
            console.log("collision true")
        } else {
            return false;
        }
    } // end checkCollision()

    isHit(player) {
        // temporarily hide ship
        player.alpha = 0;
        // create explosion sprite @ ship's position
        let boom = this.add.sprite(player.x, player.y, 'oof').setOrigin(0, 0);
        boom.anims.play('oof');             // play explode anim
        boom.on('animationcomplete', () => {    // callback after anim completes
            player.reset();                       // reset ship position
            player.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        // this.score += ship.points;
        // this.scoreLeft.text = this.score;
        // time add and repaint
        // this.timer += ship.timeBoost;
        // this.timerRight.text = this.timerRight;

        // play explosion sfx
        // this.sound.play('sfx_wrap');
    } // end shipExplode()


} // end Play scene