import { Observable } from 'rxjs/Rx';

export class Keyboard {
  private _keysPressed: {[key: number]: boolean};
  keyPress$: Observable<KeyboardEvent>;

  constructor() {
    this._keysPressed = {};
    this.keyPress$ = Observable
      .merge(
        Observable.fromEvent<KeyboardEvent>(document, 'keyup'),
        Observable.fromEvent<KeyboardEvent>(document, 'keydown')
      )
      .filter(e => {
        let old = !!this._keysPressed[e.which];
        this._keysPressed[e.which] = e.type === 'keydown';
        return old !== this._keysPressed[e.which];
      })
      .share();
  }
}
