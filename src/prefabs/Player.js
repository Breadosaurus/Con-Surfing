// player prefab
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, leftKey, rightKey, upKey, downKey) {
        super(scene, x, y, texture, frame);

        // add sprite to scene 
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(1, 1);

        // set keys
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.upKey = upKey;
        this.downKey = downKey;


        this.isHit = false;
        this.moveSpeed = 300;

    } // end constructor

    update() {
        // // left/right/up/down mvt
        if(!this.isHit) {

            if (this.rightKey.isDown) {
                this.setVelocityX(this.moveSpeed);
                this.setFlip(true, false);
                this.anims.play('turn', true);
            } else if (this.leftKey.isDown) {
                this.setVelocityX(-this.moveSpeed);
                this.resetFlip();
                this.anims.play('turn', true);
            } else {
                this.setVelocityX(0);
            }

            if (this.upKey.isDown) {
                this.setVelocityY(-this.moveSpeed);
                this.anims.play('up', true);
            } else if (this.downKey.isDown) {
                this.setVelocityY(this.moveSpeed);
            } else {
                this.setVelocityY(0);
            }
        }

        this.y += scrollSpeed;
    } // end update()

    bump() {
        this.isHit = true;
        this.anims.play('oof', true);                 // play hit anim
        this.on('animationcomplete', () => {
            this.setVelocity(0, 0)
        });
        this.paralyze = this.scene.time.delayedCall(700, () => {
            this.isHit = false;
        }, this);
        
    } 
} // end Player prefab