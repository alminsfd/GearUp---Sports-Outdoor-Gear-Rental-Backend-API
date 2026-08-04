import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), ".env") })

export default {
     port: process.env.PORT,
     database_url: process.env.DATABASE_URL,
     app_url: process.env.APP_URL,
     bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
     jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
     jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
     jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
     jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
     store_id: process.env.STORE_ID,
     store_password: process.env.STORE_PASSWORD,
     is_live: process.env.IS_LIVE,
     BACKEND_BASE_URL: process.env.BACKEND_BASE_URL
}



