class GLViewer {
    context: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.context = <WebGL2RenderingContext>canvas.getContext("webgl2");
        this.context.clearColor(1.0, 1.0, 1.0, 1.0);
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }
}

function main
{
    let canvas = <HTMLCanvasElement>document.querySelector("#game-canvas");
    let viewer = new GLViewer(canvas);
}

window.onload = main;