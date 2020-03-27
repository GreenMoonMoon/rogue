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
export declare type point = Vector2;
export declare type rgba = Vector4;
export declare type rgb = Vector3;
export declare function addVector2(vectorA: Vector2, vectorB: Vector2): Vector2;
