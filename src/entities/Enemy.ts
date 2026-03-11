import { Game } from '../engine/Game';

/**
 * 敵エンティティ
 */
export class Enemy {
    public x: number;
    public y: number;
    public radius: number = 14;
    public hp: number = 3;
    public color: string = '#f44';

    private speed: number = 80;
    private game: Game;

    // 被弾時のフラッシュ
    private flashTimer: number = 0;

    constructor(game: Game, x: number, y: number) {
        this.game = game;
        this.x = x;
        this.y = y;
    }

    public update(dt: number) {
        if (this.flashTimer > 0) this.flashTimer -= dt;

        // プレイヤーを追いかける単純なAI
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            this.x += (dx / dist) * this.speed * dt;
            this.y += (dy / dist) * this.speed * dt;
        }
    }

    public takeDamage(amount: number) {
        this.hp -= amount;
        this.flashTimer = 0.1;
        this.game.renderer.shake(2);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        // 被弾時は白く光る
        ctx.fillStyle = this.flashTimer > 0 ? '#fff' : this.color;

        // 少し波打つようなアニメーション
        const scale = 1 + Math.sin(Date.now() * 0.01) * 0.05;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();

        // 角のようなディテール
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - 8, this.y - 12, 4, 6);
        ctx.fillRect(this.x + 4, this.y - 12, 4, 6);

        ctx.restore();
    }
}
