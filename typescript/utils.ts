export interface Vector2 {
    x: number;
    y: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;
}

export type point = Vector2;
export type rgba = Vector4;
export type rgb = Vector3;

export function addVector2(vectorA: Vector2, vectorB: Vector2): Vector2 {
    return <Vector2>{ x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
}