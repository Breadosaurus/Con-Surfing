class Hands extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add to existing scene
        scene.add.existing(this);   
        scene.physics.add.existing(this);   
        this.setSize(this.width*0.7, this.height*0.7, this.width/2, this.height/2);      
    }

    update() {
        // scroll down along with the crowd
        this.y += scrollSpeed;

        this.anims.play('raised', true);
    }
}