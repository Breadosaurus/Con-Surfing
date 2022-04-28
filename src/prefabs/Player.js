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
        this.moveSpeed = 150;

    } // end constructor

    update() {
        // // left/right/up/down? mvt
        if(!this.isHit) {

            if(this.leftKey.isDown) {
                this.setVelocityX(-this.moveSpeed);
                this.anims.play('pLeft', true);
            } else if (this.rightKey.isDown) {
                this.setVelocityX(this.moveSpeed);
                this.anims.play('pRight', true);
            } else {
                this.setVelocityX(0);
            }

            if (this.upKey.isDown) {
                this.setVelocityY(-this.moveSpeed);
                this.anims.play('pUp', true);
            } else if (this.downKey.isDown) {
                this.setVelocityY(this.moveSpeed);
                //this.anims.play('pMove', true);
            } else {
                this.setVelocityY(0);
                //this.anims.play('pMove', true);
            }
        }

        this.y += scrollSpeed;
    } // end update()

    bump() {
        this.isHit = true;
        this.anims.play('oof', true);                 // play explode anim
        this.on('animationcomplete', () => {    // callback after anim completes
            this.isHit = false;                     
        });
    } 
} // end Player prefab