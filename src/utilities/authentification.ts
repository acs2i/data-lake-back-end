import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

const saltRounds = process.env.SALT as string;


export const Hash = async (password: string): Promise<Error | string> => {
    console.log("password; " ,password)
    return bcrypt.hash(password, saltRounds);
}