class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('crowd', './assets/crowd.png');
        this.load.image('player', './assets/player.png');
        this.load.image('end', './assets/end.png');
        this.load.image('tall', './assets/tall.png');
        
        this.load.spritesheet('oof', './assets/oofAnim.png', {frameWidth: 146, frameHeight: 183, startFrame: 0, endFrame: 1});
        this.load.spritesheet('pLeft', './assets/leftAnim.png', {frameWidth: 188, frameHeight: 192, startFrame: 0, endFrame: 1});
        this.load.spritesheet('pRight', './assets/rightAnim.png', {frameWidth: 190.5, frameHeight: 192, startFrame: 0, endFrame: 1});
        this.load.spritesheet('pUp', './assets/upAnim.png', {frameWidth: 146, frameHeight: 183, startFrame: 0, endFrame: 1});
        
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
        this.player = new Player(this, game.config.width/2, game.config.height - 300 /*change to variable later*/, 'player', 0, keyLEFT, keyRIGHT, keyUP, keyDOWN).setOrigin(0.5, 0);
        
        // this.player = this.physics.add.sprite(game.config.width/2, game.config.height - borderUISize - borderPadding, 'player');
        // this.cursors = this.input.keyboard.createCursorKeys();

         // group with all active tall ppl
         this.enemyGroup = this.add.group({
            removeCallback: function(enemy){
                enemy.scene.enemyPool.add(enemy)
            }
        });

        // pool of tall ppl that are not currently active
        this.enemyPool = this.add.group({
            removeCallback: function(enemy){
                enemy.scene.enemyGroup.add(enemy)
            }
        })

        // add enemy
        this.addEnemy();

        // animation config
        this.anims.create({
            key: 'pLeft',
            frames: this.anims.generateFrameNumbers('pLeft', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({
            key: 'pRight',
            frames: this.anims.generateFrameNumbers('pRight', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({
            key: 'pUp',
            frames: this.anims.generateFrameNumbers('pUp', {start: 0, end: 1}),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({
            key: 'oof',
            frames: this.anims.generateFrameNumbers('oof', {start: 0, end: 1, first: 0}),
            frameRate: 3,
        });


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

            // recycling tall ppl >:3
            this.enemyGroup.getChildren().forEach(function(enemy) { 
                if (enemy.active && enemy.y >= game.config.height + enemy.height) {
                    this.enemyGroup.killAndHide(enemy);
                    this.enemyGroup.remove(enemy);
                }
                enemy.update();
            }, this);

            // adding tall ppl
            this.enemyDistance = this.enemyGroup.getChildren()[this.enemyGroup.getLength()-1].y;
            if (this.enemyDistance > this.nextEnemyDistance) {
                this.addEnemy();
            }
        }

        // scroll crowd background
        this.crowd.tilePositionY -= scrollSpeed;
        // scroll player
        if (!this.player.upKey.isDown) {
            this.player.y += scrollSpeed;
        }

        // game end condition -> player too long off screen
        if(this.player.y >= game.config.height + this.player.height) {
            this.gameOver = true;
            this.add.image(0, 0, 'end').setOrigin(0, 0);
        }

        // check collisions for raccoon
        // if(this.checkCollision(this.player, this.Tall)) {
        //     this.time.delayedCall(this.isHit(this.player));
        // }
        this.enemyGroup.getChildren().forEach(function(enemy) { 
            if (this.checkCollision(this.player, enemy)) {
                if (!this.player.isHit) {
                    this.isHit(this.player);
                } 
            }
        }, this);

    }// end update()

    checkCollision(player, tall) {
        // simple AABB checking
        if(player.x - player.width/2 < tall.x && player.x + player.width/2 > tall.x - tall.width/2 && player.y < tall.y && player.y + player.height > tall.y - tall.height) {
            return true;
        } else {
            return false;
        }
    } // end checkCollision()

    isHit(player) {
        this.player.isHit = true;
        // temporarily hide ship
        player.alpha = 0;
        let boom = this.add.sprite(player.x, player.y, 'oof').setOrigin(0.5, 0);
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

    addEnemy() {
        // change later so there's a 50/50 chance of the enemy being a tall person or a glowstick

        let enemy;

        // add tall person
        
        // if enemyPool is not empty, move one of its enemies to the active group
        if (this.enemyPool.getLength()) {    
            enemy = this.enemyPool.getFirst();
            enemy.x = enemy.randomX();
            this.enemyPool.remove(enemy);
        // if enemyPool is empty, add a new enemy to the active group
        } else {
            enemy = new Tall(this, 0, 0, 'tall').setOrigin(0.5, 1);
            this.enemyGroup.add(enemy);
        }

        // add glowstick
        // - code here -

        // set next enemy distance
        this.nextEnemyDistance = Phaser.Math.Between(this.player.height * 2, this.player.height * 3);
    }



} // end Play scene