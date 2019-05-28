
const MAP_SIZE = 10;
const ROW_SIZE = 32;

export class Viewport {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    map: number[][];
    tileset: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 320;
        this.canvas.height = 320;
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.map = [];
        this.tileset = loadTileset('colored');
    }

    update(map: number[][]) {
        this.map = map;
    }

    draw() {
        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                let indexY = (y > 0) ? Math.floor(this.map[y][x] / 32) : 0;
                let indexX = this.map[y][x] % 32;
                this.context.drawImage(
                    this.tileset,
                    indexX * 17,
                    indexY * 17,
                    16,
                    16,
                    x * 32,
                    y * 32,
                    32,
                    32
                );
            }
        }
    }
}

function loadTileset(name: string): HTMLImageElement {
    let url = `assets/tilesheet/${name}.png`;

    let tileset = new Image();
    tileset.src = url;

    return tileset;
}