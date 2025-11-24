import Phaser from 'phaser';

export class PlatformFactory {
    static createPlatforms(
        scene: Phaser.Scene,
        groundY: number,
        worldWidth: number
    ): Phaser.Physics.Arcade.StaticGroup {
        const platforms = scene.physics.add.staticGroup();

        for (let x = 0; x < worldWidth; x += 400) {
            const ground = platforms.create(x, groundY, 'ground') as Phaser.Physics.Arcade.Sprite;
            ground.setOrigin(0, 0.5);
            ground.refreshBody();
        }

        const floatingPlatforms = [
            { x: 420, y: groundY - 140 },
            { x: 780, y: groundY - 220 },
            { x: 1150, y: groundY - 140 },
            { x: 1500, y: groundY - 200 },
            { x: 1880, y: groundY - 120 },
            { x: 2250, y: groundY - 180 },
            { x: 2600, y: groundY - 120 }
        ];

        floatingPlatforms.forEach((config) => {
            const platform = platforms.create(config.x, config.y, 'platform') as Phaser.Physics.Arcade.Sprite;
            platform.setOrigin(0.5, 0.5);
            platform.refreshBody();
        });

        return platforms;
    }
}
