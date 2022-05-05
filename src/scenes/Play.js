class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    

    create() {
        // length of bottom stage gradient
        this.gradient = 90;

        // place stage
        this.stage = this.add.sprite(0, this.gradient, 'stage').setOrigin(0, 1).setDepth(3);

        // current bottom of stage
        this.stageBtm = this.stage.height - this.gradient;
        
        // music!! concert!! banger!!
        this.concert = this.sound.add('theme', {
            mute: false,
            volume: 0.75,
            rate: 1,
            loop: true,
        });
        this.concert.play();

        // place crowd background 
        this.crowd = this.add.tileSprite(0, 0, 650, 825 + this.stageBtm, 'crowd').setOrigin(0, 0);

        this.camera = this.cameras.main.setBounds(0, -this.stageBtm, game.config.width, game.config.height + this.stageBtm);

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // initial distance btwn raccoon and bottom of screen
        this.raccoonStart = 300;
        
        // add raccoon WITH PHYSICS
        this.player = new Player(this, game.config.width/2, game.config.height - this.raccoonStart, 'player', 0, keyLEFT, keyRIGHT, keyUP, keyDOWN).setScale(0.6).setOrigin(0.5, 0).setDepth(2.5);

        // animation config
        this.anims.create({         // the boys will bounce!
            key: 'stage',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'stage_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({         // turning either direction
            key: 'turn',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'turn_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({         // up/idle
            key: 'up',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'up_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({         
            key: 'oof',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'oof_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 12,
        });
        this.anims.create({         // endscreen anim
            key: 'endAnim',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'end_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({         // green anim
            key: 'green',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'gloGreen_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({         // blue anim
            key: 'blue',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'gloBlu_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({         // purple anim
            key: 'purple',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'gloPurp_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });
        this.anims.create({         // orange anim
            key: 'raised',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'raised_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });

        // min and max vertical distance between enemies
        this.minEnemyDistY = 200;
        this.maxEnemyDistY = 300;

        // group with all active tall ppl
        this.enemyGroup = this.add.group({
            removeCallback: (enemy) => {
                this.enemyPool.add(enemy)
            }
        });

        // pool of tall ppl that are not currently active
        this.enemyPool = this.add.group({
            removeCallback: (enemy) => {
                this.enemyGroup.add(enemy)
            }
        });

        // group with all active hands
        this.handsGroup = this.add.group({
            removeCallback: (hands) => {
                this.handsPool.add(hands)
            }
        });

        // pool of hands that are not currently active
        this.handsPool = this.add.group({
            removeCallback: (hands) => {
                this.handsGroup.add(hands)
            }
        });

        // add collisions between player and all enemies
        this.physics.add.collider(this.player, this.enemyGroup, () => this.player.bump()/*, this.player.ouch()*/);
        
        // add overlap between player and all hands
        this.physics.add.overlap(this.player, this.handsGroup, () => this.player.speedBoost());

        // set min & max horizontal distance between two enemies
        this.minXDist = 10;
        
        // add enemy
        this.addEnemy();

        // timer
        this.timeCounter = this.game.settings.gameTimer;

        // stylize timer
        let timeConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '20px',
            backgroundColor: '#4345b0',
            color: '#eaeafc',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5, 
            },
            fixedWidth: 69
        } 
        // add timer
        this.timer = this.add.text(borderUISize + borderPadding + 470, this.camera.scrollY + borderUISize + borderPadding*2, this.timeCounter, timeConfig).setDepth(3);
        this.timeRemain = this.game.settings.gameTimer;

        // add borders
        this.add.rectangle(0,0, leftBound ,game.config.height, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(rightBound, 0, game.config.width - rightBound, game.config.height, 0x2F3079).setOrigin(0,0);
        
        // game over flag
        this.gameOver = false;
        this.location = 0;
        
    }

    
    update(time, delta) {  
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.concert.stop();
            this.sound.play('restart');
            this.scene.restart();
        }
        // check for menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.concert.stop();
            this.sound.play('menu');
            this.scene.start('menuScene');
        }
        
        if(!this.gameOver) {         // upd8 ONLY if game not over 
            this.player.update();     // player mvt
            
            // bottom of the stage before gradient starts
            this.stageBtm = this.stage.y - this.gradient;

            // percentage of crowd raccoon has travelled 
            this.playerProgress = (game.config.height - this.player.y) / (game.config.height - (this.stage.y + 125));

            if (this.playerProgress > 1) {
                this.playerProgress = 1;
            }

            // scroll camera according to playerProgress
            this.camera.scrollY = this.playerProgress * -(this.stage.height - this.gradient);

            // moving off-screen enemies from group to pool
            this.enemyGroup.getChildren().forEach((enemy) => { 
                if (enemy.active && enemy.y - enemy.height >= this.camera.scrollY + game.config.height) {
                    this.enemyGroup.killAndHide(enemy);
                    this.enemyGroup.remove(enemy);
                } else {
                    enemy.update();
                }
            }, this);

            // adding enemies
            this.enemyDistY = this.getLastEnemy().y - this.stageBtm;
            if (this.enemyDistY > this.nextEnemyDistY) {
                this.addEnemy();
            }

            // moving off-screen hands from group to pool
            this.handsGroup.getChildren().forEach((hands) => { 
                if (hands.active && hands.y - hands.height >= this.camera.scrollY + game.config.height) {
                    this.handsGroup.killAndHide(hands);
                    this.handsGroup.remove(hands);
                } else {
                    hands.update();
                }
            }, this);

            // scroll crowd background
            this.crowd.tilePositionY -= scrollSpeed;

            // the band plays!!!
            this.stage.play('stage', true);

            //Adding in Gamer Timer
            if(this.playerProgress >= 1) {
                this.timeRemain += delta;
                this.timeCounter = time; 
                this.timeCounter = Math.floor(this.timeRemain/1000) + 1; 
                this.timer.text = this.timeCounter; 
            }
            
            // game end condition 
            if(this.player.y >= game.config.height) {         
                this.gameOver = true;
                this.concert.setVolume(0.20);
                this.sound.play('taco_bell_of_death');
                this.end = this.add.sprite(0, 0, 'end').setOrigin(0, 0).setDepth(3);
                this.end.anims.play('endAnim', true);
                let scoreConfig = {
                    fontFamily: 'Comic Sans MS',
                    fontSize: '46px',
                    color: '#b0e3f7',
                    align: 'center',
                    padding: {
                        top: 5,
                        bottom: 5, 
                    },
                } 
                this.add.text(345, 545, `${this.timeCounter} secs`, scoreConfig).setDepth(5).setOrigin(0.5, 0);
            }
        }

    }// end update()

    // -----------#### ENEMY TIME ####----------- //
    addEnemy() {
        let enemy;
        
        // if enemyPool is not empty, move one of its enemies to the active group
        if (this.enemyPool.getLength()) {   
            enemy = this.enemyPool.getFirst();
            enemy.setType();
            enemy.updateSize();
            enemy.x = this.newEnemyX(enemy);
            enemy.y = this.stageBtm;
            enemy.active = true;
            enemy.visible = true;
            this.enemyPool.remove(enemy);

        // if enemyPool is empty, add a new enemy to the active group
        } else { 
            enemy = new Enemy(this, 0, this.stageBtm, 'tall').setOrigin(0.5, 1);
            // if this is not the first enemy in the game
            if (this.getLastEnemy()) {
                enemy.x = this.newEnemyX(enemy);
            // if this is the very first enemy in the game
            } else {
                enemy.x = Phaser.Math.Between(leftBound + enemy.width/*/2*/, rightBound - enemy.width/*/2*/);
            }
            this.enemyGroup.add(enemy);
        }

        // set next enemy distances
        this.setNextEnemyDistY();

        // add hands
        if (Math.random() < 0.5) {
            this.addHands();
        }
    }

    // returns the most recently dispatched enemy (closest to stage)
    getLastEnemy() {
        return this.enemyGroup.getChildren()[this.enemyGroup.getChildren().length - 1];
    }

    // set vertical distance between current and next enemy
    setNextEnemyDistY() {
        this.nextEnemyDistY = Phaser.Math.Between(this.minEnemyDistY, this.maxEnemyDistY);
    }

    newEnemyX(enemy) {
        // set left and right edges of the most recently dispatched enemy
        let lastEnemy = this.getLastEnemy();
        let lastEnemyL = lastEnemy.x - lastEnemy.width/2;
        let lastEnemyR = lastEnemy.x + lastEnemy.width/2;

        let newX;
        let side;

        // if space to left of last enemy is too small to fit new enemy
        if (lastEnemyL - leftBound < this.minXDist + enemy.width) {
            // generate new enemy to right of last enemy
            side = 'right';
        // if space to right of last enemy is too small to fit new enemy
        } else if (rightBound - lastEnemyR < this.minXDist + enemy.width) {
            // generate new enemy to left of last enemy
            side = 'left';
        } else {
            // randomly pick one side to generate new enemy
            side = Math.random < 0.5 ? 'left' : 'right';
        }

        if (side == 'left') {
            newX = Phaser.Math.Between(leftBound + enemy.width/*/2*/, lastEnemy.x - lastEnemy.width/2 - this.minXDist - enemy.width/2);
        } else if (side == 'right') {
            newX = Phaser.Math.Between(lastEnemy.x + lastEnemy.width/2 + enemy.width/2 + this.minXDist, rightBound - enemy.width/2);
        }

        return newX;
    }

    // -----------#### RAISED HANDS ####----------- //
    addHands() {
        let hands;

        // if handsPool is not empty, move one of its hands to the active group
        if (this.handsPool.getLength()) {   
            hands = this.handsPool.getFirst();
            hands.x = this.newEnemyX(hands);
            hands.y = this.stageBtm;
            hands.active = true;
            hands.visible = true;
            this.handsPool.remove(hands);

        // if handsPool is empty, add new hands to active group
        } else { 
            hands = new Hands(this, 0, this.stageBtm, 'hands').setScale(0.7).setOrigin(0.5, 1); 
            hands.x = this.newEnemyX(hands);
        }

        this.handsGroup.add(hands);
    }

} // end Play scene