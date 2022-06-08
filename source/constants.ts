import 'dotenv/config'

export const PORT: number = parseInt(process.env.PORT)
export const NODE_ENV: 'development' | 'production' = process.env.NODE_ENV as any || 'development'
export const SESSION_COOKIE = process.env.SESSION_COOKIE
export const MAIL_HOST = process.env.MAIL_HOST
export const MAIL_PORT = parseInt(process.env.MAIL_PORT)
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS
