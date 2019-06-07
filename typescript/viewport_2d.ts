
const MAP_SIZE = 10;
const DEFAULT_TILESIZE = 16;

export class Viewport {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    tileset: ImageBitmap | null;
    tilesize: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        
        this.tilesize = 0;
        this.update(10, 10, DEFAULT_TILESIZE);
        this.tileset = null;
    }

    update(xTiles: number, yTiles: number, tilesize: number){
        this.tilesize = tilesize;
        let width = xTiles * tilesize;
        let height = yTiles * tilesize;
        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.width = width.toString();
        this.canvas.style.height = height.toString();
    }

    draw(map: number[][]) {
        if(!this.tileset) return;
        
        for (let y = 0; y < MAP_SIZE; y++) {
            for (let x = 0; x < MAP_SIZE; x++) {
                let indexY = (y > 0) ? Math.floor(map[y][x] / 32) : 0;
                let indexX = map[y][x] % 32;
                this.context.drawImage(this.tileset, indexX * 17, indexY * 17, 16, 16, x * 32, y * 32, 32, 32);
            }
        }
    }

    clear(){
        this.context.clearRect(0, 0, MAP_SIZE * DEFAULT_TILESIZE, MAP_SIZE * DEFAULT_TILESIZE)
    }
}