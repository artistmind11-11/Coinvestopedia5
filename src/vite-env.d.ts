/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COINGECKO_API: string;
  readonly VITE_CRYPTOPANIC_API: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_ETHERSCAN_API: string;
  readonly VITE_WHALE_ALERT_API_KEY: string;
  readonly VITE_GLASSNODE_API_KEY: string;
  readonly VITE_CRYPTOQUANT_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
