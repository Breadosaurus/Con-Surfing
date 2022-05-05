class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // set type (glowstick or tall person)
        this.setType();

        // add to existing scene
        scene.add.existing(this);                
        scene.physics.add.existing(this);
        this.updateSize();

        // set immovable so player can't push enemies around
        this.setImmovable(true);

        // set velocity to 0
        this.setVelocity(0, 0);
    }

    update() {
        // scroll down along with the crowd
        this.y += scrollSpeed;
        if (this.type == 'glow') {
            this.anims.play(this.color, true);    
        }
    }

    setType() {
        if (Math.random() < 0.5) {
            this.type = 'tall';
            this.setScale(0.5);
            this.setTexture('tall');
            this.stop();
        } else {
            this.type = 'glow';
            this.setScale(0.7);
            this.setTexture('glow');
            switch (Phaser.Math.Between(1, 3)) {
                case 1: this.color = 'green';
                break;
                case 2: this.color = 'blue';
                break;
                case 3: this.color = 'purple';
                break;
            }
        }
    }

    updateSize() {
        this.setSize(this.width*0.7, this.height*0.7, this.width/2, this.height/2);
    }
}