export declare class Viewport {
    private width;
    private height;
    gl: WebGL2RenderingContext;
    constructor(canvas: HTMLCanvasElement);
    draw(buffers: any, program: any, attributeLocations: any): void;
}
export declare function loadShaderSources(vertexName: string, fragmentName: string): Promise<any>;
