import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { BLOCK_SIZE, COLS, ROWS } from '../constants';
import { Piece } from '../piece';
import { IPiece } from '../ipiece'

@Component({
  selector: 'race-track',
  templateUrl: './race-track.component.html',
  styleUrls: ['./race-track.component.css']
})
export class RaceTrackComponent implements OnInit {
  @ViewChild('track', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  points: number = 0;
  lines: number = 0;
  level: number = 0;
  track: number[][] = this.getEmptyTrack();
  piece!: Piece;

  message: string = "";

  moves = {
    "j": (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
    "l": (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
    "i": (p: IPiece): IPiece => ({ ...p, y: p.y - 1 }),
    "k": (p: IPiece): IPiece => ({ ...p, y: p.y + 1 })
  };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.message = "pressed key: " + event.key;
    if (event.key in this.moves) {
      // If the keyCode exists in our moves stop the event from bubbling.
      // event.preventDefault();
      const p = this.moves[event.key as keyof typeof this.moves](this.piece);
      this.piece.move(p);

      this.draw();
      this.piece.draw();
    }
  }

  ngOnInit(): void {
    this.initTrack();
    this.draw();
  }

  initTrack(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

  }

  getEmptyTrack(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  play(): void {
    this.track = this.getEmptyTrack();
    this.piece = new Piece(this.ctx);
    this.piece.draw();
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    //drawing a line around the canvas
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  }



}


