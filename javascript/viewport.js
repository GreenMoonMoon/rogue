const VIEWPORT_WIDTH = 160;
const VIEWPORT_HEIGHT = 160;
export class Viewport {
    constructor(viewportCanvas) {
        viewportCanvas.width = VIEWPORT_WIDTH;
        viewportCanvas.height = VIEWPORT_HEIGHT;
        this.gl = viewportCanvas.getContext("webgl");
        if (!this.gl)
            throw new Error('Cannot init webgl');
        let shaderSources = getShaderSources('default');
        this.program = createProgram(this.gl, shaderSources);
        this.gl.viewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        let position = [-1, -1, -1, 1, 1, 1, 1, -1];
        this.positionAttribLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(position), this.gl.STATIC_DRAW);
        let indices = [0, 2, 1, 0, 3, 2];
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        this.gl.useProgram(this.program);
        let resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        this.gl.uniform2fv(resolutionUniformLocation, [VIEWPORT_WIDTH, VIEWPORT_HEIGHT]);
        this.tileset = loadTileset(this.gl, 'monochrome');
        this.tilesetUniformLocation = this.gl.getUniformLocation(this.program, 'u_tileset');
    }
    update(view) {
    }
    draw() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionAttribLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(this.positionAttribLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tileset);
        this.gl.uniform1i(this.tilesetUniformLocation, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    }
}
function createProgram(gl, shaderSources) {
    let vertexShader = createShader(gl, shaderSources.vertex, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, shaderSources.fragment, gl.FRAGMENT_SHADER);
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let message = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(message);
    }
    return program;
}
function createShader(gl, shaderSource, shaderType) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(message);
    }
    return shader;
}
function getShaderSources(name) {
    let vertElement = document.getElementById("vertex-shader");
    let fragElement = document.getElementById("fragment-shader");
    return {
        vertex: vertElement.innerText,
        fragment: fragElement.innerText
    };
}
function loadTileset(gl, name) {
    let url = "assets/tilesheet/monochrome.png";
    let tilesetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tilesetTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    var tilesetImage = new Image();
    tilesetImage.src = url;
    tilesetImage.onload = function () {
        console.log('Texture onload');
        gl.bindTexture(gl.TEXTURE_2D, tilesetTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tilesetImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    return tilesetTexture;
}
//# sourceMappingURL=viewport.js.map