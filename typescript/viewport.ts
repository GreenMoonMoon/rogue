
const VIEWPORT_WIDTH = 160;
const VIEWPORT_HEIGHT= 160;

interface ShaderSources{
    vertex: string;
    fragment: string;
}

export class Viewport {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    positionAttribLocation: number;
    positionBuffer: WebGLBuffer;

    constructor(viewportCanvas: HTMLCanvasElement) {
        this.gl = <WebGLRenderingContext>viewportCanvas.getContext("webgl");
        if (!this.gl) throw new Error('Cannot init webgl');
        let shaderSources = getShaderSources('default');
        this.program = createProgram(this.gl, shaderSources)
        this.gl.viewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

        let position = [
            -1, -1,
            1, 1,
            -1, 1
        ]
        this.positionAttribLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.positionBuffer = <WebGLBuffer>this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(position), this.gl.STATIC_DRAW);
        
        this.gl.useProgram(this.program);
        let resolutionUniformLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_resolution');
        this.gl.uniform2fv(resolutionUniformLocation, [VIEWPORT_WIDTH, VIEWPORT_HEIGHT]);
    }
    
    update(){}
    
    draw(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.positionAttribLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
        this.gl.vertexAttribPointer(this.positionAttribLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }
}

function createProgram(gl: WebGLRenderingContext, shaderSources: ShaderSources) {
    let vertexShader = createShader(gl, shaderSources.vertex, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, shaderSources.fragment, gl.FRAGMENT_SHADER);
    let program = <WebGLProgram>gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
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

function getShaderSources(name: string): ShaderSources{
    let vertElement = <HTMLElement>document.getElementById("vertex-shader")
    let fragElement = <HTMLElement>document.getElementById("fragment-shader")

    return <ShaderSources>{
        vertex: vertElement.innerText,
        fragment: fragElement.innerText
    }
}