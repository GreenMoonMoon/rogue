
const MAP_SIZE = 10;
const ROW_SIZE = 32;

export class Viewport {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    map: number[][];
    tileset: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.map = [];
        this.tileset = new Image(543, 543);
    }

    update(map: number[][]) {
        this.map = map;
    }

    draw() {
        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                let indexY = Math.floor(this.map[y][x] / 32);
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

function loadTileset(name: string): HTMLImageElement{
    // let url = `asset/tilesheet/${name}.png`;
    let url = "asset/tilesheet/monochrome.png";

    let tileset = new Image();
    tileset.src = url;
    
    return tileset;
}