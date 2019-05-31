// import { Viewport } from "./viewport_gl.js";
import { Viewport } from "./viewport_2d.js"
import { Game, Controller, GameObject } from "./game.js";
import { point } from "./utils";

const viewport = new Viewport(<HTMLCanvasElement>document.getElementById('canvas'));
const game = new Game();
const controller = new Controller();

function updateViewport() {
    let map = game.mapRect(0, 0, 10, 10);
    viewport.draw(map);
}

game.update = () => updateViewport();

game.addObject(new GameObject("chest", 200, <point>{x:5, y:5}, [], ['pickable']));
game.addObject(new GameObject("key", 752, <point>{x:5, y:7}, [], ['interactable', 'obstacle']));

updateViewport();
game.loop();