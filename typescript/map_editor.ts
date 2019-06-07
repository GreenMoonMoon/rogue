import { Viewport } from "./viewport_2d.js";
import { Ressources } from "./engine.js";

const TILESIZE = 16;
const RATIO = 3;
const name = <HTMLInputElement>document.getElementById("map-name");
const width = <HTMLInputElement>document.getElementById("map-width");
const height = <HTMLInputElement>document.getElementById("map-height");
let penDown = false;
let penTile = 1;

let map: number[][];
let viewport: Viewport;
let tilesContext: CanvasRenderingContext2D;
let selectedTileContext: CanvasRenderingContext2D;


function createMap(width: number, height: number): number[][] {
    let map: number[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < height; x++) {
            map[y][x] = 5;
        }
    }
    return map;
}

function onResize() {
    let w = parseInt(width.value);
    let h = parseInt(height.value);
    map = createMap(w, h);
    viewport.update(w, h, TILESIZE);
    viewport.clear();
    viewport.draw(map);
}

function setTileSeletor(image: ImageBitmap) {
    let selectedTileCanvas = <HTMLCanvasElement>document.getElementById("selected_tile");
    selectedTileCanvas.width = selectedTileCanvas.height = 32;
    selectedTileCanvas.style.width = selectedTileCanvas.style.height = "32"
    selectedTileContext = <CanvasRenderingContext2D>selectedTileCanvas.getContext("2d");
    selectedTileContext.imageSmoothingEnabled = false;

    let tilesCanvas = <HTMLCanvasElement>document.getElementById("tiles")
    tilesContext = <CanvasRenderingContext2D>tilesCanvas.getContext("2d");

    tilesContext.drawImage(image, 0, 0)
    selectedTileContext.drawImage(image, 32, 32, 16, 16, 0, 0, 32, 32);
}

function initEditor(event: Event) {
    let canvas = <HTMLCanvasElement>document.getElementById("viewport-canvas");
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", (event: MouseEvent) => onMouseUp(event));
    canvas.addEventListener("mousemove", (event: MouseEvent) => onMouseMove(event));

    viewport = new Viewport(canvas);
    viewport.update(10, 10, 32);
    map = createMap(10, 10);
    viewport.draw(map);

    name.value = "unamed";

    width.value = "10";
    width.addEventListener("change", onResize);
    height.value = "10";
    height.addEventListener("change", onResize);

    let tilesetName = "colored";


    let ressource = new Ressources();
    let tilesetBlob = ressource.loadTileset(tilesetName);
    tilesetBlob.then(function (blob) {
        let tilesetBitmap = createImageBitmap(blob);
        tilesetBitmap.then(function (image: ImageBitmap) {
            viewport.tileset = image;
            viewport.draw(map);
            setTileSeletor(image);
        });
    });
}

function getMapCoordinate(event: MouseEvent): { x: number, y: number } {
    return { x: Math.floor(event.clientX / (TILESIZE * RATIO)), y: Math.floor(event.clientY / (TILESIZE * RATIO)) };
}

function onMouseDown(event: MouseEvent) {
    penDown = true;
    udpate(event);
}

function udpate(event: MouseEvent) {
    let mapCoord = getMapCoordinate(event);
    map[mapCoord.y][mapCoord.x] = penTile;
    viewport.draw(map);
}

function onMouseUp(event: MouseEvent) {
    penDown = false;
}

function onMouseMove(event: MouseEvent) {
    if (penDown) {
        udpate(event);
    }
}

window.addEventListener("load", initEditor);