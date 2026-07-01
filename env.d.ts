/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_DEEPSEEK_API_KEY: string
  readonly VITE_VAPID_PUBLIC_KEY: string
  readonly VITE_PAYMENT_MODE: 'manual' | 'lemonsqueezy'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}