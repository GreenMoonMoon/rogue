import { Vector2, rgb, point } from "./utils.js";

let PIXEL_SIZE = 32;
let TILE_SIZE = 16;

let tileCanvas: TileCanvas;

class TileCanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private tileGrid: rgb[][];

    penColor: rgb;
    penDown: boolean;

    constructor(canvas: HTMLCanvasElement, previewCanvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.previewCtx = <CanvasRenderingContext2D>previewCanvas.getContext("2d");
        this.tileGrid = [];
        this.generateTileGrid();
        this.penColor = { x: 255, y: 255, z: 255 };
        this.penDown = false;

        // canvas.addEventListener("click", (event: MouseEvent) => this.onClick(event));
        canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
        canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
        canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
    }

    getClickCoordinate(event: MouseEvent): Vector2 {
        let rect = this.canvas.getBoundingClientRect();
        return <Vector2>{ x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    getGridCoordinate(coord: point): point {
        return { x: Math.floor(coord.x / PIXEL_SIZE), y: Math.floor(coord.y / PIXEL_SIZE) };
    }

    update(event: MouseEvent) {
        let clickCoord = this.getClickCoordinate(event);
        let gridCoord = this.getGridCoordinate(clickCoord);
        this.setGridColor(gridCoord);
        this.draw();
    }

    onMouseDown(event: MouseEvent) {
        this.penDown = true;
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
                this.ctx.fillStyle = `rgba(${color.x}, ${color.y}, ${color.z}, 255)`;
                this.ctx.fillRect(y * PIXEL_SIZE, x * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
        }

    }

    private setGridColor(gridCoord: point) {
        this.tileGrid[gridCoord.x][gridCoord.y] = this.penColor;
    }

    private generateTileGrid() {
        for (let y = 0; y < TILE_SIZE; y++) {
            this.tileGrid[y] = []
            for (let x = 0; x < TILE_SIZE; x++) {
                this.tileGrid[y][x] = { x: 0.0, y: 0.0, z: 0.0 };
            }
        }
        this.tileGrid[1][1] = <rgb>{ x: 255, y: 0, z: 0 };
    }
}

window.onload = function () {
    let canvas = <HTMLCanvasElement>document.getElementById("te-workspace");
    let previewCanvas = <HTMLCanvasElement>document.getElementById("te-preview");
    tileCanvas = new TileCanvas(canvas, previewCanvas);
    tileCanvas.draw();
}