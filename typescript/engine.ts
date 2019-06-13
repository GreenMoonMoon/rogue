import { point } from "./utils";

let game: Game;

let gameObjects: GameObject[];
let player: GameObject;
let map: Cell[][];
let needUpdate = false;
let maps: Map[];
let objects: {};
let tileset: ImageData;

interface Command {
    type: string;
    obj: GameObject;
    args: any[];
}

interface Map {
    name: string;
    cells: Cell[][];
}

class Cell {
    tileID: number;
    obstacle: boolean;
    content: GameObject[];
    constructor(tileID: number = 0, obstacle: boolean = false, content: GameObject[] = []) {
        this.tileID = tileID;
        this.obstacle = obstacle;
        this.content = content;
    }
}

// GameObject are the basis for all object contained in the game. GameObject
// instance should be viewed as interactive objects that aren't passive 
// ressources.
// They have behavior, can move, have inventories of other game objects.
class GameObject {
    name: string;
    tileID: number;
    coordinate: point;

    inventory: GameObject[]
    attributes: string[] // Simple setup, could be replace with something more scalable and abstract.

    constructor(name: string, tileID: number, coordinate: point = <point>{ x: 0, y: 0 }, inventory: GameObject[] = [], attributes: string[] = []) {
        this.name = name;
        this.tileID = tileID;
        this.coordinate = coordinate;
        this.inventory = inventory;
        this.attributes = attributes;
    }

    move(x: number, y: number) {
        game.addCommand(<Command>{ type: 'Move', obj: this, args: [{ x: this.coordinate.x + x, y: this.coordinate.y + y }] })
    }

    interact(obj: GameObject) { }
}

export class Game {
    commands: Command[];

    constructor() {
        this.commands = [];

        if (!game) {
            game = this;
        }

        gameObjects = [];
        player = new GameObject("hero", 27);
        gameObjects.push(player);
    }

    private loop() {
        window.requestAnimationFrame(() => this.loop())
        if (needUpdate) {
            this.executeCommands();
            needUpdate = false;
        }
    }

    private executeCommands() {
        while (this.commands.length > 0) {
            let command = <Command>this.commands.pop();
            switch (command.type) {
                case 'Move':
                    let coord = <point>command.args.pop();
                    let cellContent = map[coord.y][coord.x].content
                    for (let content of cellContent) {
                        if (content.attributes.indexOf('obstacle') >= 0) {
                            break;
                        }
                        if (content.attributes.indexOf('pickable') >= 0) {
                            command.obj.inventory.push(content);
                            cellContent.splice(cellContent.indexOf(content, 1));
                            gameObjects.splice(cellContent.indexOf(content, 1));
                        }
                        if (content.attributes.indexOf('interactable') >= 0) {
                            content.interact(command.obj);
                        }
                    }
                    command.obj.coordinate = coord;
                    break;
            }
        }
    }

    addObject(gameObject: GameObject) {
        gameObjects.push(gameObject);

        let coord = <point>gameObject.coordinate;
        map[coord.x][coord.y].content.push(gameObject);
    }

    addCommand(command: Command) {
        this.commands.push(command);
    }

    mapRect(x: number, y: number, w: number, h: number): number[][] {
        let m: number[][] = [];
        for (let i = 0; i < h; i++) {
            m[i] = [];
            for (let j = 0; j < w; j++) {
                m[i][j] = map[i + y][j + x].tileID;
            }
        }
        for (let go of gameObjects) {
            // NOTES: check if object intersect with mapRect first.
            m[go.coordinate.x - x][go.coordinate.y - y] = go.tileID;
        }
        return m;
    }

    forceUpdate() {
        needUpdate = true;
    }

    initMap(importedMap: Cell[][]) {
        map = importedMap;
    }

    createMap(width: number, height: number) {
        let newMap: Cell[][] = [];
        for (let h = 0; h < height; h++) {
            newMap[h] = [];
            for (let w = 0; w < width; w++) {
                newMap[h][w] = new Cell(0);
            }
        }

        this.initMap(newMap);
    }
}

export class Controller {
    player: any;

    constructor(player: any, keymap?: {}) {
        this.player = player;
        if(keymap){
            this.initKeymap(keymap);
        }

        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
    }

    private initKeymap(keymap: {}){
        return;
    }

    handleKeyDown(event: KeyboardEvent) {
        let movement = {x:0, y:0};
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
                break; ``
        }
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

export namespace Component {
    class Input {
        constructor() { };
    }
    class Renderable {
        // has id to specify which viewport has to render this componenet.
        constructor() { }
    }
}