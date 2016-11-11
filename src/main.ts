import {Game} from './game';

const game = new Game();
document.body.appendChild(game.view);
game.start();

window.addEventListener('blur', () => {
  game.pause();
});

window.addEventListener('focus', () => {
  game.unpause();
});
