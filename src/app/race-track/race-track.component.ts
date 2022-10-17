import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { BLOCK_SIZE, COLS, MAX_POINTS_LEVEL, ROWS, STEP_SIZE } from '../constants';
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
  maxPointsLevel: number = MAX_POINTS_LEVEL;
  levelTimer!: number;
  level: number = 1;
  score: number = 0;
  highScores: number[] = [];
  hp: number = 100;
  track: number[][] = this.getEmptyTrack();
  player!: Piece;
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
      const p = this.moves[key as keyof typeof this.keys_pressed](this.player);
      if (this.isValid(p)) {
        this.player.move(p);
      }
      else {
        this.maxPointsLevel -= 10;
        this.hp -= 1;
      }
    }
  }

  isValid(piece: IPiece): boolean {
    this.message = "moving to cell with value " + String(piece.x) + " " + String(piece.y);
    const inbounds: boolean = 0 < piece.x && piece.x < COLS && 0 < piece.y && piece.y < ROWS;
    if (inbounds && this.track[piece.y][piece.x] == 0) {
      return true;
    }
    return false;
  }

  isGameover(): boolean {
    return this.hp < 1;
  }

  ngOnInit(): void {
    this.initCanvas();
    this.drawCanvas();
  }

  initCanvas(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
  }

  animate() {
    this.reactToKeys();
    this.drawCanvas();
    this.player.draw(this.ctx);
    for (const obstacle of this.obstacles) {
      obstacle.draw(this.ctx);
    }
    if (this.player.y <= 1) {
      this.nextLevel();
    }
    if (!this.isGameover()) {
      this.requestId = requestAnimationFrame(this.animate.bind(this));
      this.highScores.push(this.score);
      this.highScores.sort();
      this.highScores = this.highScores.length < 5 ? this.highScores : this.highScores.slice(4);
    }
  }

  getEmptyTrack(): number[][] {
    // return Array(ROWS).fill(Array(COLS).fill(0));
    return Array.from(Array(ROWS), () => Array(COLS).fill(0));
  }

  nextLevel(): void {
    const expiredTimeDecaSeconds = Math.floor((Date.now() - this.levelTimer) / 100);
    this.score += expiredTimeDecaSeconds < this.maxPointsLevel ? this.maxPointsLevel - expiredTimeDecaSeconds : 1;
    this.levelTimer = Date.now();
    this.maxPointsLevel = MAX_POINTS_LEVEL;
    this.player.y = ROWS - 1;

    this.level += 1;
    this.hp += 10;
    this.addObstacles(10);
  }

  reset(): void {
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
    this.track = this.getEmptyTrack();
    this.obstacles = [];
    this.levelTimer = Date.now();
    this.hp = 100;
    this.score = 0;
  }

  play(): void {
    this.reset();
    this.player = new Piece();
    this.track[this.player.y][this.player.x] = 1;

    this.addObstacles(100);

    this.animate();
  }

  addObstacles(number: number) {
    for (let i = 0; i < number; i++) {
      const obstacle = new Piece();
      obstacle.randomPlacement(this.track);
      obstacle.color = "red";
      this.track[obstacle.y][obstacle.x] = 2;
      this.obstacles.push(obstacle);
    }
  }

  drawCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}


