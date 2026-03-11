import { Game } from '../engine/Game';

/**
 * 弾丸クラス
 */
export class Bullet {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public life: number = 2.0;
    public radius: number = 4;
    public isPlayer: boolean;

    constructor(x: number, y: number, angle: number, speed: number, isPlayer: boolean) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.isPlayer = isPlayer;
    }

    public update(dt: number) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.isPlayer ? '#ff0' : '#f0f';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 発光エフェクト（簡易）
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

/**
 * 武器システム
 */
export class Weapon {
    private game: Game;
    private fireRate: number = 0.15;
    private fireTimer: number = 0;

    constructor(game: Game) {
        this.game = game;
    }

    public update(dt: number, bullets: Bullet[]) {
        if (this.fireTimer > 0) this.fireTimer -= dt;

        if (this.game.input.isMouseDown && this.fireTimer <= 0) {
            this.fire(bullets);
        }
    }

    private fire(bullets: Bullet[]) {
        this.fireTimer = this.fireRate;

        // マウス方向への角度
        const angle = Math.atan2(
            this.game.input.mouseY - this.game.renderer.height / 2,
            this.game.input.mouseX - this.game.renderer.width / 2
        );

        // プレイヤーの位置から発射（PlayerインスタンスをGame経由で取得予定）
        // 一旦Game.ts側でPlayerを持たせるように修正が必要
        // 弾の発射位置をプレイヤーに合わせる
        const spread = (Math.random() - 0.5) * 0.1;
        bullets.push(new Bullet(this.game.player.x, this.game.player.y, angle + spread, 700, true));

        // 画面の揺れ
        this.game.renderer.shake(3);
    }
}
