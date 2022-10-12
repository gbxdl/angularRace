import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BLOCK_SIZE, COLS, ROWS } from './constants';

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

  ngOnInit(): void {
    this.initTrack();
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
    var track = this.getEmptyTrack();
    console.info("track below:")
    console.table(track);
  }

}
