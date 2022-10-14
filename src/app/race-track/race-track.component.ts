import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { BLOCK_SIZE, COLS, ROWS, STEP_SIZE } from '../constants';
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
  requestId: number = 0;

  message: string = "";

  moves = {
    "j": (p: IPiece): IPiece => ({ ...p, x: p.x - STEP_SIZE }),
    "l": (p: IPiece): IPiece => ({ ...p, x: p.x + STEP_SIZE }),
    "i": (p: IPiece): IPiece => ({ ...p, y: p.y - STEP_SIZE }),
    "k": (p: IPiece): IPiece => ({ ...p, y: p.y + STEP_SIZE })
  };

  keys_pressed =
    {
      "j": false,
      "l": false,
      "i": false,
      "k": false
    };

  @HostListener('window:keydown', ['$event'])
  keyEventDown(event: KeyboardEvent): void {
    if (event.key in this.keys_pressed) {
      this.keys_pressed[event.key as keyof typeof this.keys_pressed] = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent): void {
    if (event.key in this.keys_pressed) {
      this.keys_pressed[event.key as keyof typeof this.keys_pressed] = false;
    }
  }

  reactToKeys(): void {
    const keys = Object.keys(this.keys_pressed).filter(key => this.keys_pressed[key as keyof typeof this.keys_pressed]);
    for (const key of keys) {
      const p = this.moves[key as keyof typeof this.keys_pressed](this.piece);
      this.piece.move(p);
      this.draw();
      this.piece.draw();
      // }
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

  animate() {
    this.reactToKeys();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  getEmptyTrack(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  play(): void {
    this.track = this.getEmptyTrack();
    this.piece = new Piece(this.ctx);
    this.piece.draw();
    this.animate();
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    //drawing a line around the canvas
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#000000";
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  }



}


