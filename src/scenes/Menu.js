class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('titlescreen', './assets/Consurf Main Menu.png');;

        
    }

    create() {
        
        this.background = this.add.image(325, 412.5, 'titlescreen');
          
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.launch('playScene');
            game.settings = {
                gameTimer: 0
            }
        }

    }
}