class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        this.load.image('titlescreen', './assets/Consurf Main Menu.png');
        this.load.image('crowd', './assets/crowd.png');
        this.load.image('stage', './assets/stage.png');
        this.load.image('player', './assets/player.png');
        this.load.image('end', './assets/end.png');
        this.load.image('tall', './assets/tall.png');
        this.load.image('hands', './assets/hands.png');
        this.load.image('glow', './assets/glow.png');
        this.load.audio('taco_bell_of_death', './assets/taco_bell.mp3');
        this.load.audio('restart', './assets/revive.mp3');
        this.load.audio('menu', './assets/endToMenu.mp3');
        this.load.audio('theme', './assets/consurf.mp3');
        this.load.audio('ouch_1', './assets/hit_01.mp3');
        this.load.audio('ouch_2', './assets/hit_02.mp3');
        this.load.audio('surf_1', './assets/surf.mp3');
        this.load.audio('surf_2', './assets/surf_B).mp3');
        this.load.audio('menuSelect', './assets/menuSelect.mp3');
        this.load.audio('menuSound', './assets/line.mp3');
        
        this.load.atlas('consurf_atlas', './assets/consurf_sheet.png', './assets/consurf_anims.json');

    }

    create() {
        
        this.menu = this.add.sprite(325, 412.5, 'titlescreen');
        
        // waitin in line :/
        this.line = this.sound.add('menuSound', {
            mute: false,
            volume: 0.75,
            rate: 1,
            loop: true,
        });
        this.line.play();

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
            frameRate: 6,
            repeat: -1,
            yoyo: true,
        });
    }

    update() {
        
        this.menu.play('menuAnim', true);
        
        if (Phaser.Input.Keyboard.JustDown(keyF)){
            this.line.stop();
            this.sound.play('menuSelect');
            this.scene.start('tutorialScene');
        }

    }
    
}