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

        // randomize function for hit sound
        this.ouch_1 = scene.sound.add('ouch_1');
        this.ouch_2 = scene.sound.add('ouch_2');
        this.isHit = false;

        // regular speed
        this.moveSpeed = 225;

        // speed boost
        this.boostSpeed = 200;
        this.surf_1 = scene.sound.add('surf_1');
        this.surf_2 = scene.sound.add('surf_2');

    } // end constructor

    update() {
        // left/right/up/down mvt
        if(!this.isHit) {
            if (this.rightKey.isDown && this.x < rightBound - this.width/3) {
                this.setVelocityX(this.moveSpeed);
                this.setFlip(true, false);
                this.anims.play('turn', true);
            } else if (this.leftKey.isDown && this.x > leftBound + this.width/3) {
                this.setVelocityX(-this.moveSpeed);
                this.resetFlip();
                this.anims.play('turn', true);
            } else {
                this.setVelocityX(0);
            }

            if (this.upKey.isDown && this.y > this.scene.stage.y) {
                this.setVelocityY(-this.moveSpeed);
                this.anims.play('up', true);
            } else if (this.downKey.isDown) {
                this.setVelocityY(this.moveSpeed);
            } 
            else {
                this.setVelocityY(0);
            }
        }
        if (!this.boost) {
            this.y += scrollSpeed;
        }
        
    } // end update()


    bump() {
        this.isHit = true;
        this.anims.play('oof', true);
        if (Phaser.Math.Between(0, 1) == 0) {
            this.ouch_1.play();
        } else {
            this.ouch_2.play();
        }
        this.on('animationcomplete', () => {
            this.setVelocity(0, 0)
        });
        this.paralyze = this.scene.time.delayedCall(700, () => {
            this.isHit = false;
        }, this);
    } // end bump()
    

    speedBoost() {
        if (!this.cooldown) {
            if (Phaser.Math.Between(0, 1) == 0) {
                this.surf_1.play();
            } else {
                this.surf_2.play();
            }
            this.boost = true;
            this.cooldown = true;
            this.moveSpeed += this.boostSpeed;
            this.scene.time.delayedCall(200, () => {
                this.moveSpeed -= this.boostSpeed;
                this.boost = false;
            }, this);
            // cooldown
            this.scene.time.delayedCall(1000, () => {
                this.cooldown = false;
            }, this);
        } 
    } // end speedBoost()


} // end Player prefab