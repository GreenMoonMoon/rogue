import { Viewport } from "./viewport_2d.js"
import { Game, Ressources, Level } from "./engine.js";

let ressources: Ressources;
let viewport: Viewport;
let game: Game;

async function load() {
    ressources = new Ressources();
    ressources.loadTileset("colored");
    
    game = new Game();
    viewport = new Viewport(0, <HTMLCanvasElement>document.getElementById("canvas"), 16, 16, 2);
    viewport.setTileset(ressources.tilesets[0]);
    
    let level = new Level();
    game.setLevel(level);
    game.newPlayer();

    start();
}

function start() {

}

window.addEventListener("load", start);