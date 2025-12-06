/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // adicione outras variáveis aqui conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
