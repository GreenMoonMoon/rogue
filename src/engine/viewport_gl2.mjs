class WebGL2Viewer {
    /**
     * The WebGL2 viewer will render the game scene to a quad trough a fragment shader using webgl2.
     * @param {HTMLCanvasElement} canvas 
     * @param {number} scale - The given scale of the viewport, ratio of how many pixel a texel will take. 
     */
    constructor(canvas) {
        this.gl = canvas.getContext('webgl2');
        if (!this.gl)
            throw new Error('WebGL2 is not available');
        this.resizeCanvas(canvas);
        this.gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    async loadShaders(vertexShaderName, fragmentShaderName) {
        let shaderSources = await this.loadShaderSources('basic', 'basic');

        this.program = this.createProgram(shaderSources.vertex, shaderSources.fragment);
        this.defaultVAO = this.createDefaultVAO(this.program);
    }

    createProgram(vertexSource, fragmentSource) {
        let vertexShader = this.createShader(vertexSource, this.gl.VERTEX_SHADER);
        let fragmentShader = this.createShader(fragmentSource, this.gl.FRAGMENT_SHADER)

        let program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
            return program;

        let error = new Error(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
        throw error;
    }

    createShader(source, type) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
            return shader

        let error = new Error(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
        throw error;
    }

    createDefaultVAO(program) {
        let positionAttributeLocation = this.gl.getAttribLocation(program, 'aVertexPosition');
        let positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        let positions = [
            0, 0,
            0, 0.5,
            0.7, 0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        let vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    async loadShaderSources(vertexName, fragmentName) {
        let vertexRequest = new Request(`assets/glsl/${vertexName}.vert`);
        let fragmentRequest = new Request(`assets/glsl/${fragmentName}.frag`);
        return await Promise.all([fetch(vertexRequest), fetch(fragmentRequest)])
        .then(function (responses) {
            return Promise.all([responses[0].text(), responses[1].text()]);
        })
        .then(function (results) {
            return { vertex: results[0], fragment: results[1] };
        });
    }
}

function draw(gl, program, vao) {
    gl.clearColor(1, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Clear any binding once finished with a vertexArray.
    gl.bindVertexArray(null);
}

async function WebGLDraw(canvas, vertexName, fragmentName) {
    let gl = canvas.getContext('webgl2');
    let width  = canvas.clientWidth;
    canvas.width = width;
    let height = canvas.clientHeight;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    
    let vertexRequest = new Request(`assets/glsl/${vertexName}.vert`);
    let fragmentRequest = new Request(`assets/glsl/${fragmentName}.frag`);
    
    let shaderSources = await Promise.all([fetch(vertexRequest), fetch(fragmentRequest)])
    .then(function (responses) {
        return Promise.all([responses[0].text(), responses[1].text()]);
    })
    .then(function (results) {
        return { vertex: results[0], fragment: results[1] };
    });

    let program = loadProgram(gl, shaderSources.vertex, shaderSources.fragment);
    
    let positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
        -1, -1,
        -1, 1,
        1, -1,
        1, -1,
        -1, 1,
        1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.useProgram(program);
    
    let resolutionUniformLocation = gl.getUniformLocation(program, 'uResolution');
    gl.uniform2fv(resolutionUniformLocation, [300, 300]);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function loadProgram(gl, vertexSource, fragmentSource) {
    let vertexShader = loadShader(gl, vertexSource, gl.VERTEX_SHADER);
    let fragmentShader = loadShader(gl, fragmentSource, gl.FRAGMENT_SHADER)

    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS))
        return program;

    let error = new Error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw error;
}

function loadShader(gl, source, type) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader

    let error = new Error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw error;
}

export { WebGL2Viewer, WebGLDraw };