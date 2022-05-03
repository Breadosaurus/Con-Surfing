class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        this.load.image('titlescreen', './assets/Consurf Main Menu.png');
        this.load.atlas('consurf_atlas', './assets/consurf_sheet.png', './assets/consurf_anims.json');
        this.load.audio('menuSelect', './assets/menuSelect.mp3');
    }

    create() {
        
        this.menu = this.add.sprite(325, 412.5, 'titlescreen');
          
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.anims.create({         // menu anim
            key: 'menuAnim',
            frames: this.anims.generateFrameNames('consurf_atlas', {
                prefix: 'menu_',
                start: 1,
                end: 4,
                zeroPad: 4
            }),
            frameRate: 5,
            repeat: -1,
            // yoyo: true,
        });
    }

    update() {
        
        this.menu.play('menuAnim', true);
        
        if (Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.launch('tutorialScene');
            this.sound.play('menuSelect');
            // game.settings = {
            //     gameTimer: 0
            // }
        }


    }
}