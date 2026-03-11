import { Game } from '../engine/Game';

/**
 * プレイヤーエンティティ
 */
export class Player {
    public x: number = 0;
    public y: number = 0;
    public radius: number = 12;
    public color: string = '#fff';

    private speed: number = 150;
    private game: Game;

    // ダッシュ関連
    private isDashing: boolean = false;
    private dashTime: number = 0;
    private dashDuration: number = 0.2;
    private dashCooldown: number = 0.5;
    private dashTimer: number = 0;
    private dashSpeedMulti: number = 4;

    constructor(game: Game) {
        this.game = game;
    }

    public update(dt: number) {
        // クールダウン更新
        if (this.dashTimer > 0) this.dashTimer -= dt;

        if (this.isDashing) {
            this.updateDash(dt);
        } else {
            this.handleInput(dt);
        }

        // カメラの追従
        this.game.renderer.setCamera(this.x, this.y);
    }

    private handleInput(dt: number) {
        const move = this.game.input.getMovementVector();

        // 移動
        this.x += move.x * this.speed * dt;
        this.y += move.y * this.speed * dt;

        // ダッシュ開始 (Spaceキー)
        if (this.game.input.isKeyDown('Space') && this.dashTimer <= 0) {
            this.startDash(move);
        }
    }

    private startDash(dir: { x: number, y: number }) {
        this.isDashing = true;
        this.dashTime = this.dashDuration;
        this.dashTimer = this.dashCooldown;

        // 入力がない場合は向いている方向に（今は簡易的に右に）
        if (dir.x === 0 && dir.y === 0) {
            // マウスの方向へのダッシュなども検討可能
        }
    }

    private updateDash(dt: number) {
        this.dashTime -= dt;
        const move = this.game.input.getMovementVector();

        // ダッシュ中は高速移動
        const dSpeed = this.speed * this.dashSpeedMulti;
        this.x += move.x * dSpeed * dt;
        this.y += move.y * dSpeed * dt;

        if (this.dashTime <= 0) {
            this.isDashing = false;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        // ダッシュ中の残像エフェクト（簡易）
        if (this.isDashing) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#44f';
            ctx.beginPath();
            ctx.arc(this.x - 5, this.y - 5, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // プレイヤー本体 (ドット絵の代わりに円と向きで表現)
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 目の描画（マウスの方向を向く）
        const angle = Math.atan2(
            this.game.input.mouseY - this.game.renderer.height / 2,
            this.game.input.mouseX - this.game.renderer.width / 2
        );

        ctx.fillStyle = '#000';
        const eyeX = this.x + Math.cos(angle) * 5;
        const eyeY = this.y + Math.sin(angle) * 5;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
