import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { PlatformFactory } from '../systems/PlatformFactory';

type ColliderObject =
    | Phaser.Types.Physics.Arcade.GameObjectWithBody
    | Phaser.Physics.Arcade.Body
    | Phaser.Physics.Arcade.StaticBody
    | Phaser.Tilemaps.Tile;

export class LevelScene extends Phaser.Scene {
    private player!: Player;
    private enemy!: Enemy;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private scoreText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;
    private questionText!: Phaser.GameObjects.Text;
    private hintText!: Phaser.GameObjects.Text;
    private score = 0;
    private lives = 3;
    private readonly worldWidth = 3200;
    private groundY = 0;

    constructor() {
        super('LevelScene');
    }

    create(): void {
        this.score = 0;
        this.lives = 3;
        this.groundY = this.scale.height - 48;

        this.physics.world.setBounds(0, 0, this.worldWidth, this.scale.height);
        this.physics.world.gravity.y = 900;

        this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background-block')
            .setOrigin(0, 0)
            .setScrollFactor(0);

        this.platforms = PlatformFactory.createPlatforms(this, this.groundY, this.worldWidth);

        this.player = new Player(this, 120, this.groundY - 80);
        this.enemy = new Enemy(this, 520, this.groundY - 80);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemy, this.platforms);
        this.physics.add.collider(this.player, this.enemy, this.handlePlayerEnemyCollision, undefined, this);

        this.cameras.main.setBounds(0, 0, this.worldWidth, this.scale.height);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setLerp(0.12, 0.1);

        this.createUI();
        this.createQuestionBanner();

        this.input.keyboard?.on('keydown-R', () => {
            this.scene.restart();
        });
    }

    update(): void {
        this.player.update();
        this.enemy.update();
    }

    private handlePlayerEnemyCollision(object1: ColliderObject, object2: ColliderObject): void {
        const player = this.extractFromCollider(object1, Player);
        const enemy = this.extractFromCollider(object2, Enemy);

        if (!player || !enemy) {
            return;
        }

        const playerBody = player.body as Phaser.Physics.Arcade.Body;
        const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;

        const isFalling = playerBody.velocity.y > 0;
        const playerAbove = playerBody.bottom <= enemyBody.top + 6;

        if (isFalling && playerAbove) {
            enemy.defeat();
            player.bounce();
            this.addScore(100);
            this.time.delayedCall(1000, this.respawnEnemyAhead, [], this);
        } else {
            const direction = player.x < enemy.x ? -1 : 1;
            const tookDamage = player.takeDamage(direction);

            if (tookDamage) {
                this.lives -= 1;
                this.updateUI();

                if (this.lives <= 0) {
                    this.scene.restart();
                    return;
                }
            }
        }
    }

    private extractFromCollider<T extends Phaser.GameObjects.GameObject>(
        colliderObject: ColliderObject,
        constructor: new (...args: never[]) => T
    ): T | null {
        if (colliderObject instanceof constructor) {
            return colliderObject;
        }

        if (
            colliderObject instanceof Phaser.Physics.Arcade.Body ||
            colliderObject instanceof Phaser.Physics.Arcade.StaticBody
        ) {
            const attached = colliderObject.gameObject;

            if (attached instanceof constructor) {
                return attached;
            }
        }

        return null;
    }

    private respawnEnemyAhead(): void {
        const spawnX = Phaser.Math.Clamp(this.player.x + 320, 200, this.worldWidth - 200);
        const spawnY = this.groundY - 80;
        this.enemy.respawn(spawnX, spawnY);
    }

    private addScore(points: number): void {
        this.score += points;
        this.updateUI();
    }

    private createUI(): void {
        const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        };

        this.scoreText = this.add.text(16, 94, '', style).setScrollFactor(0);
        this.livesText = this.add.text(16, 122, '', style).setScrollFactor(0);
        this.updateUI();
    }

    private updateUI(): void {
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
    }

    private createQuestionBanner(): void {
        const bannerStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '18px',
            color: '#000000',
            backgroundColor: '#ffeb3b',
            padding: { x: 10, y: 6 },
            align: 'center',
            wordWrap: { width: 520 }
        };

        const hintStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '15px',
            color: '#ffffff',
            backgroundColor: '#1c1b1a',
            padding: { x: 8, y: 4 }
        };

        this.questionText = this.add
            .text(this.scale.width / 2, 16, 'Почему нет игры, где ты грибок и прыгаешь на супермарио? Вот она!', bannerStyle)
            .setOrigin(0.5, 0)
            .setScrollFactor(0);

        this.hintText = this.add
            .text(this.scale.width / 2, 54, 'Стрелки — движение и прыжок. Прыгай на водопроводчика, R — рестарт.', hintStyle)
            .setOrigin(0.5, 0)
            .setScrollFactor(0);
    }
}
