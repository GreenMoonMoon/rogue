import { point } from "./utils";

let game: Game;

let gameObjects: GameObject[];
let player: GameObject;
let map: Cell[][];
let needUpdate = false;

interface Command {
    type: string;
    obj: GameObject;
    args: any[];
}

class Cell{
    tileID: number;
    obstacle: boolean;
    content: GameObject[];
    constructor(tileID: number = 0, obstacle: boolean = false, content: GameObject[] = []){
        this.tileID = tileID;
        this.obstacle = obstacle;
        this.content = content;
    }
}

// GameObject are the basis for all object contained in the game. GameObject
// instance should be viewed as interactive objects that aren't passive 
// ressources.
// They have behavior, can move, have inventories of other game objects.
export class GameObject {
    name: string;
    tileID: number;
    coordinate: point;
    
    inventory: GameObject[]
    attributes: string[] // Simple setup, could be replace with something more scalable and abstract.

    constructor(name: string, tileID: number, coordinate: point = <point>{x:0, y:0}, inventory: GameObject[] = [], attributes: string[] = []) {
        this.name = name;
        this.tileID = tileID;
        this.coordinate = coordinate;
        this.inventory = inventory;
        this.attributes = attributes;
    }

    move(x: number, y: number) {
        game.addCommand(<Command>{type:'Move', obj: this, args:[{x: this.coordinate.x + x, y: this.coordinate.y + y}]})
    }

    interact(obj: GameObject) {}
}

export class Game {
    commands: Command[];

    constructor() {
        this.commands = [];

        if(!game){
            game = this;
        }

        gameObjects = [];
        player = new GameObject("hero", 27);
        gameObjects.push(player);
        initMap();
    }

    mapRect(x: number, y: number, w: number, h: number): number[][] {
        let m: number[][] = [];
        for(let i = 0; i < h; i++){
            m[i] = [];
            for(let j = 0; j < w; j++){
                m[i][j] = map[i + y][j + x].tileID;
            }
        }
        for (let go of gameObjects) {
            // NOTES: check if object intersect with mapRect first.
            m[go.coordinate.x - x][go.coordinate.y - y] = go.tileID;
        }
        return m;
    }

    // Empty function for overriding
    update() { }

    forceUpdate(){
        needUpdate = true;
    }

    loop(){
        window.requestAnimationFrame(() => this.loop())
        if (needUpdate){
            this.executeCommands();
            this.update();
            needUpdate = false;
        }
    }

    addObject(gameObject: GameObject){
        gameObjects.push(gameObject);

        let coord = <point>gameObject.coordinate;
        map[coord.x][coord.y].content.push(gameObject);
    }

    addCommand(command: Command){
        this.commands.push(command);
    }

    private executeCommands(){
        while(this.commands.length > 0){
            let command = <Command>this.commands.pop();
            switch(command.type){
                case 'Move':
                    let coord = <point>command.args.pop();
                    let cellContent = map[coord.y][coord.x].content
                    for(let content of cellContent){
                        if(content.attributes.indexOf('obstacle') >= 0){
                            break;
                        }
                        if(content.attributes.indexOf('pickable') >= 0){
                            command.obj.inventory.push(content);
                            cellContent.splice(cellContent.indexOf(content, 1));
                            gameObjects.splice(cellContent.indexOf(content, 1));
                        }
                        if(content.attributes.indexOf('interactable') >= 0){
                            content.interact(command.obj);
                        }
                    }
                    command.obj.coordinate = coord;
                    break;
            }
        }
    }
}

export class Controller {
    constructor(keymap?: {}) {
        window.addEventListener("keydown", (event: KeyboardEvent) => this.handleKeyDown(event));
    }

    handleKeyDown(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 37:
                player.move(0, -1);
                break;
            case 38:
                player.move(-1, 0);
                break;
            case 39:
                player.move(0, 1);
                break;
            case 40:
                player.move(1, 0);
                break; ``
        }
        needUpdate = true;
    }
}

function initMap() {
    map = [];
    let mapTileIDs = [
        [52, 5, 0, 0, 0, 0, 6, 0, 0, 50],
        [52, 5, 0, 0, 0, 0, 6, 0, 0, 50],
        [52, 0, 6, 0, 0, 5, 0, 0, 5, 50],
        [52, 0, 0, 0, 0, 0, 0, 0, 6, 50],
        [52, 6, 0, 5, 0, 6, 0, 0, 0, 50],
        [52, 0, 6, 0, 5, 0, 6, 0, 0, 50],
        [52, 0, 5, 0, 6, 0, 5, 6, 0, 50],
        [52, 0, 0, 5, 0, 0, 0, 0, 5, 50],
        [52, 0, 0, 0, 6, 0, 0, 6, 0, 50],
        [146, 19, 19, 19, 19, 19, 19, 19, 19, 147]
    ];
    for(let r = 0; r < mapTileIDs.length; r++){
        map[r] = [];
        let row = mapTileIDs[r];
        for(let i = 0; i < row.length; i++){
            map[r][i] = new Cell(row[i]);
        }
    }
}