import { Viewport } from "./viewport_2d.js";

function initEditor(event: Event) {
    let canvas = <HTMLCanvasElement>document.getElementById("viewport-canvas");
    let viewport = new Viewport(canvas);

    let map = {};
    // viewport.dislay(map);

    console.log("Test foo bar");
}

window.addEventListener("load", initEditor);