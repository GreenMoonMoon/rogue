import { Viewport } from "./viewport_2d.js"
import { Game, Ressources } from "./engine.js";

let ressources: Ressources;
let viewport: Viewport;
let game: Game;

async function start(){
    ressources = new Ressources();
    game = new Game();
    viewport = new Viewport(0, <HTMLCanvasElement>document.getElementById("canvas"), 16, 16);

    await ressources.loadTileset("colored").then((tilset: ImageBitmap) => {
        viewport.setTileset(tilset);
    })

    game.createMap(25, 25);
    viewport.draw(game.mapRect(0, 0, 16, 16));
}

window.addEventListener("load", start);