
interface BufferGroup {
    position: WebGLBuffer | null;
    resolution: WebGLBuffer | null;
}

interface ProgramInfo {
    attribLocations: {
        vertexPosition: number;
        resolution: number;
    };
    program: WebGLProgram | null;
}

class GLViewer {
    res: {w: number, h: number};
    gl: WebGL2RenderingContext;
    buffers: BufferGroup | null;
    programInfo: ProgramInfo | null;

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {
        this.res = {w:width, h:height};
        this.gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
        this.buffers = null;
        this.programInfo = null;

        canvas.width = width
        canvas.style.width = String(width)
        canvas.height = height
        canvas.style.height = String(height)
        this.gl.viewport(0, 0, width, height);
    }

    private setupContext(vertexSource: string, fragmentSource: string): ProgramInfo | null {
        let vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexSource);
        if(!vertexShader) return null;
        else vertexShader = <WebGLShader>vertexShader;

        let fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        if(!fragmentShader) return null;
        else fragmentShader = <WebGLShader>fragmentShader;

        let program = <WebGLProgram>this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.log('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(program));
            return null;
        }

        return <ProgramInfo>{
            program: program,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(program, 'aVertexPosition'),
                resolution: this.gl.getUniformLocation(program, 'uResolution')
            },
        };
    }

    private loadShader(shaderType: number, source: string): WebGLShader | null{
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

    private setupBuffers(): BufferGroup {
        let positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]
        let positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        return <BufferGroup>{
            position: positionBuffer
        };
    }


    async initialize(){
        let vertexRequest = new Request('./assets/glsl/basic.vert');
        let fragmentRequest = new Request('./assets/glsl/basic.frag');

        await Promise.all([fetch(vertexRequest), fetch(fragmentRequest)])
        .then((responses)=>{
            return Promise.all([responses[0].text(), responses[1].text()]);
        })
        .then((values)=>{
            this.programInfo = this.setupContext(values[0], values[1]);
            this.buffers = this.setupBuffers();
        })
    }

    draw() {
        if (!this.programInfo) {
            throw new Error('programInfo is not initialised!')
        } else{
            this.programInfo = <ProgramInfo>this.programInfo;
        }
        if (!this.buffers) {
            throw new Error('buffers is not initialised!')
        } else {
            this.buffers = <BufferGroup>this.buffers;
        }

        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST)
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition)
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);
        
        this.gl.uniform2f(this.programInfo.attribLocations.resolution, this.res.w, this.res.h);
        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(this.draw)
    }
}

function main() {
    let canvas = <HTMLCanvasElement>document.querySelector("#game-canvas");
    viewer = new GLViewer(canvas, 640, 480);
    let initialisedViewer = viewer.initialize();
    initialisedViewer.then(()=>{
        viewer.draw();
    })
}

var viewer: GLViewer;
window.onload = main;