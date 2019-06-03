// import { Viewport } from "./viewport_gl.js";
import { Viewport } from "./viewport_2d.js"
import { Game, Controller, GameData } from "./game.js";

const viewport = new Viewport(<HTMLCanvasElement>document.getElementById('canvas'));
const game = new Game();
const controller = new Controller();
const data = new GameData();

function updateViewport() {
    let map = game.mapRect(0, 0, 10, 10);
    viewport.draw(map);
}

function updateGame() {
    game.update();
}

game.initMap(data.loadMap());
game.update = () => updateViewport();

controller.update = () => updateGame();
// game.start();
