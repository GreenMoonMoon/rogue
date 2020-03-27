import { point } from "./utils.js";
declare type chunk = Cell[][];
export declare class Level {
    chunks: chunk[];
    width: number;
    height: number;
    constructor(width?: number, chunks?: chunk[]);
    canMoveTo(coordinate: point): boolean;
    load(data: any): void;
}
declare class Cell {
    tileID: number;
    obstacle: boolean;
    content: Entity[];
    constructor(tileID?: number, obstacle?: boolean, content?: Entity[]);
}
export declare class Entity {
    name: string;
    game: Game | null;
    coordinate: point;
    inventory: Entity[];
    components: IComponent[];
    zIndex: number;
    constructor(name: string, coordinate?: point, inventory?: Entity[]);
    addComponent(component: IComponent): void;
}
export declare class Game {
    private map;
    private entities;
    private controllers;
    private graphics;
    constructor();
    addEntity(entity: Entity): void;
    displayRect(x: number, y: number, w: number, h: number): number[][];
    createMap(tiles: number[][][], width: number): void;
    loop(delta: number): void;
    setLevel(jsonData: any): void;
    newPlayer(): void;
}
export declare class Ressources {
    tilesets: ImageBitmap[];
    levels: any[];
    objects: any[];
    constructor(ressources?: string[]);
    loadTileset(tilesetName: string): void;
    loadLevel(levelName: String): void;
}
interface IComponent {
    entity: Entity | null;
}
export declare class Controller implements IComponent {
    entity: Entity | null;
    constructor(keymap?: {});
    private initKeymap;
    handleKeyDown(event: KeyboardEvent): void;
}
export declare class Graphic implements IComponent {
    entity: Entity | null;
    tileID: number;
    constructor(tileID: number);
}
export {};
