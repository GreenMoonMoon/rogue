// import { Viewport } from "./viewport_gl.js";
import { Viewport } from "./viewport_2d.js"
import { Game, Controller } from "./game.js";

const viewport = new Viewport(<HTMLCanvasElement>document.getElementById('canvas'));
const game = new Game();
const controller = new Controller();

function updateViewport() {
    let map = game.mapRect(0, 0, 10, 10);
    viewport.draw(map);
}

game.update = () => updateViewport();

game.addObject({name: "chest", coordinate:{x:5, y:5}, tileID: 200});
game.addObject({name: "key", coordinate:{x:5, y:7}, tileID: 240});

updateViewport();
game.loop();