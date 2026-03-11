import { Game } from './engine/Game';

// ゲームの起動
window.addEventListener('DOMContentLoaded', () => {
    console.log('Void Slayers: Rogue Depths 起動中...');
    const game = new Game();
    game.start();
});
