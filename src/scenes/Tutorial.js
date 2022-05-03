class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload() {
        this.load.image('tutorial', './assets/tutorial.png');
        this.load.audio('tutorialSelect', './assets/tutorialSelect.mp3');

    }

    create() {
        
        this.add.image(325, 412.5, 'tutorial');
          
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.launch('playScene');
            this.sound.play('tutorialSelect');
            game.settings = {
                gameTimer: 0
            }
        }

    }
}