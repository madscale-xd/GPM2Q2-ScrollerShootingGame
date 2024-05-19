//main menu scene

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        this.add.image(360, 360, 'bgwall').setAlpha(0.15); 
        this.clickMusic = this.sound.add('clickBG', { volume:0.8});
        this.hoverMusic = this.sound.add('hoverBG', { volume:0.8});
        this.add.image(360, 140, 'title');
        const launch = this.add.image(360, 350, 'launch');
        const about = this.add.image(360, 480, 'about');
        const exit = this.add.image(360, 610, 'exit');

        if (!this.menuMusic || !this.menuMusic.isPlaying) { //prevent bgm from duplicating
            this.menuMusic = this.sound.add('menuBG', { volume: 1.5, loop: true });
            this.menuMusic.play();
        }

        //launch button event listeners and interactivity (brings you to the actual game)
        launch.setInteractive();
        launch.on('pointerover', () => {
            this.hoverMusic.play();
            launch.setScale(1.1); 
        });

        launch.on('pointerout', function () {
            launch.setScale(1); 
        });

        launch.setInteractive().on('pointerdown', () => {
            this.menuMusic.stop();
            this.scene.pause();
            this.clickMusic.play();
            this.scene.start('GameScene');
        });

        //about button event listeners and interactivity (brings you to credits)
         about.setInteractive();
         about.on('pointerover', () => {
            this.hoverMusic.play();
            about.setScale(1.1); 
        });
 
         about.on('pointerout', function () {
            about.setScale(1); 
         });
 
        about.setInteractive().on('pointerdown', () => {
            this.scene.pause();
            this.clickMusic.play();
            this.scene.start('CredScene');
        });

        //exit button event listeners and interactivity (prompts an alert)
          exit.setInteractive();
          exit.on('pointerover', () => {
            this.hoverMusic.play();
            exit.setScale(1.1); 
        });

        exit.on('pointerout', function () {
            exit.setScale(1); 
        });

        exit.setInteractive().on('pointerdown', () => {
            this.clickMusic.play();
            alert('COWARD.');
        });
    }
}