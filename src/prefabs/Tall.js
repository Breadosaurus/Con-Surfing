class Tall extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.x = this.randomX();
        scene.add.existing(this);                       // add to existing scene
    }

    update() {
        // move tall ppl down
        if (this.active) {
            this.y += scrollSpeed;
        }
    }

    // returns random horizontal location
    randomX() {
        let position = 0;
        // generate random position until sprite fits on screen
        while (position < this.width/2 || position > game.config.width - this.width/2) {
            position = Math.random() * game.config.width;
        }
        return position;
    }
}