export class Viewport {
    private width: number;
    private height: number;
    gl: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
        if (!this.gl) throw new Error('Cannot init webgl');   
        
        this.gl.clearColor(0.2, 0.2, 0.2, 1.0);
    }

    draw(buffers: any, program: any, attributeLocations: any) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.useProgram(program);
        
        // bind vertex position buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position)
        this.gl.vertexAttribPointer(attributeLocations.vertex, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(attributeLocations.vertex);
        
        // pass uniform data
        this.gl.uniform2f(attributeLocations.resolution, this.width, this.height)

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    }
}

function createProgram(gl: WebGL2RenderingContext, shaderSources: {vertex: string, fragment: string}) {
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

function createShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number): WebGLShader {
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

export async function loadShaderSources(vertexName: string, fragmentName: string): Promise<any> {
    /**
     * Retrieve the source for a given vertex and fragment shader.
     * 
     * @remarks
     * This is async function and returns the value wrapped in a promise.
     * 
     * @param vertexName - the name of the vertex shader file
     * @param fragmentName - the name of the fragment shader file
     * @returns a dictionary of each file's content {vertexSource: string, fragmentSource: string}
     */
    let vertexRequest = new Request(`assets/glsl/${vertexName}.vert`);
    let fragmentRequest = new Request(`assets/glsl/${fragmentName}.vert`);

    await Promise.all([fetch(vertexRequest), fetch(fragmentRequest)])
    .then(function(responses){
        return Promise.all([responses[0].text(), responses[1].text()]);
    })
    .then(function(results){
        return {vertexSource: results[0], fragmentSource: results[1]};
    });
}
