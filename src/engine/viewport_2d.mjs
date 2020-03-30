const DEFAULT_TILESIZE = 16;

export class CanvasViewer {
    /**
     * The canvas viewer is a simple HTML5 Canvas, a game scene will be rendered to the "2d" context.
     * @param {HTMLCanvasElement} canvas 
     * @param {number} scale - The given scale of the viewport, ratio of how many pixel a texel will take. 
     */
    constructor(canvas, scale) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.tileset = null;
        this.tilesize = DEFAULT_TILESIZE;
        this.rowWidth = 32;
        this.update(width, height, DEFAULT_TILESIZE, scale);
    }
    update(xTiles, yTiles, tilesize, zoom) {
        this.tilesize = tilesize;
        let width = xTiles * this.tilesize;
        let height = yTiles * this.tilesize;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = (width * zoom).toString();
        this.canvas.style.height = (height * zoom).toString();
        this.canvas.style.setProperty("image-rendering", "pixelated");
    }
    draw(map) {
        if (!this.tileset)
            return;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let indexY = (y > this.rowWidth) ? Math.floor(map[y][x] / this.rowWidth) : 0;
                let indexX = map[y][x] % this.rowWidth;
                this.context.drawImage(this.tileset, indexX * 17, indexY * 17, 16, 16, x * this.tilesize, y * this.tilesize, this.tilesize, this.tilesize);
            }
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.width * DEFAULT_TILESIZE, this.height * DEFAULT_TILESIZE);
    }
    setTileset(tileset) {
        this.tileset = tileset;
    }
}