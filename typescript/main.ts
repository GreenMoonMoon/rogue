// import { Viewport } from "./viewport_gl.js";
import { Viewport } from "./viewport_2d.js"
import { Game } from "./game.js";

const viewport = new Viewport(<HTMLCanvasElement>document.getElementById('canvas'));
const game = new Game();

function launchGame() {
    console.log("Launch Game");
}

function launchSimulation() {
    console.log("Launch Simulation");
}

function updateViewport() {
    console.log('event triggered');
    let map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 0, 0, 0],
        [0, 0, 0, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 9, 4, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 23, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    viewport.draw(map);
}

window.addEventListener("keydown", (event: KeyboardEvent) => updateViewport())

// ==============
game.updatePlayer(id=27);
// game.runSteps()
let map = game.mapRect(0, 0, 10, 10);
viewport.draw(map);
// ==============

