/* 
Game: ConSURF!
Created by: Cecil Choi, eden hou, Joann Marie Wong
With help from: Juan Alvarado (juralvar@ucsc.edu), Rachel Trieu (rtrieu@ucsc.edu), abarciab@ucsc.edu, Nathan Altice (Paddle Parkour 3, Rocket Patrol), Phaser documentation (https://photonstorm.github.io/phaser3-docs/Phaser.html)
Date Completed: Wednesday, May 4, 2022

Creative Tilt: 
Technical Interest: Camera movement that tracks the player's progress ties the concert stage and score counter together. Score only increases when the stage is fully on screen, so it truly counts how long you've been up close with the band! 
Visual Style: All art ties together very well and follows a coherent art direction, considering multiple team members worked on major final assets. Music and sound effects also fit very well, all made completely by team members :) Overall theme isn't common to the endless runner, as the player has an extra goal of staying at a certain position so that they can watch the concert fully for a higher score.
*/

let config = {
    type: Phaser.AUTO,
    width: 650,
    height: 825,
    physics: {
        default: 'arcade',
        arcade: { fps: 60 }
    },
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, Tutorial, Play]
}
let game = new Phaser.Game(config); 

// reserve keyboard vars
let keyF, keyR, keyM, keyLEFT, keyRIGHT, keyUP, keyDOWN;

let borderUISize = game.config.height / 30; 
let borderPadding = borderUISize / 3; 

// set scroll speed
let scrollSpeed = 2.7; //1.6

let leftBound = game.config.height/30;
let rightBound = game.config.width - leftBound;

