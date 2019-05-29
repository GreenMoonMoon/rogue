import { point } from "./utils";

let player: GameObject;
let gameObjects: GameObject[];

class GameObject{
    tileID: number;
    coordinate: point
    constructor(tileID: number){
        this.tileID = tileID
        this.coordinate = {x: 0, y: 0}
    }
}

export class Game{
    constructor(){}

    runSteps(){
        
    }

    mapRect(x: number, y: number, w: number, h: number): number[][]{
        return [];
    }
}