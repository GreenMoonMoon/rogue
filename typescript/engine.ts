import { point } from "./utils";

interface Command {
    type: string;
    obj: Entity;
    args: any[];
}

interface Map {
    name: string;
    cells: Cell[][];
}

class Cell {
    tileID: number;
    obstacle: boolean;
    content: Entity[];
    constructor(tileID: number = 0, obstacle: boolean = false, content: Entity[] = []) {
        this.tileID = tileID;
        this.obstacle = obstacle;
        this.content = content;
    }
}

// Entities can contain other entities. A tree of entities with the top level being the one shown.
class Entity {
    name: string;
    coordinate: point;
    inventory: Entity[];
    private components: IComponent[];

    constructor(name: string, coordinate: point = <point>{ x: 0, y: 0 }, inventory: Entity[] = []) {
        this.name = name;
        this.coordinate = coordinate;
        this.inventory = inventory;
        this.components = [];
    }

    addComponent(component: IComponent) {
        this.components.push(component);
    }
}

export class Game {
    private map: Cell[][];
    private objects: Object[];

    constructor() {
        this.map = [];
        this.objects = [];

        let player = new Entity("hero", <point>{ x: 0, y: 0 });
        player.addComponent(new Controller());
        player.addComponent(new Graphic(27));
        this.objects.push(player);
    }

    addObject(gameObject: Entity) {
        this.objects.push(gameObject);

        let coord = <point>gameObject.coordinate;
        this.map[coord.x][coord.y].content.push(gameObject);
    }

    mapRect(x: number, y: number, w: number, h: number): number[][] {
        let m: number[][] = [];
        for (let i = 0; i < h; i++) {
            m[i] = [];
            for (let j = 0; j < w; j++) {
                m[i][j] = this.map[i + y][j + x].tileID;
            }
        }
        return m;
    }

    createMap(width: number, height: number) {
        let newMap: Cell[][] = [];
        for (let h = 0; h < height; h++) {
            newMap[h] = [];
            for (let w = 0; w < width; w++) {
                newMap[h][w] = new Cell(39);
            }
        }

        this.map = newMap;
    }
}

export class Ressources {
    tilesets: any;
    maps: any;
    objects: any
    constructor(ressources?: string[]) {
        this.tilesets = {};
    }

    async loadTileset(tilesetName: string): Promise<ImageBitmap> {
        const response = await fetch(`../assets/tilesheet/${tilesetName}.png`);
        return response.blob().then((blob: Blob) => {
            return createImageBitmap(blob);
        });
    }

    async loadJson(JsonName: string): Promise<string> {
        const response = await fetch(`../assets/data/${JsonName}.json`);
        return response.json();
    }
}

interface IComponent { }

export class Controller implements IComponent {
    constructor(keymap?: {}) {
        if (keymap) {
            this.initKeymap(keymap);
        }
        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
    }

    private initKeymap(keymap: {}) {
        return;
    }

    handleKeyDown(event: KeyboardEvent) {
        let movement = { x: 0, y: 0 };
        switch (event.keyCode) {
            case 37:
                movement.y = -1;
                break;
            case 38:
                movement.x = -1;
                break;
            case 39:
                movement.y = 1;
                break;
            case 40:
                movement.x = 1;
                break;
        }
    }
}

export class Graphic implements IComponent {
    tileID: number;
    constructor(tileID: number) {
        this.tileID = tileID;
    }
}
