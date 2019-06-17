import { point, Vector2 } from "./utils";

interface Command {
    type: string;
    obj: Entity;
    args: any[];
}

class Map {
    id: number;
    cells: Cell[][];
    width: number;
    height: number

    constructor(id: number, cells: Cell[][], width: number, height: number) {
        this.id = id;
        this.cells = cells;
        this.width = 0;
        this.height = 0;
    }

    canMoveTo(coordinate: point): boolean {
        if (coordinate.x < 0 || coordinate.x > this.width) return false;
        if (coordinate.y < 0 || coordinate.y > this.height) return false;
        return true;
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
class Entity {
    name: string;
    game: Game;
    coordinate: point;
    inventory: Entity[];
    private components: IComponent[];

    constructor(name: string, game: Game, coordinate: point = <point>{ x: 0, y: 0 }, inventory: Entity[] = []) {
        this.name = name;
        this.game = game;
        this.coordinate = coordinate;
        this.inventory = inventory;
        this.components = [];
    }

    addComponent(component: IComponent) {
        component.entity = this;
        this.components.push(component);
    }

    move(movement: Vector2) {
        this.game.addCommand(<ICommand>{ type: "move", entity: this, args: movement })
    }
}

export class Game {
    private map: Cell[][];
    private entities: Entity[];
    private controllers: Controller[];
    private graphics: Graphic[];
    private commands: ICommand[];

    constructor() {
        this.map = [];
        this.entities = [];
        this.controllers = [];
        this.graphics = [];
        this.commands = [];

        let player = new Entity("hero", this, <point>{ x: 0, y: 0 });
        let controller = new Controller()
        this.controllers.push(controller)
        player.addComponent(controller);
        let graphic = new Graphic(27)
        this.graphics.push(graphic)
        player.addComponent(graphic);
        this.entities.push(player);
    }

    addObject(entity: Entity) {
        this.entities.push(entity);

        let coord = <point>entity.coordinate;
        this.map[coord.x][coord.y].content.push(entity);
    }

    addCommand(command: ICommand) {
        this.commands.push(command);
    }

    displayRect(x: number, y: number, w: number, h: number): number[][] {
        let m: number[][] = [];
        for (let i = 0; i < h; i++) {
            m[i] = [];
            for (let j = 0; j < w; j++) {
                m[i][j] = this.map[i + y][j + x].tileID;
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

    createMap(width: number, height: number) {
        let newMap: Cell[][] = [];
        for (let h = 0; h < height; h++) {
            newMap[h] = [];
            for (let w = 0; w < width; w++) {
                newMap[h][w] = new Cell(0);
            }
        }

        this.map = newMap;
    }

    executeCommand() {
        for (let command of this.commands) {
            switch (command.type) {
                case "move":
                    if (this.map.canMoveTo(command.args)) {
                        command.entity.coordinate.x += (<Vector2>command.args).x;
                        command.entity.coordinate.y += (<Vector2>command.args).y;
                    }
                    break;
            }
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

interface ICommand {
    type: string;
    entity: Entity;
    args: any;
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

        entity.move(movement);
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