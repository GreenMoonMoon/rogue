import { Viewport } from "./viewport_2d.js";
import { Ressources } from "./engine.js";

const TILESIZE = 16;
const ROW_WIDTH = 32;
const RATIO = 2;
const name = <HTMLInputElement>document.getElementById("map-name");
const width = <HTMLInputElement>document.getElementById("map-width");
const height = <HTMLInputElement>document.getElementById("map-height");
const tileIndexInput = <HTMLInputElement>document.getElementById("tile-index");

let penDown = false;
let penTile = 1;
let map: number[][];
let viewport: Viewport;
let tilesContext: CanvasRenderingContext2D;
let selectedTileContext: CanvasRenderingContext2D;
let tileset: ImageBitmap;
let printGridEnabled = true;

function createMap(width: number, height: number): number[][] {
    let map: number[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < width; x++) {
            map[y][x] = 5;
        }
    }
    return map;
}

function onResize() {
    let w = parseInt(width.value);
    let h = parseInt(height.value);
    map = createMap(w, h);
    viewport.update(w, h, TILESIZE, RATIO);
    viewport.clear();
    viewport.draw(map);
}

function setTileSeletor(image: ImageBitmap) {
    let selectedTileCanvas = <HTMLCanvasElement>document.getElementById("selected_tile");
    selectedTileCanvas.width = selectedTileCanvas.height = 32;
    selectedTileCanvas.style.width = selectedTileCanvas.style.height = "32";
    selectedTileContext = <CanvasRenderingContext2D>selectedTileCanvas.getContext("2d");
    selectedTileContext.imageSmoothingEnabled = false;

    let tilesCanvas = <HTMLCanvasElement>document.getElementById("tiles-canvas");
    tilesCanvas.addEventListener("click", onTileClick);
    tilesContext = <CanvasRenderingContext2D>tilesCanvas.getContext("2d");

    tilesContext.drawImage(image, 0, 0)
    selectedTileContext.drawImage(image, 32, 32, 16, 16, 0, 0, 32, 32);
}

function initEditor(event: Event) {
    let canvas = <HTMLCanvasElement>document.getElementById("workspace-canvas");
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", (event: MouseEvent) => onMouseUp(event));
    canvas.addEventListener("mousemove", (event: MouseEvent) => onMouseMove(event));
    canvas.addEventListener("mouseout", () => { penDown = false });

    let printGridOption = <HTMLInputElement>document.getElementById("map-grid");
    printGridOption.addEventListener("change", function (event: Event) {
        printGridEnabled = event.returnValue;
    })

    name.value = "unamed";
    width.value = "10";
    width.addEventListener("change", onResize);
    height.value = "10";
    height.addEventListener("change", onResize);

    viewport = new Viewport(0, canvas, 10, 10);
    viewport.update(10, 10, TILESIZE, RATIO);
    map = createMap(10, 10);
    viewport.draw(map);

    let ressource = new Ressources();
    let tilesetName = "colored";
    let tilesetBlob = ressource.loadTileset(tilesetName);
    tilesetBlob.then(function (blob) {
        let tilesetBitmap = createImageBitmap(blob);
        tilesetBitmap.then(function (image: ImageBitmap) {
            viewport.tileset = image;
            viewport.draw(map);
            setTileSeletor(image);
            tileset = image;
        });
    });

    printGrid(viewport.context);
}

function printGrid(ctx: CanvasRenderingContext2D) {
    let realTileSize = TILESIZE * RATIO;
    ctx.fillStyle = "white";
    for (let y = 0; y < (10 * realTileSize); y += realTileSize) {
        for (let x = 0; x < (10 * realTileSize); x += realTileSize) {
            ctx.strokeRect(x, y, realTileSize, realTileSize);
        }
    }
}

function getMapCoordinate(event: MouseEvent): { x: number, y: number } {
    let trueTileSize = TILESIZE * RATIO;
    return { x: Math.floor(event.clientX / trueTileSize), y: Math.floor(event.clientY / trueTileSize) };
}

function getTileCoordinate(canvas: HTMLCanvasElement, event: MouseEvent): { x: number, y: number } {
    let rect = canvas.getBoundingClientRect();
    return { x: Math.floor((event.clientX - rect.left) / TILESIZE), y: Math.floor((event.clientY - rect.top) / TILESIZE) }
}

function udpateMap(event: MouseEvent) {
    let mapCoord = getMapCoordinate(event);
    map[mapCoord.y][mapCoord.x] = penTile;
    viewport.draw(map);
    if (printGridEnabled) {
        printGrid(viewport.context); //NOTE: for debug only.
    }
}

function updateTileSelector(canvas: HTMLCanvasElement, event: MouseEvent) {
    let tileCoord = getTileCoordinate(canvas, event);
    let tileIndex = tileCoord.y * ROW_WIDTH + tileCoord.x;
    tileIndexInput.value = tileIndex.toString();
    penTile = tileIndex;

    tilesContext.fillStyle = "white"
    tilesContext.strokeRect(tileCoord.x * (TILESIZE + 1), tileCoord.y * (TILESIZE + 1), TILESIZE, TILESIZE)

    selectedTileContext.drawImage(tileset, tileCoord.x * (TILESIZE + 1), tileCoord.y * (TILESIZE + 1), TILESIZE, TILESIZE, 0, 0, 32, 32);
}

function onTileClick(event: MouseEvent) {
    updateTileSelector(tilesContext.canvas, event);
}

function onMouseDown(event: MouseEvent) {
    penDown = true;
    udpateMap(event);
}

function onMouseUp(event: MouseEvent) {
    penDown = false;
}

function onMouseMove(event: MouseEvent) {
    if (penDown) {
        udpateMap(event);
    }
}

window.addEventListener("load", initEditor);