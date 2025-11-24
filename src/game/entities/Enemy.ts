import Phaser from 'phaser';

const ENEMY_SPEED = 80;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private direction: 1 | -1 = -1;
    private patrolMinX: number;
    private patrolMaxX: number;

    constructor(scene: Phaser.Scene, x: number, y: number, patrolWidth = 220) {
        super(scene, x, y, 'enemy');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDepth(1);

        const halfWidth = patrolWidth / 2;
        this.patrolMinX = x - halfWidth;
        this.patrolMaxX = x + halfWidth;
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
    }

    update(): void {
        if (!this.active) {
            return;
        }

        const body = this.body as Phaser.Physics.Arcade.Body;

        if (body.blocked.left || this.x <= this.patrolMinX) {
            this.direction = 1;
        } else if (body.blocked.right || this.x >= this.patrolMaxX) {
            this.direction = -1;
        }

        body.setVelocityX(ENEMY_SPEED * this.direction);
        this.setFlipX(this.direction < 0);
    }

    defeat(): void {
        this.disableBody(true, true);
    }

    respawn(x: number, y: number): void {
        this.direction = -1;
        this.enableBody(true, x, y, true, true);
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocityX(ENEMY_SPEED * this.direction);
    }
}
