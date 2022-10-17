import { BLOCK_SIZE, COLS, ROWS } from './constants';
import { IPiece } from './ipiece';

export class Piece implements IPiece {
    x: number = 0;
    y: number = 0;
    color: string = "red";

    constructor() {
        this.spawn();
    }

    spawn() {
        this.color = "blue";
        this.x = COLS / 2;
        this.y = ROWS - 1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    move(piece: IPiece): void {
        this.x = piece.x;
        this.y = piece.y;
    }

    randomPlacement(track: number[][]) {
        while (track[this.y][this.x] != 0) {
            this.x = Math.floor(Math.random() * COLS);
            this.y = Math.floor(Math.random() * ROWS);
        }
    }
}
