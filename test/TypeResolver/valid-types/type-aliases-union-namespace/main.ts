export interface MyModel {
    direction: Cardinal;
}

export namespace Cardinal {
    export const EAST: 'east' = 'east';
    export const NORTH: 'north' = 'north';
    export const SOUTH: 'south' = 'south';
    export const WEST: 'west' = 'west';
}

export type Cardinal = typeof Cardinal.NORTH | typeof Cardinal.SOUTH | typeof Cardinal.EAST | typeof Cardinal.WEST;
