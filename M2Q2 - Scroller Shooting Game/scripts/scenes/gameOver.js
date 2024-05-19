//game over screen

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create(data) {
        this.clickMusic = this.sound.add('clickBG', { volume:0.8});
        this.hoverMusic = this.sound.add('hoverBG', { volume:0.8});
        this.add.image(360,360,'overbg');       //white bg

        //delay the music AND game over screen for dramatic effect 
        this.defeatMusic = this.sound.add('defeatBG', { volume: 0.7, loop: true });
        this.time.delayedCall(1600, () => {
         this.defeatMusic.play();
        })
        this.time.delayedCall(2600, () => {
        this.add.image(360, 140, 'gameover');
        let finalScore = data.score;
        let finalTime = data.time;
        this.add.text(360, 300, `Glares dealt with: ${finalScore}`, { 
            fontSize: '40px', 
            fill: '#000000', 
            fontFamily: 'Comic Sans MS' 
        }).setOrigin(0.5);
        
        this.add.text(360, 370, `Seconds endured: ${finalTime}`, { 
            fontSize: '40px', 
            fill: '#000000', 
            fontFamily: 'Comic Sans MS' 
        }).setOrigin(0.5);
        const retry = this.add.image(360, 500, 'retry');
        const stepback = this.add.image(360, 640, 'stepback');

         //launch button event listeners and interactivity (brings you to the actual game)
        retry.setInteractive();
        retry.on('pointerover', () => {
            this.hoverMusic.play();
            retry.setScale(1.1); 
        });
 
        retry.on('pointerout', function () {
            retry.setScale(1); 
         });
 
        retry.setInteractive().on('pointerdown', () => {
            this.clickMusic.play();
            this.defeatMusic.stop();
            this.scene.pause();
            this.scene.start('GameScene');
         });
 
        //about button event listeners and interactivity (brings you to credits)
        stepback.setInteractive();
        stepback.on('pointerover', () => {
            this.hoverMusic.play();
            stepback.setScale(1.1); 
        });
  
        stepback.on('pointerout', function () {
            stepback.setScale(1); 
          });
  
        stepback.setInteractive().on('pointerdown', () => {
            this.defeatMusic.stop();
            this.clickMusic.play();
            this.scene.pause();
            this.scene.start('MainMenuScene');
         });
        })
    }
}