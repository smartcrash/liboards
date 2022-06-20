import 'dotenv/config'

export const PORT: number = parseInt(process.env.PORT)
export const NODE_ENV: 'development' | 'production' = process.env.NODE_ENV as any || 'development'
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
