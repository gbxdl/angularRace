import { BLOCK_SIZE, COLS, ROWS } from './constants';
import { IPiece } from './ipiece';

export class Piece implements IPiece {
    x: number = 0;
    y: number = 0;
    color: string = "red";
    shape: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    constructor(private ctx: CanvasRenderingContext2D) {
        this.spawn(ctx);
    }

    spawn(ctx: CanvasRenderingContext2D) {
        this.color = "blue";
        // this.shape = [[2, 0, 0], [2, 2, 2], [0, 0, 0]];
        this.x = ctx.canvas.width / 2;
        this.y = ctx.canvas.height - BLOCK_SIZE - 1;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                this.ctx.fillRect(this.x + x, this.y + y, BLOCK_SIZE, BLOCK_SIZE);
            });
        });
    }

    move(piece: IPiece): void {
        this.x = piece.x;
        this.y = piece.y;
        this.shape = piece.shape;
    }

    randomPlacement() {
        this.x = Math.floor(Math.random() * COLS * BLOCK_SIZE);
        this.y = Math.floor(Math.random() * ROWS * BLOCK_SIZE);
    }
}
