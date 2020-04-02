const CHUNK_SIZE = 16;
class Level {
    constructor(width, chunks) {
        this.chunks = chunks ? chunks : [];
        this.width = width ? width : 0;
        this.height = width ? (this.chunks.length / this.width) : 0;
    }
    canMoveTo(coordinate) {
        let chunkID = Math.floor(coordinate.y / CHUNK_SIZE) * this.width + Math.floor(coordinate.x / CHUNK_SIZE);
        if (coordinate.x < 0 || coordinate.x > (CHUNK_SIZE * this.width))
            return false;
        if (coordinate.y < 0 || coordinate.y > (CHUNK_SIZE * this.height))
            return false;
        return true;
    }
    load(data) {
    }
}
class Cell {
    constructor(tileID = 0, obstacle = false, content = []) {
        this.tileID = tileID;
        this.obstacle = obstacle;
        this.content = content;
    }
}
class Entity {
    constructor(name, coordinate = { x: 0, y: 0 }, inventory = []) {
        this.name = name;
        this.game = null;
        this.coordinate = coordinate;
        this.inventory = inventory;
        this.components = [];
        this.zIndex = 0;
    }
    addComponent(component) {
        component.entity = this;
        this.components.push(component);
    }
}
class Game {
    constructor() {
        this.map = null;
        this.entities = [];
        this.controllers = [];
        this.graphics = [];
    }
    addEntity(entity) {
        entity.game = this;
        if (entity.components.length) {
            for (let component of entity.components) {
                switch (true) {
                    case (component instanceof Controller):
                        this.controllers.push(component);
                        break;
                    case (component instanceof Graphic):
                        this.graphics.push(component);
                        break;
                }
            }
        }
        this.entities.push(entity);
    }
    displayRect(x, y, w, h) {
        let m = [];
        let cells = this.map.chunks[0];
        for (let i = 0; i < h; i++) {
            m[i] = [];
            for (let j = 0; j < w; j++) {
                m[i][j] = cells[i + y][j + x].tileID;
            }
        }
        for (let graphic of this.graphics) {
            let entity = graphic.entity;
            if (entity.coordinate.x < x)
                continue;
            if (entity.coordinate.y < y)
                continue;
            if (entity.coordinate.x >= x + w)
                continue;
            if (entity.coordinate.y >= y + h)
                continue;
            m[entity.coordinate.y - y][entity.coordinate.x - x] = graphic.tileID;
        }
        return m;
    }
    createMap(tiles, width) {
        let chunks = [];
        for (let chuckTiles of tiles) {
            let cells = [];
            let height = tiles.length;
            for (let h = 0; h < height; h++) {
                cells[h] = [];
                for (let w = 0; w < width; w++) {
                    cells[h][w] = new Cell;
                }
            }
        }
        this.map = new Level(0, chunks);
    }
    loop(delta) {
        requestAnimationFrame(this.loop);
    }
    setLevel(jsonData) {
    }
    newPlayer() {
    }
}
class Ressources {
    constructor(ressources) {
        this.tilesets = [];
        this.levels = [];
        this.objects = [];
    }
    loadTileset(tilesetName) {
        let tempImage = createImageBitmap(new Image());
        const promise = fetch(`../assets/tilesheet/${tilesetName}.png`);
        promise.then(function (response) {
            return response.blob();
        }).then(function (blob) {
            return createImageBitmap(blob);
        }).then((tilesetImage) => {
            this.tilesets.push(tilesetImage);
        });
    }
    loadLevel(levelName) {
        const promise = fetch(`../assets/levels/${levelName}.json`);
        promise.then(function (response) {
            return response.json();
        }).then((json) => {
            this.levels.push(json);
        });
    }
}
class Controller {
    constructor(keymap) {
        this.entity = null;
        if (keymap) {
            this.initKeymap(keymap);
        }
        window.addEventListener("keydown", (event) => this.handleKeyDown(event));
    }
    initKeymap(keymap) {
        return;
    }
    handleKeyDown(event) {
        let entity = this.entity;
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
class Graphic {
    constructor(tileID) {
        this.entity = null;
        this.tileID = tileID;
    }
}

class Viewport {
    /**
     * A viewport trought which a scene can be rendered.
     * @param {CanvasViewer|WebGLViewer|WebGL2Viewer} viewer - The viewer to which the given scene will be rendered.
     */
    constructor(viewer) {
        this.viewer = viewer;
    }
    draw(){
        
    }
}

export { Viewport };