import { Vector2, rgb, point } from "./utils.js";

const PIXEL_SIZE = 32;
const TILE_SIZE = 16;
const BACKCOLOR = "rgba(71, 45, 60)";
const FRONTCOLOR = "rgba(207, 198, 184)";

let tileCanvas: TileCanvas;

class TileCanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private tileGrid: boolean[][];

    penState: boolean;
    penDown: boolean;

    constructor(canvas: HTMLCanvasElement, previewCanvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

        previewCanvas.width = 32;
        previewCanvas.height = 32;
        this.previewCtx = <CanvasRenderingContext2D>previewCanvas.getContext("2d");

        this.tileGrid = [];
        this.generateTileGrid();
        this.penState = false;
        this.penDown = false;

        canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
        canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
        canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
    }

    getClickCoordinate(event: MouseEvent): Vector2 {
        let rect = this.canvas.getBoundingClientRect();
        return <Vector2>{ x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    getGridCoordinate(event: MouseEvent): point {
        let coord = this.getClickCoordinate(event);
        return { x: Math.floor(coord.x / PIXEL_SIZE), y: Math.floor(coord.y / PIXEL_SIZE) };
    }

    update(event: MouseEvent) {
        let gridCoord = this.getGridCoordinate(event);
        this.setGridColor(gridCoord);
        this.draw();
    }

    onMouseDown(event: MouseEvent) {
        this.penDown = true;
        let gridCoord = this.getGridCoordinate(event);
        this.penState = !this.tileGrid[gridCoord.x][gridCoord.y];
        this.update(event);
    }

    onMouseUp(event: MouseEvent) {
        this.penDown = false;
    }

    onMouseMove(event: MouseEvent) {
        if (this.penDown) {
            this.update(event);
        }
    }

    draw() {
        for (let y = 0; y < TILE_SIZE; y++) {
            for (let x = 0; x < TILE_SIZE; x++) {
                let color = this.tileGrid[y][x]
                let fillStyle = color ? FRONTCOLOR : BACKCOLOR;

                this.ctx.fillStyle = fillStyle;
                this.ctx.fillRect(y * PIXEL_SIZE, x * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

                this.previewCtx.fillStyle = fillStyle;
                this.previewCtx.fillRect(y * 2, x * 2, 2, 2)
            }
        }
    }

    private setGridColor(gridCoord: point) {
        this.tileGrid[gridCoord.x][gridCoord.y] = this.penState;
    }

    private generateTileGrid() {
        for (let y = 0; y < TILE_SIZE; y++) {
            this.tileGrid[y] = []
            for (let x = 0; x < TILE_SIZE; x++) {
                this.tileGrid[y][x] = false;
            }
        }
    }
}

window.onload = function () {
    let canvas = <HTMLCanvasElement>document.getElementById("te-workspace");
    let previewCanvas = <HTMLCanvasElement>document.getElementById("te-preview");
    tileCanvas = new TileCanvas(canvas, previewCanvas);
    tileCanvas.draw();
}