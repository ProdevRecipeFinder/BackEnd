declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      COOKIE_SECRET: string;
      EMAIL_ADDR: string;
      EMAIL_PASS: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
