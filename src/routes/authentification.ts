import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config()

const router = express.Router();
const path = "/authentification"
const saltRounds = "$2a$11$ABCDEFGHIJKLMNOPQRSTUV"

// user name, password
router.post(path, (req : Request, res: Response) => {
    console.log("ubody: ", req)

    try {
        const { user, password }: {user: string, password: string} = req.body;

        bcrypt.hash(password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            if(err) throw new Error(path)
            
            // store in the data base 
        });
        res.send('reponse');

    } 
    catch(err) {
        console.error(err)
        res.send('400');

    }
});
  
export default router;