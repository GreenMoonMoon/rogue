import { Viewport } from "./viewport_2d.js"
import { Game, Ressources } from "./engine.js";

let ressources: Ressources;
let viewport: Viewport;
let game: Game;

async function start(){
    ressources = new Ressources();
    game = new Game();
    viewport = new Viewport(0, <HTMLCanvasElement>document.getElementById("canvas"), 16, 16, 2);

    await ressources.loadTileset("colored").then((tilset: ImageBitmap) => {
        viewport.setTileset(tilset);
    })

    game.createMap(25, 25);
    loop(0);
}

function loop(delta: number){
    viewport.draw(game.displayRect(0, 0, 16, 16));  
    requestAnimationFrame(loop);
}

window.addEventListener("load", start);