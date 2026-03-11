import { Input } from './Input';
import { Renderer } from './Renderer';
import { Player } from '../entities/Player';
import { Bullet, Weapon } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';

/**
 * メインゲームクラス
 */
export class Game {
    public input: Input;
    public renderer: Renderer;
    public player: Player;
    public weapon: Weapon;
    public bullets: Bullet[] = [];
    public enemies: Enemy[] = [];

    private lastTime: number = 0;
    public isRunning: boolean = false;
    private spawnTimer: number = 0;

    constructor() {
        this.input = new Input();
        this.renderer = new Renderer('game-canvas');
        this.player = new Player(this);
        this.weapon = new Weapon(this);
    }

    public start() {
        this.isRunning = true;
        requestAnimationFrame((t) => this.loop(t));
    }

    private loop(timestamp: number) {
        if (!this.isRunning) return;
        const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }

    private update(dt: number) {
        this.player.update(dt);
        this.weapon.update(dt, this.bullets);

        // 敵のスポーン
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnEnemy();
            this.spawnTimer = 2.0; // 2秒ごとにスポーン
        }

        // 敵の更新
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update(dt);

            // プレイヤーとの接触判定
            const dx = e.x - this.player.x;
            const dy = e.y - this.player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < e.radius + this.player.radius) {
                // ダメージ処理（将来的に実装）
            }
        }

        // 弾丸の更新と衝突判定
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.update(dt);

            let hit = false;
            // 敵との衝突判定
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies[j];
                const dx = b.x - e.x;
                const dy = b.y - e.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < e.radius + b.radius) {
                    e.takeDamage(1);
                    hit = true;
                    if (e.hp <= 0) {
                        this.enemies.splice(j, 1);
                    }
                    break;
                }
            }

            if (hit || b.life <= 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    private spawnEnemy() {
        // プレイヤーから離れた位置に生成
        const angle = Math.random() * Math.PI * 2;
        const dist = 400 + Math.random() * 200;
        const x = this.player.x + Math.cos(angle) * dist;
        const y = this.player.y + Math.sin(angle) * dist;
        this.enemies.push(new Enemy(this, x, y));
    }

    private draw() {
        this.renderer.clear();
        this.renderer.begin();

        // 背景グリッド（移動感の実感用）
        this.drawGrid();

        this.enemies.forEach(e => e.draw(this.renderer.ctx));
        this.player.draw(this.renderer.ctx);
        this.bullets.forEach(b => b.draw(this.renderer.ctx));

        this.renderer.end();
    }

    private drawGrid() {
        const ctx = this.renderer.ctx;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 1;
        const size = 100;
        const startX = Math.floor((this.player.x - this.renderer.width) / size) * size;
        const endX = Math.ceil((this.player.x + this.renderer.width) / size) * size;
        const startY = Math.floor((this.player.y - this.renderer.height) / size) * size;
        const endY = Math.ceil((this.player.y + this.renderer.height) / size) * size;

        for (let x = startX; x <= endX; x += size) {
            ctx.beginPath(); ctx.moveTo(x, startY); ctx.lineTo(x, endY); ctx.stroke();
        }
        for (let y = startY; y <= endY; y += size) {
            ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(endX, y); ctx.stroke();
        }
    }
}
