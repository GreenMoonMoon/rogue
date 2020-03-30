import { WebGL2Viewer, loadShaderSources } from "./engine/viewport_gl2.mjs";

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

    let viewer = new WebGL2Viewer(canvas, 10);
    // let shaderSources = loadShaderSources('basic', 'basic');

    // shaderSources.then(function (result) {
    //     let programInfo = viewer.createProgram(result.vertex, result.fragment);
    //     let defaultBuffer = viewer.defaultBuffer();
    //     if (defaultBuffer && programInfo) {
    //         viewer.draw(defaultBuffer, programInfo);
    //     }
    // });
    viewer.draw();
}

window.onload = main;