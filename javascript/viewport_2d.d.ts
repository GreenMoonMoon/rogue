export declare class Viewport {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    tileset: ImageBitmap | null;
    tilesize: number;
    width: number;
    height: number;
    id: number;
    rowWidth: number;
    constructor(id: number, canvas: HTMLCanvasElement, width: number, height: number, zoom: number);
    update(xTiles: number, yTiles: number, tilesize: number, zoom: number): void;
    draw(map: number[][]): void;
    clear(): void;
    setTileset(tileset: ImageBitmap): void;
}
