import { config } from 'dotenv'
import { resolve } from 'path'

config()

// Override env vars with envoriment specific definitions
config({
  override: true,
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`),
})

// TODO: Validate with zod
export const APP_ENV: 'development' | 'production' | 'test' = process.env.NODE_ENV as any || 'local'
export const APP_PORT: number = parseInt(process.env.PORT || process.env.APP_PORT)
export const APP_DEBUG = process.env.APP_DEBUG === 'true'
export const CORS_ORIGIN = process.env.CORS_ORIGIN

export const SESSION_SECRET = process.env.SESSION_SECRET
export const SESSION_COOKIE = process.env.SESSION_COOKIE

export const DB_CONNECTION = process.env.DB_CONNECTION
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = parseInt(process.env.DB_PORT)
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD

export const MAIL_HOST = process.env.MAIL_HOST
export const MAIL_PORT = parseInt(process.env.MAIL_PORT)
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS

export const REDIS_HOST = process.env.REDIS_HOST
export const REDIS_PORT = parseInt(process.env.REDIS_PORT)
export const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`
