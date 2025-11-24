import Phaser from 'phaser';

const PLAYER_SPEED = 240;
const JUMP_VELOCITY = -380;
const BOUNCE_VELOCITY = -320;

export class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private invulnerable = false;
    private invulnerabilityTimer?: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setBounce(0.05);
        this.setDepth(1);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(20, 28);
        body.setOffset(6, 4);

        const keyboard = scene.input.keyboard;

        if (!keyboard) {
            throw new Error('Keyboard input is not available');
        }

        this.cursors = keyboard.createCursorKeys();
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
    }

    update(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;

        if (!body) {
            return;
        }

        let velocityX = 0;

        if (this.cursors.left?.isDown) {
            velocityX = -PLAYER_SPEED;
            this.setFlipX(true);
        } else if (this.cursors.right?.isDown) {
            velocityX = PLAYER_SPEED;
            this.setFlipX(false);
        }

        body.setVelocityX(velocityX);

        if (this.cursors.up?.isDown && body.blocked.down) {
            body.setVelocityY(JUMP_VELOCITY);
        }
    }

    bounce(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocityY(BOUNCE_VELOCITY);
    }

    takeDamage(direction: number): boolean {
        if (this.invulnerable) {
            return false;
        }

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(direction * 240, -260);

        this.invulnerable = true;
        this.setTint(0xffd166);

        this.invulnerabilityTimer?.destroy();
        this.invulnerabilityTimer = this.scene.time.addEvent({
            delay: 700,
            callback: this.clearInvulnerability,
            callbackScope: this
        });

        return true;
    }

    isInvulnerable(): boolean {
        return this.invulnerable;
    }

    private clearInvulnerability(): void {
        this.invulnerable = false;
        this.clearTint();
    }
}
