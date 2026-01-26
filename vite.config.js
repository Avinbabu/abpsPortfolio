import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: true, // Exposes to network if needed, good for testing
        open: false // Don't auto-open browser as we are headless
    }
})
