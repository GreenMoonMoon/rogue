import { Viewport } from "./viewport_2d.js";
import { Ressources } from "./engine.js";

const TILESIZE = 16;
const RATIO = 3;

let ctx: CanvasRenderingContext2D;

function newMap(width: number, height: number): number[][] {
    let map: number[][] = [];
    for (let y = 0; y < height; y++) {
        map[y] = [];
        for (let x = 0; x < height; x++) {
            map[y][x] = 3;
        }
    }
    return map;
}

function initEditor(event: Event) {
    let canvas = <HTMLCanvasElement>document.getElementById("viewport-canvas");
    let viewport = new Viewport(canvas);

    let map = newMap(10, 10);
    viewport.draw(map);

    let tilesetName = "colored";

    let ressource = new Ressources();
    let tilesetBlob = ressource.loadTileset(tilesetName);
    tilesetBlob.then(function(blob){
        let tilesetBitmap = createImageBitmap(blob);
        tilesetBitmap.then(function(image: ImageBitmap){
            viewport.tileset = image;
            viewport.draw(map);
        });
    });
}

window.addEventListener("load", initEditor);