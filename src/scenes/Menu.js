class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        this.add.text(20,20, "Con-Surfing Menu"); 
        this.scene.start("playScene"); 
    }
}