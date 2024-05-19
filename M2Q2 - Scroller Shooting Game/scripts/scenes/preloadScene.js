//preload scene

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(){
        //overall
        this.load.audio('clickBG','assets/audio/clickBG.mp3');
        this.load.audio('hoverBG','assets/audio/hoverBG.mp3');
        //menu scene
        this.load.image('title','./assets/images/buttons/title.png');
        this.load.image('launch','./assets/images/buttons/launch.png');
        this.load.image('about','./assets/images/buttons/about.png');
        this.load.image('exit','./assets/images/buttons/exit.png');
        this.load.audio('menuBG','assets/audio/menuBG.mp3');
        //credits scene
        this.load.image('credits','./assets/images/buttons/credits.png');
        this.load.image('stepbackwhite','./assets/images/buttons/stepbackwhite.png');
        //game scene
        this.load.image('bgwall','./assets/images/bgwall.png');
        this.load.image('projectile', './assets/images/projectile.png');
        this.load.image('eye', './assets/images/eye.png'); 
        this.load.image('leftWall','./assets/images/leftWall.png');
        this.load.image('rightWall','./assets/images/rightWall.png');
        this.load.image('topWall','./assets/images/topWall.png');
        this.load.image('shoot','./assets/images/shoot.png');
        this.load.image('left','./assets/images/left.png');
        this.load.image('right','./assets/images/right.png');
        this.load.image('flee','./assets/images/flee.png');
        this.load.image('movingBG','./assets/images/movingBG.png');
        this.load.audio('playBG','./assets/audio/playBG.mp3');
        this.load.audio('hitBG','./assets/audio/hitBG.mp3');
        this.load.audio('countdownBG','./assets/audio/countdownBG.mp3');
        this.load.audio('projectileBG','./assets/audio/projectileBG.mp3');
        this.load.audio('laughBG','./assets/audio/laughBG.mp3');
        this.load.audio('heartFASTBG','./assets/audio/heartbeatFAST.mp3');
        this.load.audio('heartFASTERBG','./assets/audio/heartbeatFASTER.mp3');
        this.load.audio('dashBG','./assets/audio/dashBG.mp3');
        //game scene-player
        this.load.spritesheet('cagey',
            './assets/images/cagey.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        //game over scene
        this.load.image('overbg', './assets/images/overbg.png');
        this.load.image('gameover', './assets/images/buttons/gameover.png');
        this.load.image('retry','./assets/images/buttons/retry.png');
        this.load.image('stepback','./assets/images/buttons/stepback.png');
        this.load.audio('defeatBG','./assets/audio/defeatBG.mp3');
    }

    create() {      //loading screen, transitions to Main Menu after the preloading
        this.loadingText = this.add.text(360, 360, 'C r e a t i n g   f e a r . . .', { 
            fontSize: '52px', 
            fill: '#ffffff', 
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive'
        }).setOrigin(0.5).setAlpha(0.25);

        this.time.delayedCall(2500, () => {
            this.loadingText.setAlpha(0);
        }, [], this);

        this.time.delayedCall(3000, () => {
            this.loadingText.destroy();
            this.scene.start('MainMenuScene');
        }, [], this);
    }
}