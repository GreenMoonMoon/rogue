import { point, Vector2, addVector2 } from "./utils.js";

const CHUNK_SIZE = 16;

type chunk = Cell[][];


export class Level {
    chunks: chunk[];
    width: number;
    height: number;

    constructor(width?: number, chunks?: chunk[]) {
        this.chunks = chunks ? chunks : [];
        this.width = width ? width : 0;
        this.height = width ? (this.chunks.length / this.width) : 0;
    }

    canMoveTo(coordinate: point): boolean {
        let chunkID = Math.floor(coordinate.y / CHUNK_SIZE) * this.width + Math.floor(coordinate.x / CHUNK_SIZE);

        if (coordinate.x < 0 || coordinate.x > (CHUNK_SIZE * this.width)) return false;
        if (coordinate.y < 0 || coordinate.y > (CHUNK_SIZE * this.height)) return false;
        return true;
    }

    load(data: any){

    }
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
export class Entity {
    name: string;
    game: Game | null;
    coordinate: point;
    inventory: Entity[];
    components: IComponent[];
    zIndex: number;

    constructor(name: string, coordinate: point = <point>{ x: 0, y: 0 }, inventory: Entity[] = []) {
        this.name = name;
        this.game = null;
        this.coordinate = coordinate;
        this.inventory = inventory;
        this.components = [];
        this.zIndex = 0;
    }

    addComponent(component: IComponent) {
        component.entity = this;
        this.components.push(component);
    }
}

export class Game {
    private map: Level | null;
    private entities: Entity[];
    private controllers: Controller[];
    private graphics: Graphic[];

    constructor() {
        this.map = null;
        this.entities = [];
        this.controllers = [];
        this.graphics = [];
    }

    addEntity(entity: Entity) {
        entity.game = this;
        if (entity.components.length) {
            for (let component of entity.components) {
                switch (true) {
                    case (component instanceof Controller):
                        this.controllers.push(<Controller>component);
                        break;
                    case (component instanceof Graphic):
                        this.graphics.push(<Graphic>component);
                        break;
                }
            }
        }
        this.entities.push(entity);
    }

    displayRect(x: number, y: number, w: number, h: number): number[][] {
        let m: number[][] = [];
        let cells = (<Level>this.map).cells;
        for (let i = 0; i < h; i++) {
            m[i] = [];
            for (let j = 0; j < w; j++) {
                m[i][j] = cells[i + y][j + x].tileID;
            }
        }

        for (let graphic of this.graphics) {
            let entity = <Entity>graphic.entity;
            if (entity.coordinate.x < x) continue;
            if (entity.coordinate.y < y) continue;
            if (entity.coordinate.x >= x + w) continue;
            if (entity.coordinate.y >= y + h) continue;
            m[entity.coordinate.y - y][entity.coordinate.x - x] = graphic.tileID;
        }

        return m;
    }

    createMap(tiles: number[][][], width: number) {
        let chunks: chunk[] = [];

        for (let chuckTiles of tiles) {
            let cells: Cell[][] = [];

            let height = tiles.length;
            for (let h = 0; h < height; h++) {
                cells[h] = [];
                for (let w = 0; w < width; w++) {
                    cells[h][w] = new Cell(tiles[h][w]);
                }
            }
        }

        this.map = new Level(0, width, chunks);
    }

    loop(delta: number) {
        requestAnimationFrame(this.loop);
    }

    setLevel(jsonData: any){

    }

    newPlayer(){

    }
}
export class Ressources {
    tilesets: any;
    maps: any;
    objects: any
    constructor(ressources?: string[]) {
        this.tilesets = {};
    }

    loadTileset(tilesetName: string): ImageBitmap {
        const response = await fetch(`../assets/tilesheet/${tilesetName}.png`);
        const tilesetImage = await response.blob().then((blob: Blob) => {
            return createImageBitmap(blob);
        }

        return tilesetImage;
    }


    loadLevel(levelName: String): any {
                    async loadJSONdata(JsonName: string): Promise<string> {
                        const response = await fetch(`../assets/data/${JsonName}.json`);
                        return response.json().then((jsonData: any) => {
                            return jsonData;
                        });
                    }
                }
            }
    // await ressources.loadTileset("colored").then((tileset: ImageBitmap) => {
    //     viewport.setTileset(tileset);
    // })

    // await ressources.loadJSONdata("levels").then((jsonData: any) => {
    //     level.load(jsonData);
    // })
}

interface IComponent {
    entity: Entity | null;
}

export class Controller implements IComponent {
    entity: Entity | null;
    constructor(keymap?: {}) {
        this.entity = null;
        if (keymap) {
            this.initKeymap(keymap);
        }
        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
    }

    private initKeymap(keymap: {}) {
        return;
    }

    handleKeyDown(event: KeyboardEvent) {
        let entity = <Entity>this.entity;
        let movement = { x: 0, y: 0 };
        switch (event.keyCode) {
            case 37:
                movement.x = -1;
                break;
            case 38:
                movement.y = -1;
                break;
            case 39:
                movement.x = 1;
                break;
            case 40:
                movement.y = 1;
                break;
        }
    }
}

export class Graphic implements IComponent {
    entity: Entity | null;
    tileID: number;
    constructor(tileID: number) {
        this.entity = null;
        this.tileID = tileID;
    }
}