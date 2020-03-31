import { WebGL2Viewer, WebGLDraw } from "./engine/viewport_gl2.mjs";

function loadTilemap(viewer, tilesetSource) {
    return __awaiter(this, void 0, void 0, function* () {
        let tilesetRequest = new Request(`assets/tilesheet/${tilesetSource}.png`);
        let tileset = new Image();
        yield fetch(tilesetRequest)
            .then(function (response) {
                return response.blob();
            })
            .then(function (blob) {
                tileset.src = URL.createObjectURL(blob);
                return tileset;
            });
    });
}

function main() {
    let canvas = document.querySelector("#game-canvas");
    // let viewer = new WebGL2Viewer(canvas, 10);
    // viewer.loadShaders('basic', 'basic').then(function(){
    //     viewer.draw();
    // });
    WebGLDraw(canvas, 'basic', 'basic');
}

window.onload = main;