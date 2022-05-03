class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('crowd', './assets/crowd.png');
        this.load.image('stage', './assets/stage.png');
        this.load.image('player', './assets/player.png');
        this.load.image('end', './assets/end.png');
        this.load.image('tall', './assets/tall.png');
        this.load.audio('taco_bell_of_death', './assets/taco_bell.mp3');
        this.load.audio('restart', './assets/revive.mp3');
        this.load.audio('menu', './assets/endToMenu.mp3');
        this.load.audio('theme', './assets/consurf.mp3');
        
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

        this.camera = this.cameras.main.setBounds(0, -this.stageBtm, game.config.width, game.config.height + this.stage.height);

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
        this.player = new Player(this, game.config.width/2, game.config.height - this.raccoonStart, 'player', 0, keyLEFT, keyRIGHT, keyUP, keyDOWN).setScale(0.6).setOrigin(0.5, 0);

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
            frameRate: 3,
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
        });this.anims.create({         // blue anim
            key: 'blue',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'gloBlu_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });this.anims.create({         // purple anim
            key: 'purple',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'gloPurp_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });this.anims.create({         // orange anim
            key: 'orange',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'gloOrang_',
                start: 1,
                end: 2,
                zeroPad: 4
            }),
            frameRate: 3,
            repeat: -1,
        });

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

        // add collisions between player and all enemies
        this.physics.add.collider(this.player, this.enemyGroup, ()=>this.player.bump());

        // set min & max horizontal distance between two enemies
        this.minXDist = this.player.width * 2;
        
        // add enemy
        this.addEnemy();
        
        // GAME OVER flag
        this.gameOver = false;

        this.timeCounter = this.game.settings.gameTimer;
        this.timer = this.add.text(borderUISize + borderPadding + 525, borderUISize + borderPadding*2, this.timeCounter);
        this.timeRemain = this.game.settings.gameTimer;


        // this.add.rectangle(0,0, game.config.width, borderUISize, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(0,0, borderUISize,game.config.height, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x2F3079).setOrigin(0,0);
        
        

    }

    
    update(time, delta) {  
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.concert.stop();
            this.scene.restart();
        }
        // check for menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyM)) {
            this.concert.stop();
            this.scene.start('menuScene');
        }
        
        // music!! concert!! banger!!
        // if(!this.gameOver && !this.music.isPlaying) {
            
         
        
        if(!this.gameOver) {         // upd8 ONLY if game not over 
            this.player.update();     // player mvt
            
            // bottom of the stage before gradient starts
            this.stageBtm = this.stage.y - this.gradient;

            // percentage of crowd raccoon has travelled 
            this.playerProgress = (game.config.height - this.player.y) / (game.config.height - (this.stage.y + 100));

            // scroll camera according to playerProgress
            this.camera.scrollY = this.playerProgress * -(this.stage.height - this.gradient);

            // recycling tall ppl >:3
            this.enemyGroup.getChildren().forEach(function(enemy) { 
                if (enemy.active && enemy.y >= game.config.height + enemy.height) {
                    this.enemyGroup.killAndHide(enemy);
                    this.enemyGroup.remove(enemy);
                }
                enemy.update();
            }, this);

            // adding tall ppl
            this.enemyDistY = this.getLastEnemy().y - this.stageBtm;
            if (this.enemyDistY > this.nextEnemyDistY) {
                this.addEnemy();
            }

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
                this.concert.setVolume(0.25);
                this.sound.play('taco_bell_of_death');
                this.end = this.add.sprite(0, 0, 'end').setOrigin(0, 0).setDepth(2);
                this.end.anims.play('endAnim', true);
            }

            //this.physics.world.wrap(this.player, 0);
        }

    }// end update()

    addEnemy() {
        // change later so there's a 50/50 chance of the enemy being a tall person or a glowstick

        let enemy;

        // add tall person
        
        // if enemyPool is not empty, move one of its enemies to the active group
        if (this.enemyPool.getLength()) {   
            let newX = this.newEnemyX(); 
            enemy = this.enemyPool.getFirst();
            enemy.x = newX;
            this.enemyPool.remove(enemy);
        // if enemyPool is empty, add a new enemy to the active group
        } else { 
            let newX = 0;
            if (this.getLastEnemy()) {
                newX = this.newEnemyX();
                enemy = new Tall(this, 0, this.stageBtm, 'tall').setScale(0.7).setOrigin(0.5, 1);
            } else {
                enemy = new Tall(this, 0, this.stageBtm, 'tall').setScale(0.7).setOrigin(0.5, 1);
                newX = Phaser.Math.Between(leftBound + enemy.width/2, rightBound - enemy.width/2);
            }
            enemy.x = newX;
            this.enemyGroup.add(enemy);
        }

        // add glowstick
        // - code here -

        // set next enemy distances
        this.setNextEnemyDistY();
    }

    getLastEnemy() {
        return this.enemyGroup.getChildren()[this.enemyGroup.getChildren().length - 1];
    }

    // set vertical distance between current and next enemy
    setNextEnemyDistY() {
        this.nextEnemyDistY = Phaser.Math.Between(this.getLastEnemy().height * 1.25, this.player.height * 2);
    }

    newEnemyX() {

        return Phaser.Math.Between(leftBound + this.getLastEnemy().width/2, rightBound - this.getLastEnemy().width/2);
        /*
        let lastEnemy = this.getLastEnemy();
        let newX = lastEnemy.x;
        let distance = Phaser.Math.Between(this.minXDist, rightBound - leftBound);
        if (Math.random() < 0.5) {
            distance = -distance;
        }
        newX = lastEnemy.x + distance;
        
        if (newX < leftBound + lastEnemy.width/2) {
                newX = leftBound + lastEnemy.width/2;
            }

        return newX;
        */
    }
    

} // end Play scene