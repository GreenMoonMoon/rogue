import { Viewport } from "./viewport_2d.js";
const viewport = new Viewport(document.getElementById('canvas'));
var game;
var simluation;
function launchGame() {
    console.log("Launch Game");
}
function launchSimulation() {
    console.log("Launch Simulation");
}
function updateViewport() {
    console.log('event triggered');
    viewport.update([
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
    ]);
    viewport.draw();
    document.body.append(viewport.tileset);
}
window.addEventListener("keydown", (event) => updateViewport());
//# sourceMappingURL=main.js.map