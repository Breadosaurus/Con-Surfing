// player prefab
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, leftKey, rightKey, upKey, downKey) {
        super(scene, x, y, texture, frame);

        //add obj to existing scene
        scene.add.existing(this);
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.upKey = upKey;
        this.downKey = downKey;
        this.isHit = false;
        this.moveSpeed = 4;

    } // end constructor

    update() {
        // // left/right/up/down? mvt
        if(!this.isHit) {
            if(this.leftKey.isDown && this.x >= borderUISize + this.width/2) {
                this.x -= this.moveSpeed;
                // this.anims.play(pLeft);
            } else if (this.rightKey.isDown && this.x <= game.config.width - borderUISize - this.width/2) {
                this.x += this.moveSpeed;
                // this.anims.play(pRight);
            } else if (this.upKey.isDown && this.y >= borderUISize * 5 + borderPadding) {
                this.y -= this.moveSpeed;
                // this.anims.play(pUp);
            } 
            else if (this.downKey.isDown && this.y >= borderUISize * 5 + borderPadding) {
                this.y += this.moveSpeed;
                // this.anims.play(pMove);
            }
        }

        // fire button
        // if(Phaser.Input.Keyboard.JustDown(this.upKey) && !this.isHit) {
        //     this.isHit = true;
        // }
        
        // // if fired, move up
        // if(this.isHit && this.y >= borderUISize * 3 + borderPadding) {
        //     this.y -= this.moveSpeed;
        // }

        // // reset on miss
        // if(this.y <= borderUISize * 3 + borderPadding) {
        //     this.reset();
        // }
    } // end update()

    reset() {
        this.isHit = false;
        // this.y = game.config.height - borderUISize - borderPadding;
    } // end reset()

} // end Player prefab