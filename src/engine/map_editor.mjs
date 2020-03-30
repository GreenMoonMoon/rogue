import { Viewport } from "./viewport_2d.js";
const TILESIZE = 16;
const ROW_WIDTH = 32;
const name = document.getElementById("map-name");
const width = document.getElementById("map-width");
const height = document.getElementById("map-height");
const tileIndexInput = document.getElementById("tile-index");
const output = document.getElementById("map-output");
let penDown = false;
let penTile = 1;
let map;
let viewport;
let tilesContext;
let selectedTileContext;
let tileset;
let printGridEnabled = true;
function createMap(width, height) {
    let map = [];
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
    viewport.update(w, h, TILESIZE, 2);
    viewport.clear();
    viewport.draw(map);
}
function setTileSeletor(image) {
    let selectedTileCanvas = document.getElementById("selected_tile");
    selectedTileCanvas.width = selectedTileCanvas.height = 32;
    selectedTileCanvas.style.width = selectedTileCanvas.style.height = "32";
    selectedTileContext = selectedTileCanvas.getContext("2d");
    selectedTileContext.imageSmoothingEnabled = false;
    let tilesCanvas = document.getElementById("tiles-canvas");
    tilesCanvas.addEventListener("click", onTileClick);
    tilesContext = tilesCanvas.getContext("2d");
    tilesContext.drawImage(image, 0, 0);
    selectedTileContext.drawImage(image, 32, 32, 16, 16, 0, 0, 32, 32);
}
function initEditor(event) {
    let canvas = document.getElementById("workspace-canvas");
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", (event) => onMouseUp(event));
    canvas.addEventListener("mousemove", (event) => onMouseMove(event));
    canvas.addEventListener("mouseout", () => { penDown = false; });
    let printGridOption = document.getElementById("map-grid");
    printGridOption.addEventListener("change", function (event) {
        printGridEnabled = event.returnValue;
    });
    name.value = "unamed";
    width.value = "10";
    width.addEventListener("change", onResize);
    height.value = "10";
    height.addEventListener("change", onResize);
    viewport = new Viewport(0, canvas, 10, 10, 2);
    viewport.update(10, 10, TILESIZE, 2);
    map = createMap(10, 10);
    viewport.draw(map);
    printGrid(viewport.context);
}
function updateTileSelector(canvas, event) {
    let tileCoord = getTileCoordinate(canvas, event);
    let tileIndex = tileCoord.y * ROW_WIDTH + tileCoord.x;
    tileIndexInput.value = tileIndex.toString();
    penTile = tileIndex;
    tilesContext.fillStyle = "white";
    tilesContext.strokeRect(tileCoord.x * (TILESIZE + 1), tileCoord.y * (TILESIZE + 1), TILESIZE, TILESIZE);
    selectedTileContext.drawImage(tileset, tileCoord.x * (TILESIZE + 1), tileCoord.y * (TILESIZE + 1), TILESIZE, TILESIZE, 0, 0, 32, 32);
}
function updateEditor() {
    output.textContent = JSON.stringify({ tests: true });
}
function printGrid(ctx) {
    ctx.fillStyle = "white";
    for (let y = 0; y < (10 * TILESIZE); y += TILESIZE) {
        for (let x = 0; x < (10 * TILESIZE); x += TILESIZE) {
            ctx.strokeRect(x, y, TILESIZE, TILESIZE);
        }
    }
}
function getMapCoordinate(event) {
    return { x: Math.floor(event.clientX / TILESIZE), y: Math.floor(event.clientY / TILESIZE) };
}
function getTileCoordinate(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return { x: Math.floor((event.clientX - rect.left) / TILESIZE), y: Math.floor((event.clientY - rect.top) / TILESIZE) };
}
function udpateMap(event) {
    let mapCoord = getMapCoordinate(event);
    map[mapCoord.y][mapCoord.x] = penTile;
    viewport.draw(map);
    if (printGridEnabled) {
        printGrid(viewport.context);
    }
}
function onTileClick(event) {
    updateTileSelector(tilesContext.canvas, event);
}
function onMouseDown(event) {
    penDown = true;
    udpateMap(event);
}
function onMouseUp(event) {
    penDown = false;
}
function onMouseMove(event) {
    if (penDown) {
        udpateMap(event);
    }
}
window.addEventListener("load", initEditor);