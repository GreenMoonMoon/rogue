const PIXEL_SIZE = 32;
const TILE_SIZE = 16;
const BACKCOLOR = "rgba(71, 45, 60)";
const FRONTCOLOR = "rgba(207, 198, 184)";
let tileCanvas;
class TileCanvas {
    constructor(canvas, previewCanvas) {
        this.canvas = canvas;
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.ctx = canvas.getContext("2d");
        previewCanvas.width = 32;
        previewCanvas.height = 32;
        this.previewCtx = previewCanvas.getContext("2d");
        this.tileGrid = [];
        this.generateTileGrid();
        this.penState = false;
        this.penDown = false;
        canvas.addEventListener("mousedown", (event) => this.onMouseDown(event));
        canvas.addEventListener("mouseup", (event) => this.onMouseUp(event));
        canvas.addEventListener("mousemove", (event) => this.onMouseMove(event));
    }
    getClickCoordinate(event) {
        let rect = this.canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    getGridCoordinate(event) {
        let coord = this.getClickCoordinate(event);
        return { x: Math.floor(coord.x / PIXEL_SIZE), y: Math.floor(coord.y / PIXEL_SIZE) };
    }
    update(event) {
        let gridCoord = this.getGridCoordinate(event);
        this.setGridColor(gridCoord);
        this.draw();
    }
    onMouseDown(event) {
        this.penDown = true;
        let gridCoord = this.getGridCoordinate(event);
        this.penState = !this.tileGrid[gridCoord.x][gridCoord.y];
        this.update(event);
    }
    onMouseUp(event) {
        this.penDown = false;
    }
    onMouseMove(event) {
        if (this.penDown) {
            this.update(event);
        }
    }
    draw() {
        for (let y = 0; y < TILE_SIZE; y++) {
            for (let x = 0; x < TILE_SIZE; x++) {
                let color = this.tileGrid[y][x];
                let fillStyle = color ? FRONTCOLOR : BACKCOLOR;
                this.ctx.fillStyle = fillStyle;
                this.ctx.fillRect(y * PIXEL_SIZE, x * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
                this.previewCtx.fillStyle = fillStyle;
                this.previewCtx.fillRect(y * 2, x * 2, 2, 2);
            }
        }
    }
    setGridColor(gridCoord) {
        this.tileGrid[gridCoord.x][gridCoord.y] = this.penState;
    }
    generateTileGrid() {
        for (let y = 0; y < TILE_SIZE; y++) {
            this.tileGrid[y] = [];
            for (let x = 0; x < TILE_SIZE; x++) {
                this.tileGrid[y][x] = false;
            }
        }
    }
}
window.onload = function () {
    let canvas = document.getElementById("te-workspace");
    let previewCanvas = document.getElementById("te-preview");
    tileCanvas = new TileCanvas(canvas, previewCanvas);
    tileCanvas.draw();
};