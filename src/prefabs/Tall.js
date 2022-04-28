class Tall extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add to existing scene
        scene.add.existing(this);                
        scene.physics.add.existing(this);

        // set immovable so player can't push enemies around
        this.setImmovable(true);

        // set velocity to 0
        this.setVelocity(0, 0);
    }

    update() {
        // scroll down along with the crowd
        this.y += scrollSpeed;
    }
}