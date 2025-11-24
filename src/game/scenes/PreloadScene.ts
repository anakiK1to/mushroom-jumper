import { Scene } from 'phaser';

export class PreloadScene extends Scene {
    constructor() {
        super('PreloadScene');
    }

    preload(): void {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading...', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.createPlaceholderTexture('player', 32, 32, 0xbada55, 0x4b8b3b);
        this.createPlaceholderTexture('enemy', 32, 32, 0xd36135, 0x8c2f1d);
        this.createPlaceholderTexture('platform', 96, 24, 0x8d6e63, 0x5d4037);
        this.createPlaceholderTexture('ground', 400, 48, 0x6d4c41, 0x4e342e);
        this.createPlaceholderTexture('background-block', 2, 2, 0x78c0e0, 0x78c0e0);
    }

    create(): void {
        this.scene.start('LevelScene');
    }

    private createPlaceholderTexture(
        key: string,
        width: number,
        height: number,
        fillColor: number,
        strokeColor: number
    ): void {
        const graphics = this.add.graphics({ x: 0, y: 0 });
        graphics.setVisible(false);
        graphics.fillStyle(fillColor, 1);
        graphics.fillRoundedRect(0, 0, width, height, 6);
        graphics.lineStyle(2, strokeColor, 1);
        graphics.strokeRoundedRect(0, 0, width, height, 6);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
}
