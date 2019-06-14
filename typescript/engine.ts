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

// GameObject are the basis for all object contained in the game. GameObject
// instance should be viewed as interactive objects that aren't passive 
// ressources.
// They have behavior, can move, have inventories of other game objects.
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
    private controller: Controller;
    private objects: Object[];
    private map: Map;
    private commands: Command[];
    private player: Entity;

    constructor() {
        this.controller = new Controller();
        this.objects = [];
        this.map = new Map();
        this.commands = [];

        this.player = new Entity("hero", x: 0, y: 0);
        this.player.addComponent(new Controller());
        this.player.addComponent(new Graphic(27));
        this.objects.push(player);
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

    addObject(gameObject: Entity) {
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

interface IComponent {

}

export class Controller implements IComponent {
    constructor(player: any, keymap?: {}) {
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

}
