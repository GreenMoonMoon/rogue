const DEFAULT_TILESIZE = 16;
const DEFAULT_RATIO = 2;

export class Viewport {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    tileset: ImageBitmap | null;
    tilesize: number;
    ratio: number;
    width: number;
    height: number;
    id: number;

    constructor(id: number, canvas: HTMLCanvasElement, width: number, height: number) {
        this.id = id // This "id" attribute serve to dispatch renderable component. 
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.tileset = null;
        this.tilesize = 0;
        this.ratio = 0;

        this.update(width, height, DEFAULT_TILESIZE, DEFAULT_RATIO);
    }

    update(xTiles: number, yTiles: number, tilesize: number, ratio: number) {
        this.tilesize = tilesize;
        let width = xTiles * tilesize * ratio;
        let height = yTiles * tilesize * ratio;
        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.width = width.toString();
        this.canvas.style.height = height.toString();
    }

    draw(map: number[][]) {
        if (!this.tileset) return;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let indexY = (y > 0) ? Math.floor(map[y][x] / 32) : 0;
                let indexX = map[y][x] % 32;
                this.context.drawImage(this.tileset, indexX * 17, indexY * 17, 16, 16, x * 32, y * 32, 32, 32);
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.width * DEFAULT_TILESIZE, this.height * DEFAULT_TILESIZE)
    }
}