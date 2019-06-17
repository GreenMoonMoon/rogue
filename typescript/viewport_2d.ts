const DEFAULT_TILESIZE = 16;
// https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
export class Viewport {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    tileset: ImageBitmap | null;
    tilesize: number;
    width: number;
    height: number;
    id: number;
    rowWidth: number;

    constructor(id: number, canvas: HTMLCanvasElement, width: number, height: number) {
        this.id = id // This "id" attribute serve to dispatch renderable component. 
        this.canvas = canvas;
        this.width = width;
        this.height = height;

        this.context = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.tileset = null;
        this.tilesize = DEFAULT_TILESIZE;
        this.rowWidth = 32;

        this.update(width, height, DEFAULT_TILESIZE, 1);
    }

    update(xTiles: number, yTiles: number, tilesize: number, zoom: number) {
        this.tilesize = tilesize;
        let width = xTiles * this.tilesize;
        let height = yTiles * this.tilesize;
        this.canvas.width = width;
        this.canvas.height = height;

        this.canvas.style.width = (width * zoom).toString();
        this.canvas.style.height = (height * zoom).toString();
        this.canvas.style.setProperty("imageRendering", "pixelated");
    }

    draw(map: number[][]) {
        if (!this.tileset) return;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let indexY = (y > this.rowWidth) ? Math.floor(map[y][x] / this.rowWidth) : 0;
                let indexX = map[y][x] % this.rowWidth;
                this.context.drawImage(this.tileset, indexX * 17, indexY * 17, 16, 16, x * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
            }
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.width * DEFAULT_TILESIZE, this.height * DEFAULT_TILESIZE)
    }

    setTileset(tileset: ImageBitmap){
        this.tileset = tileset;
    }
}