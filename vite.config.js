import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, './')
const outDir = resolve(__dirname, 'dist')

export default defineConfig({
    root,
    plugins: [],
    build:{
        outDir,
        emptyOutDir: true,
        // rollupOptions: {
        //     input: {
        //         main: resolve(root, 'index.html'),
        //         about: resolve(root, 'about', 'index.html'),
        //         orbit: resolve(root, 'orbit', 'index.html'),
        //         arcade: resolve(root, 'arcade', 'index.html'),
        //         clock: resolve(root, 'clock', 'index.html'),
        //         tetromino: resolve(root, 'tetromino', 'index.html'),
        //         throwback90s: resolve(root, 'throwback90s', 'index.html'),
        //         contact: resolve(root, 'contact', 'index.html'),
        //         resume: resolve(root, 'resume', 'index.html'),
        //     }
        // }
    }
})