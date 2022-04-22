// player prefab
class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, leftKey, rightKey, upKey) {
        super(scene, x, y, texture, frame);

        //add obj to existing scene
        scene.add.existing(this);
        this.leftKey = leftKey;
        this.rightKey = rightKey;
        this.upKey = upKey;
        this.isHit = false;
        this.moveSpeed = 20;

    } // end constructor

    update() {
        // // left/right mvt
        // if(this.leftKey.isDown && this.x >= borderUISize + this.width) {
        //     this.x -= this.moveSpeed;
        // } else if (this.rightKey.isDown && this.x <= game.config.width - borderUISize - this.width) {
        //     this.x += this.moveSpeed;
        // }
        if(!this.isHit) {
            if(this.leftKey.isDown && this.x >= borderUISize + this.width/2) {
                this.x -= this.moveSpeed;
            } else if (this.rightKey.isDown && this.x <= game.config.width - borderUISize - this.width/2) {
                this.x += this.moveSpeed;
            }
        }

        // fire button
        if(Phaser.Input.Keyboard.JustDown(this.upKey) && !this.isHit) {
            this.isHit = true;
        }
        
        // if fired, move up
        if(this.isHit && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    } // end update()

    reset() {
        this.isHit = false;
        this.y = game.config.height - borderUISize - borderPadding;
    } // end reset()

} // end Player prefab