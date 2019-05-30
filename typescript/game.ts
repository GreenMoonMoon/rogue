import { point } from "./utils";

let gameObjects: GameObject[];
let player: GameObject;
let map: number[][];
let needUpdate = false;

class GameObject {
    name: string;
    tileID: number;
    coordinate: point;
    constructor(name: string, tileID: number) {
        this.name = name;
        this.tileID = tileID;
        this.coordinate = { x: 0, y: 0 };
    }

    move(x: number, y: number) {
        this.coordinate.x += x;
        this.coordinate.y += y;
    }
}

export class Game {
    constructor() {
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
                m[i][j] = map[i + y][j + x];
            }
        }
        for (let go of gameObjects) {
            m[go.coordinate.x - x][go.coordinate.y - y] = go.tileID;
        }
        return m;
    }

    update() { }

    forceUpdate(){
        needUpdate = true;
    }

    loop(){
        window.requestAnimationFrame(() => this.loop())
        if (needUpdate){
            this.update();
            needUpdate = false;
        }
    }

    addObject(gameObject: {}){
        // Is this acceptable? I doupt it. Maybe I should expose the GameObject class.
        gameObjects.push(<GameObject>gameObject);
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
    map = [
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
}