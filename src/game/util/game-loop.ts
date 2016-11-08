import { Observable } from 'rxjs/Rx';

interface ITimeEvent {
  timestamp: number;
  delta: number;
};

export class GameLoop {
  main$: Observable<ITimeEvent>;
  game$: Observable<ITimeEvent>;
  private _paused: boolean;
  private _lastTime: number;
  constructor() {
    this._paused = false;
    this._lastTime = 0;
    this.main$ = Observable.create(observer => {
      const nextFrame = time => {
        observer.next({
          timestamp: time,
          delta: time - this._lastTime
        });
        this._lastTime = time;
        requestAnimationFrame(nextFrame);
      };
      nextFrame(0);
    });

    this.game$ = this.main$.filter(() => !this._paused);

  }
}
