import { Viewport } from "./viewport_2d.js"
import { Game, Ressources, Entity, Controller, Graphic } from "./engine.js";
import { point } from "./utils.js"

let ressources: Ressources;
let viewport: Viewport;
let game: Game;

async function start() {
    ressources = new Ressources();
    game = new Game();
    viewport = new Viewport(0, <HTMLCanvasElement>document.getElementById("canvas"), 16, 16, 2);

    await ressources.loadTileset("colored").then((tilset: ImageBitmap) => {
        viewport.setTileset(tilset);
    })

    game.createMap(25, 25);
    fillMap();

    loop(0);
}

function loop(delta: number) {
    game.executeCommand();
    viewport.draw(game.displayRect(0, 0, 16, 16));
    requestAnimationFrame(loop);
}

function fillMap() {
    let player = new Entity("player", <point>{ x: 0, y: 0 });
    player.addComponent(new Controller());
    player.addComponent(new Graphic(28));
    game.addEntity(player);

    let gold = new Entity("gold");
    gold.addComponent(new Graphic(841));
    
    let chest = new Entity("chest", <point>{x: 4, y: 6}, [gold]);
    chest.zIndex = 100;
    chest.addComponent(new Graphic(200));
    game.addEntity(chest);
}

window.addEventListener("load", start);