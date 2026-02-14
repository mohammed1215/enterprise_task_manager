
import dotenv from 'dotenv'
dotenv.config()
export const envConst = {
    adminPass: process.env.ADMIN_PASS,
    adminUsername: process.env.ADMIN_USER
}