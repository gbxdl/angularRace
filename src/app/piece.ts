import { BLOCK_SIZE } from './constants';
import { IPiece } from './ipiece';

export class Piece implements IPiece {
    x: number = 0;
    y: number = 0;
    color: string = "black";
    shape: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    constructor(private ctx: CanvasRenderingContext2D) {
        this.spawn(ctx);
    }

    spawn(ctx: CanvasRenderingContext2D) {
        this.color = "blue";
        this.shape = [[2, 0, 0], [2, 2, 2], [0, 0, 0]];
        this.x = ctx.canvas.width / 2;
        this.y = ctx.canvas.height / 2;
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
}
