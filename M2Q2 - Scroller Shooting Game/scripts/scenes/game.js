export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.seconds = 0;
        this.aliveTime = 0;
        this.aliveTimeText;
        this.player;
        this.playerVelocity = 160;

        this.lastFired = 0; // Track the last firing time
        this.fireRate = 800; // Firing interval in milliseconds
        this.gameHeight = 0;
        this.leftBound = 50;
        this.rightBound = 670;
        this.topBound = 10;
        this.eyeFall = 200;
        this.spawnInterval = 2000; 
        this.leftRightCounter = 0;         //after 6 hits, count down, 7 = defeat
        this.topCounter = 0;               //7 hits = defeat
        this.eyeScale = 1.5;
        this.dashSpeed = 600; // Speed of the dash
        this.dashTime = 300; // Duration of the dash in milliseconds
        this.isDashing = false;
        this.dashCooldown = 5000; // Cooldown for dash in milliseconds
        this.lastDash = 0;
        this.scrollSpeed=1;
    }

    create() {
        this.score = 0;
        this.aliveTime = 0;
        this.player;

        //reset stats
        this.playerVelocity = 160;
        this.lastFired = 0;
        this.gameHeight = 0;
        this.leftBound = 50;
        this.rightBound = 670;
        this.topBound = 10;
        this.eyeFall = 200;
        this.spawnInterval = 2000; 
        this.leftRightCounter = 0;        
        this.topCounter = 0;               
        this.eyeScale = 1.5;
        this.lastDash = 0;
        this.scrollSpeed=1;

        //scroller bg
        this.background1 = this.add.image(0, 0, 'movingBG').setOrigin(0, 0).setAlpha(0.2);
        this.background2 = this.add.image(0, -this.scale.height, 'movingBG').setOrigin(0, 0).setAlpha(0.2);

        //instructions, score, and time
        this.add.image(360, 240, 'shoot').setScale(0.75).setAlpha(0.25); 
        this.flee = this.add.image(360, 400, 'flee').setScale(0.75).setAlpha(0); 
        this.resetFlee();
        this.add.image(120, 540, 'left').setScale(0.75).setAlpha(0.25); 
        this.add.image(600, 540, 'right').setScale(0.75).setAlpha(0.25); 
        this.scoreText = this.add.text(230, 525, '0', { 
            fontSize: '60px', 
            fill: '#ffffff', 
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive' 
        }).setAlpha(0.25);
        this.add.text(337, 530, 'in', { 
            fontSize: '50px', 
            fill: '#ffffff', 
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive'
        }).setAlpha(0.25);
        this.time.addEvent({
            delay: 1000,                
            callback: this.updateAliveTime,
            callbackScope: this,
            loop: true
        });
        this.aliveTimeText = this.add.text(440, 525, '0', { 
            fontSize: '60px', 
            fill: '#ffffff', 
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive' 

        }).setAlpha(0.25);
        //music setup
        this.playMusic = this.sound.add('playBG', { volume: 0.7, loop: true });
        this.playMusic.play();
        this.hitMusic = this.sound.add('hitBG', {volume: 0.7});
        this.cdMusic = this.sound.add('countdownBG', {volume: 0.9});
        this.projectileMusic = this.sound.add('projectileBG', {volume: 0.5});
        this.laughMusic = this.sound.add('laughBG', {volume: 0.5});
        this.dashMusic = this.sound.add('dashBG', {volume: 0.5});
        this.heartFast = this.sound.add('heartFASTBG', {volume: 1.2, loop:true});
        this.heartFaster = this.sound.add('heartFASTERBG', {volume: 1.5, loop:true});
        // Player
        this.player = this.physics.add.sprite(360, 690, 'cagey').setScale(1.8);
        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Projectile group
        this.projectiles = this.physics.add.group({
            defaultKey: 'projectile',
            maxSize: 50, // Increase the limit
        });

        // Falling objects group
        this.eyes = this.physics.add.group({
            defaultKey: 'eye',
            maxSize: 50, 
        });

        //Walls
        this.walls = this.physics.add.group();
        this.leftWall = this.walls.create(-180, 360, 'leftWall').setImmovable(true);
        this.rightWall = this.walls.create(900, 360, 'rightWall').setImmovable(true);
        this.topWall = this.walls.create(360, -360, 'topWall').setImmovable(true);
        this.walls.children.iterate(function(wall) {
            wall.body.allowGravity = false;
        });

        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('cagey', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'cagey', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cagey', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //eye spawning
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnEye,
            callbackScope: this,
            loop: true
        });

        this.physics.add.collider(this.player, this.walls);

        //faster, faster!
        this.increaseEverythingTimer = this.time.addEvent({
            delay: 1000, 
            callback: this.increaseEverything,
            callbackScope: this,
            loop: true 
        });
    }

    update(time) {
        //scroller bg
        this.background1.y += this.scrollSpeed;
        this.background2.y += this.scrollSpeed;

        // Reset the positions to create a seamless loop
        if (this.background1.y >= this.scale.height) {
            this.background1.y = this.background2.y - this.scale.height;
        }

        if (this.background2.y >= this.scale.height) {
            this.background2.y = this.background1.y - this.scale.height;
        }

        // Player movement, dashing, and shooting
        if (this.shiftKey.isDown && time > this.lastDash && !this.isDashing) {
            // Start the dash
            this.dashMusic.play();
            this.lastDash = time + this.dashCooldown; // Update the last dash time
            this.isDashing = true;
            this.dashStartTime = time;
            this.flee.setAlpha(0);
    
            // Determine the dash direction
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-this.dashSpeed);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(this.dashSpeed);
                this.player.anims.play('right', true);
            }
        }
    
        // Reset dash after duration
        if (this.isDashing && time > this.dashStartTime + this.dashTime) {
            this.isDashing = false;
            this.player.setVelocityX(0);
            if (this.resetFleeTimer) {
                this.resetFleeTimer.remove();
            }
            this.resetFleeTimer = this.time.delayedCall(4900, this.resetFlee, [], this);
        }
        
        // Regular movement
        if (!this.isDashing) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-this.playerVelocity);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(this.playerVelocity);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }
        }

        if (this.spaceBar.isDown && time > this.lastFired) {
            this.lastFired = time + this.fireRate; // Update the last fired time
            this.fireProjectile();
        }

        // Deactivate projectiles that go out of bounds
        this.projectiles.children.each(function (projectile) {
            if (projectile.active && projectile.y < 0) {
                projectile.destroy();
            }
        }, this);

        // Deactivate eyes objects that go out of bounds, reset eye stats and player speed, top wall closes in
        this.eyes.children.each(function (eye) {
            if (eye.active && eye.y > this.cameras.main.height) {
                eye.destroy();
                this.resetFlee();
                this.topWall.y += 90;
                this.topBound += 90;
                this.gameHeight += 90;
                this.eyeScale = 1.5;
                this.eyeFall = 200;
                this.spawnInterval = 2000; 
                this.playerVelocity = 160;
                this.hitMusic.play();
                this.topCounter += 1;
            }
            if(this.topCounter == 8){       //game over after 8 eyes have passed thru
                this.playMusic.pause();
                this.cdMusic.pause();  
                this.heartFast.pause();
                this.heartFaster.pause();
                this.scene.pause();
                this.scene.start('GameOverScene', {score: this.score, time: this.aliveTime});
            }
        }, this);

        //manage projectile behavior and interaction
        this.projectiles.children.each(function (projectile) {  
            if(projectile.y <= this.topBound){
                projectile.destroy();
            }
        }, this);
        this.physics.add.overlap(this.projectiles, this.eyes, this.handleProjCollision, null, this);
        this.physics.add.overlap(this.player, this.eyes, this.handlePlayerCollision, null, this);
    }

    fireProjectile() {      //shooting mechanism
        const projectile = this.projectiles.get(this.player.x, this.player.y - 20);
        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setVelocityY(-300);
            projectile.body.allowGravity = false;
            this.projectileMusic.play();
        }
    }

    spawnEye() {        //eye-spawing mechanism
        const x = Phaser.Math.Between(this.leftBound, this.rightBound);
        const eye = this.eyes.get(x, this.gameHeight+20);

        if (eye) {
            eye.setActive(true);
            eye.setVisible(true);
            eye.setVelocityY(this.eyeFall);
            eye.setScale(this.eyeScale);
            eye.body.allowGravity = false;
        }
    }

    handleProjCollision(projectile, eye) {      //destroy eye
        projectile.destroy();
        eye.destroy();
        this.score += 1;
        this.scoreText.setText(this.score);
        this.laughMusic.play();
    }

    // Deactivate eyes hitting player, reset eye stats and player speed, left and right walls close in
    handlePlayerCollision(player, eye) {
        eye.destroy();
        this.resetFlee();
        this.leftWall.x += 45;
        this.rightWall.x -= 45;
        this.leftBound += 45;
        this.rightBound -= 45;
        this.leftRightCounter += 1;
        this.eyeScale = 1.5;
        this.eyeFall = 200;
        this.spawnInterval = 2000; 
        this.playerVelocity = 160;
        this.hitMusic.play();
        if(this.leftRightCounter == 7){            
            this.cdMusic.play();
            this.time.delayedCall(10700, this.certainDeath, [], this);
        }
        if(this.leftRightCounter == 8){
            this.playMusic.pause();
            this.cdMusic.pause();
            this.scene.pause();
            this.heartFast.pause();
            this.heartFaster.pause();
            this.scene.start('GameOverScene', {score: this.score, time: this.aliveTime});
        }
    }

    //intensifying difficulty, resets everytime an eye passes/hits the player
    increaseEverything() {
        if(this.playerVelocity <= 180){
            this.scrollSpeed = 1.25;
            this.heartFast.pause();
            this.heartFaster.pause();
            this.eyeFall += 5;
            this.spawnInterval -= 100;
            this.eyeScale -= 0.0125;
        }else if(this.playerVelocity > 180 && this.playerVelocity < 220){
            this.scrollSpeed = 2.5;
            this.heartFast.play();
            this.eyeFall += 10;
            this.spawnInterval -= 200;
            this.eyeScale -= 0.025;
        }
        else if(this.playerVelocity >= 220){
            this.scrollSpeed = 5;
            this.heartFast.pause();
            this.heartFaster.play();
            this.eyeFall += 30;
            this.spawnInterval -= 300;
            this.eyeScale -= 0.05;
        }
        this.playerVelocity += 4;
    }

    //countdown to game over after 6 hits (prevents forever playing/gaining points)
    certainDeath(){            
        this.hitMusic.play();
        this.playMusic.pause();
        this.cdMusic.pause();
        this.heartFast.pause();
        this.heartFaster.pause();
        this.scene.pause();
        this.scene.start('GameOverScene', {score: this.score, time: this.aliveTime});
    }

    //manages the number of seconds the player is surviving
    updateAliveTime() {
        this.aliveTime += 1;
        this.aliveTimeText.setText(this.aliveTime);
    }

    //manages the resetting of the dash control hint
    resetFlee(){   
        if (this.resetFleeTimer) {
            this.resetFleeTimer.remove();
            this.resetFleeTimer = null; 
        }
        this.flee.setAlpha(0.25);
        this.lastDash = 0;
    }
}