export enum cellValue {
    empty,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb
}

export enum cellState {
    open,
    visible,
    flagged
}

export type cell = {value: cellValue, state: cellState, red?: boolean};
export enum face {
    mine = '💣',
    flag = '🚩',
    lost = '😵',
    won = '🥳',
    happy = '😺'
}