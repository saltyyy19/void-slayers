import { defineConfig } from 'vite';

export default defineConfig({
    // GitHub Pages のパスに合わせてベースパスを設定
    base: '/void-slayers/',
    build: {
        outDir: 'dist',
    },
});
