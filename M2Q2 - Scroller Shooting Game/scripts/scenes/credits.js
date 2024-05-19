//credits portion (about)

export default class CredScene extends Phaser.Scene {
    constructor() {
        super('CredScene');
    }
    create() {
        this.add.image(360, 360, 'bgwall').setAlpha(0.15); 
        this.clickMusic = this.sound.add('clickBG', { volume:0.8});
        this.hoverMusic = this.sound.add('hoverBG', { volume:0.8});
        // Credits text (developer <fear-maker> information)
        this.add.image(360, 180, 'credits');
        this.add.text(360, 340, 'Fear-Maker\'s Full Name: Justin Kyle A. De Castro', { 
            fontSize: '20px', 
            fill: '#ffffff', 
            fontFamily: 'Comic Sans MS' 
        }).setOrigin(0.5);
        this.add.text(360, 400, 'Fear-Maker\'s Section: EMC131P - A223', { 
            fontSize: '20px', 
            fill: '#ffffff', 
            fontFamily: 'Comic Sans MS' 
        }).setOrigin(0.5);
        this.add.text(360, 460, 'Fear-Maker\'s Program: EMC', { 
            fontSize: '20px', 
            fill: '#ffffff', 
            fontFamily: 'Comic Sans MS' 
        }).setOrigin(0.5);
        
        // Back button event listeners and interactivity (returns you to the main menu)
        const menu1 = this.add.image(360, 600, 'stepbackwhite');

        menu1.setInteractive(); 
        menu1.on('pointerdown', () => {
            this.clickMusic.play();
            this.scene.pause();
            this.scene.start('MainMenuScene'); 
        });
        menu1.on('pointerover', () => {
            this.hoverMusic.play();
            menu1.setScale(1.1); 
        });
        menu1.on('pointerout', function () {
            menu1.setScale(1); 
        });
    }
}