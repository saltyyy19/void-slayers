/**
 * 入力管理クラス
 * キーボードとマウス（および将来的なタッチ）入力を統合管理します。
 */
export class Input {
    private keys: Set<string> = new Set();
    public mouseX: number = 0;
    public mouseY: number = 0;
    public isMouseDown: boolean = false;

    constructor() {
        window.addEventListener('keydown', (e) => this.keys.add(e.code));
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        window.addEventListener('mousedown', () => (this.isMouseDown = true));
        window.addEventListener('mouseup', () => (this.isMouseDown = false));
    }

    public isKeyDown(code: string): boolean {
        return this.keys.has(code);
    }

    // 移動ベクトルの取得 (WASD/矢印キー)
    public getMovementVector(): { x: number; y: number } {
        let x = 0;
        let y = 0;
        if (this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp')) y -= 1;
        if (this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown')) y += 1;
        if (this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft')) x -= 1;
        if (this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight')) x += 1;

        // 斜め移動の正規化
        if (x !== 0 && y !== 0) {
            const len = Math.sqrt(x * x + y * y);
            x /= len;
            y /= len;
        }
        return { x, y };
    }
}
