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
        
        this.load.spritesheet('oof', './assets/oofAnim.png', {frameWidth: 146, frameHeight: 183, startFrame: 0, endFrame: 1});
        this.load.spritesheet('pLeft', './assets/leftAnim.png', {frameWidth: 188, frameHeight: 192, startFrame: 0, endFrame: 1});
        this.load.spritesheet('pRight', './assets/rightAnim.png', {frameWidth: 190.5, frameHeight: 192, startFrame: 0, endFrame: 1});
        this.load.spritesheet('pUp', './assets/upAnim.png', {frameWidth: 146, frameHeight: 183, startFrame: 0, endFrame: 1});
        
    }

    create() {
       
        
        // place crowd background 
        
        this.crowd = this.add.tileSprite(0, 0, 650, 825, 'crowd').setOrigin(0, 0);

        // place stage
        this.stageBtm = 200;
        this.stage = this.add.image(0, 0, 'stage').setOrigin(0, 1).setDepth(1);
        //this.stage.alpha = 0;


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
            frameRate: 5,
        });

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // add raccoon WITH PHYSICS
        this.player = new Player(this, game.config.width/2, game.config.height - 300 /*change to variable later*/, 'player', 0, keyLEFT, keyRIGHT, keyUP, keyDOWN).setScale(0.6).setOrigin(0.5, 0);

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

        //this.timeCounter = this.game.settings.gameTimer;
        //this.timer = this.add.text(borderUISize + borderPadding + 525, borderUISize + borderPadding*2, this.timeCounter,scoreConfig);
        //this.timeRemain = this.game.settings.gameTimer;


        this.add.rectangle(0,0, game.config.width, borderUISize, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(0,0, borderUISize,game.config.height, 0x2F3079).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x2F3079).setOrigin(0,0);
        
        

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
        
        
        if(!this.gameOver) {         // upd8 ONLY if game not over + one player
            this.player.update();     // player mvt
            this.stage.y = this.stageBtm;

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



            // game end condition -> player too long off screen
            if(this.player.y >= game.config.height) {
          
         //This is where I tried to implement the timer but it didn't work :( 
                //this.timeRemain -= delta;
                //this.timeCounter = time; 
                //this.timeCounter = Math.floor(this.timeRemain/1000) + 1; 
                //this.timer.text = this.timeCounter; 
                
                this.gameOver = true;
                this.add.image(0, 0, 'end').setOrigin(0, 0).setDepth(100);
            
            }
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
        console.log("new enemy X: " + enemy.x);

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