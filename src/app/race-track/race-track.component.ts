import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { BLOCK_SIZE, COLS, ROWS, STEP_SIZE } from '../constants';
import { Piece } from '../piece';
import { IPiece } from '../ipiece'
import { obstacle } from '../obstacles';

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
  obstacles: Piece[] = [];

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
      if (this.isValid(p)) {
        this.piece.move(p);
        this.draw();
        this.piece.draw();
      }
    }
  }

  isValid(piece: IPiece): boolean {
    // this.message = "moving to cell with value " + String(piece.x) + " " + String(piece.y);
    const inbounds: boolean = 0 < piece.x && piece.x < (COLS - 1) * BLOCK_SIZE && 0 < piece.y && piece.y < (ROWS - 1) * BLOCK_SIZE;
    if (inbounds && this.track[piece.y][piece.x] == 0) {
      return true;
    }
    return false;
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
    for (const obstacle of this.obstacles) {
      obstacle.draw();
    }
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  getEmptyTrack(): number[][] {
    return Array.from({ length: ROWS * BLOCK_SIZE }, () => Array(COLS * BLOCK_SIZE).fill(0));
  }

  play(): void {
    this.piece = new Piece(this.ctx);
    // for (let i = 0; i < BLOCK_SIZE; i++) {
    //   for (let j = 0; j < BLOCK_SIZE; j++) {
    //     this.track[this.piece.y + j][this.piece.x + i] = 1;
    //   }
    // }
    this.piece.draw();

    this.obstacles.push(new Piece(this.ctx));
    for (const obstacle of this.obstacles) {
      obstacle.randomPlacement();
      obstacle.color = "red";
      // for (let i = 0; i < BLOCK_SIZE; i++) {
      //   for (let j = 0; j < BLOCK_SIZE; j++) {
      //     this.track[obstacle.y + j][obstacle.x + i] = 2;
      //   }
      // }
      obstacle.draw();
    }
    this.message = String(this.track);


    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }

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


