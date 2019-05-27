// export class Vector2 {
//     x: number;
//     y: number;
//     constructor(x: number, y: number) {
//         this.x = x;
//         this.y = y;
//     }
// }

// export class Vector3 {
//     x: number;
//     y: number;
//     z: number;
//     constructor(x: number, y: number, z: number) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//     }
// }

// export class Vector4 {
//     x: number;
//     y: number;
//     z: number;
//     w: number;
//     constructor(x: number, y: number, z: number, w: number) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//         this.w = w;
//     }
// }

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