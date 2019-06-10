// import { Viewport } from "./viewport_gl.js";
import { Viewport } from "./viewport_2d.js"
import { Game, Controller, GameData, Ressources } from "./engine.js";

const viewport = new Viewport(<HTMLCanvasElement>document.getElementById('canvas'), 16, 16);
const game = new Game();
const controller = new Controller();
const ressource = new Ressources();

function updateViewport() {
    let map = game.mapRect(0, 0, 10, 10);
    viewport.draw(map);
}

function updateGame() {
    game.update();
}

async function start(){
    let tileset = await ressource.loadTileset("colored");
    let maps = await ressource.loadJson("maps");
}

window.addEventListener("load", start);