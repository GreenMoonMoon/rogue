let VERTEX_SOURCE = `#version 300 es
precision mediump float;
in vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main()
{
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

let FRAGMENT_SOURCE = `#version 300 es
precision mediump float;
out vec4 outputColor;

void main()
{
    outputColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;



class GLViewer {
    gl: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.setupContext();
    }

    private setupContext() {
        const vertexShader = <WebGLShader>this.loadShader(this.gl.VERTEX_SHADER, VERTEX_SOURCE);
        const fragmentShader = <WebGLShader>this.loadShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SOURCE);

        let program = <WebGLProgram>this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(program));
            return null;
        }

    }

    private loadShader(shaderType: number, source: string) {
        let shader = <WebGLShader>this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader))
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}

function main() {
    let canvas = <HTMLCanvasElement>document.querySelector("#game-canvas");
    let viewer = new GLViewer(canvas);
}

window.onload = main;