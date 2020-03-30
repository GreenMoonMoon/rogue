class WebGL2Viewer {
    /**
     * The WebGL2 viewer will render the game scene to a quad trough a fragment shader using webgl2.
     * @param {HTMLCanvasElement} canvas 
     * @param {number} scale - The given scale of the viewport, ratio of how many pixel a texel will take. 
     */
    constructor(canvas, scale) {
        this.gl = canvas.getContext('webgl2');
    }

    draw() {
        //Clear any binding once finished with a vertexArray.
        this.gl.bindVertexArray(null);
    }
}

function loadShaderSources(vertexName, fragmentName) {
    return __awaiter(this, void 0, void 0, function* () {
        let vertexRequest = new Request(`assets/glsl/${vertexName}.vert`);
        let fragmentRequest = new Request(`assets/glsl/${fragmentName}.vert`);
        return yield Promise.all([fetch(vertexRequest), fetch(fragmentRequest)])
            .then(function (responses) {
                return Promise.all([responses[0].text(), responses[1].text()]);
            })
            .then(function (results) {
                return { vertex: results[0], fragment: results[1] };
            });
    });
}

export { WebGL2Viewer, loadShaderSources };