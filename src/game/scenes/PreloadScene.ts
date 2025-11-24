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
            'player',
            {
                O: 0x1c1b1a,
                R: 0xd62828,
                r: 0xa31616,
                W: 0xf5f5f5,
                S: 0xe8cda5,
                s: 0xcfa77f,
                B: 0x6d4c41,
                b: 0x4e342e
            },
            [
                '......................',
                '........OOOOOO........',
                '.......ORRRRRRO.......',
                '......ORWWRWWRO.......',
                '......ORrRRRrRO.......',
                '......ORWWRWWRO.......',
                '.......ORRRRRO........',
                '......ORRRRRRRO.......',
                '.....ORRRRRRRRRO......',
                '....ORRRRRRRRRRRO.....',
                '...OOOSSSSSSSSOO......',
                '...OOOSsSSSsSSOO......',
                '...OOOSSSSSSSSOO......',
                '....OOSWWWWWSOO.......',
                '....OOSWWWWWSOO.......',
                '.....OOSSSSOO.........',
                '......OOSSOO..........',
                '......OOBBBOO.........',
                '.....OOBBBBOO.........',
                '.....OOBBBBOO.........',
                '.....OOB..BOO.........',
                '.....OOb..bOO.........',
                '.....OOb..bOO.........',
                '......OO....OO........'
            ],
            2
        );

        this.createPixelArtTexture(
            'enemy',
            {
                O: 0x1c1b1a,
                R: 0xc62828,
                r: 0x8b1b1b,
                W: 0xf5f5f5,
                H: 0xf2d7ae,
                h: 0xd6b184,
                B: 0x2459e0,
                b: 0x1b3fa3,
                Y: 0xfbc02d,
                y: 0xd69a00,
                N: 0x5d4037,
                n: 0x3e2723
            },
            [
                '......................',
                '........OOOOOO........',
                '.......ORRRRRRO.......',
                '......ORrRRRrRO.......',
                '.....ORRRRRRRRRO......',
                '.....ORWWWWWWRO.......',
                '....OORRRRRRRROO......',
                '....OORHHHWHHROO......',
                '...OORHHHNHHHROO......',
                '...OORHHHHHHHROO......',
                '...OORHHNHHHROO.......',
                '....ORBBBBBBRO........',
                '...ORBBBBBBBBRO.......',
                '...ORBBBBBBBBRO.......',
                '...ORBYBBBBYBRO.......',
                '...ORBBBBBBBBRO.......',
                '....ORBBBBBBRO........',
                '.....ORBB..BRO........',
                '.....ORBB..BRO........',
                '......ONNNNNNO........',
                '......ONN..NNO........',
                '.......On..nO.........',
                '.......On..nO.........',
                '........O....O........'
            ],
            2
        );

        this.createBlockyStripTexture(
            'platform',
            96,
            24,
            [0x4caf50, 0x43a047],
            [0x8d6e63, 0x6d4c41, 0x5d4037]
        );

        this.createBlockyStripTexture(
            'ground',
            400,
            48,
            [0x4caf50, 0x2e7d32],
            [0x8d6e63, 0x6d4c41, 0x5d4037, 0x4e342e]
        );

        this.createPixelArtTexture(
            'background-block',
            {
                A: 0x7cc5e8,
                B: 0x6daed6
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
