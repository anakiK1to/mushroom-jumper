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

        this.createPixelArtTexture(
            'mushroom',
            {
                R: 0xd62828,
                r: 0xb71c1c,
                W: 0xf5f5f5,
                Y: 0xf2d7ae,
                y: 0xd6b184,
                B: 0x1c1b1a
            },
            [
                '................',
                '...RRRRRRRRRR...',
                '..RRWWRRRRWWRR..',
                '.RRWWRRRRRRWWRR.',
                '.RRRRRRRRRRRRRR.',
                '.RRRRRRRRRRRRRR.',
                '.RRRWWRRRRWWRRR.',
                '..RRRRRRRRRRRR..',
                '.YYYYYYYYYYYYYY.',
                '.YYYYYYYYYYYYYY.',
                '.YYYYBBYYBBYYYY.',
                '.YYYYYYYYYYYYYY.',
                '..YYYYYYYYYYYY..',
                '..YYYYYYYYYYYY..',
                '...YYYYYYYYYY...',
                '................'
            ],
            4
        );

        this.createPixelArtTexture(
            'plumber',
            {
                R: 0xf44336,
                r: 0xc62828,
                W: 0xf5f5f5,
                F: 0xf2d7ae,
                f: 0xd6b184,
                B: 0x1e88e5,
                b: 0x1565c0,
                M: 0x5d4037,
                Y: 0xfbc02d
            },
            [
                '................',
                '...RRRRRRRRRR...',
                '..RRRRRRRRRRRR..',
                '..RRWWRRRRWWRR..',
                '..RRRRRRRRRRRR..',
                '...RRRRRRRRRR...',
                '..FFFFFFFFFFFF..',
                '.FFFFFFFFFFFFFF.',
                '.FFWBBWFFWBBFFF.',
                '.FFFMMMMMMMMFFF.',
                '.FFFFFFFFFFFFFF.',
                '.FFBBBBBBBBBBFF.',
                '.FfBBBBYYBBBBfF.',
                '.FfBBBBBBBBBBfF.',
                '..FBBBBBBBBBBF..',
                '..FBBBBBBbBBBF..'
            ],
            4
        );

        this.createBlockyStripTexture(
            'platform',
            96,
            24,
            [0xc67c48, 0xb56b3c],
            [0x8d6e63, 0x6d4c41, 0x5d4037]
        );

        this.createBlockyStripTexture(
            'ground',
            400,
            48,
            [0x6ab04c, 0x60a243],
            [0x8d6e63, 0x6d4c41, 0x5d4037, 0x4e342e]
        );

        this.createPixelArtTexture(
            'question-block',
            {
                O: 0xf9a825,
                o: 0xf57f17,
                H: 0xffeb3b,
                h: 0xfbc02d,
                S: 0x1c1b1a
            },
            [
                'OOOOOOOOOOOOOOOO',
                'OHHHHHHHHHHHHHOO',
                'OHShHShHShHShHO',
                'OHHHHHHHHHHHHHOO',
                'OHoHoHoHoHoHoHO',
                'OHHHHHHHHHHHHHOO',
                'OHoHoHoHoHoHoHO',
                'OOOOOOOOOOOOOOOO'
            ],
            4
        );

        this.createPixelArtTexture(
            'background-block',
            {
                A: 0x8fd7ff,
                B: 0x73c2f2
            },
            [
                'AABB',
                'BBAA',
                'AABB',
                'BBAA'
            ],
            4
        );
    }

    create(): void {
        this.scene.start('LevelScene');
    }

    private createPixelArtTexture(
        key: string,
        palette: Record<string, number>,
        pixels: string[],
        pixelSize = 4
    ): void {
        if (!pixels.length) {
            return;
        }

        const width = pixels[0].length * pixelSize;
        const height = pixels.length * pixelSize;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        pixels.forEach((row, rowIndex) => {
            [...row].forEach((symbol, columnIndex) => {
                const color = palette[symbol];

                if (!color) {
                    return;
                }

                graphics.fillStyle(color, 1);
                graphics.fillRect(
                    columnIndex * pixelSize,
                    rowIndex * pixelSize,
                    pixelSize,
                    pixelSize
                );
            });
        });

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    private createBlockyStripTexture(
        key: string,
        width: number,
        height: number,
        topColors: number[],
        bodyColors: number[],
        pixelSize = 4
    ): void {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        for (let y = 0; y < height; y += pixelSize) {
            const isTop = y < pixelSize * 2;
            for (let x = 0; x < width; x += pixelSize) {
                const palette = isTop ? topColors : bodyColors;
                const colorIndex = (Math.floor(x / pixelSize) + Math.floor(y / pixelSize)) % palette.length;
                graphics.fillStyle(palette[colorIndex], 1);
                graphics.fillRect(x, y, pixelSize, pixelSize);
            }
        }

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }
}
