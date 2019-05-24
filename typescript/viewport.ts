
const VIEWPORT_WIDTH = 160;
const VIEWPORT_HEIGHT = 160;

interface ShaderSources {
    vertex: string;
    fragment: string;
}

export class Viewport {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    positionAttribLocation: number;
    positionBuffer: WebGLBuffer;
    tileset: WebGLTexture;
    tilesetUniformLocation: WebGLUniformLocation;
    indexBuffer: WebGLBuffer;

    constructor(viewportCanvas: HTMLCanvasElement) {
        viewportCanvas.width = VIEWPORT_WIDTH;
        viewportCanvas.height = VIEWPORT_HEIGHT;
        this.gl = <WebGLRenderingContext>viewportCanvas.getContext("webgl");
        if (!this.gl) throw new Error('Cannot init webgl');
        let shaderSources = getShaderSources('default');
        this.program = createProgram(this.gl, shaderSources)
        this.gl.viewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        let position = [-1, -1, 1, 1, -1, 1, 1, -1]
        this.positionAttribLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.positionBuffer = <WebGLBuffer>this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(position), this.gl.STATIC_DRAW);

        let indices = [0, 1, 2, 0, 3, 2];
        this.indexBuffer = <WebGLBuffer>this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);

        this.gl.useProgram(this.program);
        let resolutionUniformLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_resolution');
        this.gl.uniform2fv(resolutionUniformLocation, [VIEWPORT_WIDTH, VIEWPORT_HEIGHT]);

        this.tileset = loadTileset(this.gl, 'monochrome');
        this.tilesetUniformLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_tileset');
    }

    update() { }

    draw() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionAttribLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
        this.gl.vertexAttribPointer(this.positionAttribLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tileset);
        this.gl.uniform1i(this.tilesetUniformLocation, 0)

        // this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    }
}

function createProgram(gl: WebGLRenderingContext, shaderSources: ShaderSources) {
    let vertexShader = createShader(gl, shaderSources.vertex, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, shaderSources.fragment, gl.FRAGMENT_SHADER);
    let program = <WebGLProgram>gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let message = <string>gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(message);
    }

    return program;
}

function createShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader {
    let shader = <WebGLShader>gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        let message = <string>gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(message);
    }

    return shader;
}

function getShaderSources(name: string): ShaderSources {
    let vertElement = <HTMLElement>document.getElementById("vertex-shader")
    let fragElement = <HTMLElement>document.getElementById("fragment-shader")

    return <ShaderSources>{
        vertex: vertElement.innerText,
        fragment: fragElement.innerText
    }
}

function loadTileset(gl: WebGLRenderingContext, name: string): WebGLTexture {
    // let url = `assets/tilesheet/${name}.png`;
    let url = "assets/tilesheet/monochrome.png";

    let tilesetTexture = <WebGLTexture>gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tilesetTexture);

    // Temporary 1 pixel texture.
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([255, 0, 255, 255])
    )

    var tilesetImage = new Image();
    // tilesetImage.crossOrigin = "anonymous";
    tilesetImage.src = url;
    tilesetImage.onload = function () {
        console.log('Texture onload');
        gl.bindTexture(gl.TEXTURE_2D, tilesetTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tilesetImage);

        // // if the image is a power of 2 on both sides
        // gl.generateMipmap(gl.TEXTURE_2D)

        // if the image is NOT a power of 2
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    return tilesetTexture;
}