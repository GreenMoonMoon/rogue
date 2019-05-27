import { Viewport } from "./viewport.js";

let viewport: Viewport;
let game;
let simluation;

function launchGame() {
    console.log("Launch Game");
}

function launchSimulation() {
    console.log("Launch Simulation");
}

function launchViewport() {
    let viewportCanvas = <HTMLCanvasElement>document.getElementById("viewport-canvas");
    viewport = new Viewport(viewportCanvas);
    console.log("Launch viewport");
    viewport.draw();
}

function updateViewport() {
    viewport.update([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]);
    viewport.draw();
}

// launchGame();
// launchSimulation();
// launchViewport();