/**
 * レンダラークラス
 * Canvasへの描画、カメラ管理、エフェクトを制御します。
 */
export class Renderer {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public width: number = 0;
    public height: number = 0;

    // カメラ座標
    public cameraX: number = 0;
    public cameraY: number = 0;

    // 画面の揺れ
    private shakeIntensity: number = 0;
    private shakeDecay: number = 0.9;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        // ドット絵感を出すための設定
        this.ctx.imageSmoothingEnabled = false;
    }

    public clear() {
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public setCamera(x: number, y: number) {
        this.cameraX = x;
        this.cameraY = y;
    }

    public shake(intensity: number) {
        this.shakeIntensity = intensity;
    }

    public begin() {
        this.ctx.save();

        // カメラと揺れの適用
        let sx = 0;
        let sy = 0;
        if (this.shakeIntensity > 0.1) {
            sx = (Math.random() - 0.5) * this.shakeIntensity;
            sy = (Math.random() - 0.5) * this.shakeIntensity;
            this.shakeIntensity *= this.shakeDecay;
        }

        this.ctx.translate(
            this.width / 2 - this.cameraX + sx,
            this.height / 2 - this.cameraY + sy
        );
    }

    public end() {
        this.ctx.restore();
    }
}
