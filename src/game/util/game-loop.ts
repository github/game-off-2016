import { Observable, Subject } from 'rxjs/Rx';

interface ITimeEvent {
  timestamp: number;
  delta: number;
};

export class GameLoop {
  main$: Observable<ITimeEvent>;
  game$: Observable<ITimeEvent>;
  render$: Observable<ITimeEvent>;

  private _main$: Subject<ITimeEvent>;
  private _render$: Subject<ITimeEvent>;
  private _paused: boolean;
  private _lastTime: number;

  private _gameLoop(time) {
    let frameInfo = {
      timestamp: time,
      delta: time - this._lastTime
    };
    this._main$.next(frameInfo);
    this._render$.next(frameInfo);
    this._lastTime = time;
    requestAnimationFrame(this._gameLoop);
  }

  constructor() {
    this._paused = false;
    this._lastTime = 0;
    this._main$ = new Subject();
    this._render$ = new Subject();

    this.main$ = this._main$.asObservable();
    this.render$ = this._render$.asObservable();
    this.game$ = this.main$.filter(() => !this._paused);
    this._gameLoop = this._gameLoop.bind(this);
    requestAnimationFrame(this._gameLoop);
  }

}
