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

        // GAME OVER flag
        this.gameOver = false;

    }

    
    update() {  
        if(!this.gameOver) {         // upd8 ONLY if game not over + one player
            this.player.update();     // player mvt

            // recycling tall ppl >:3
            this.enemyGroup.getChildren().forEach(function(enemy) { 
                if (enemy.y >= game.config.height + enemy.height) {
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
    }

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
        this.nextEnemyDistance = Phaser.Math.Between(this.player.height * 0.5, this.player.height * 2);
    }


} // end Play scene