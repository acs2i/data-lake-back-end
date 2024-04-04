import express, { Request, Response } from "express";
import dotenv from "dotenv"
import { BAD_REQUEST } from "../codes/errors";
import { Hash } from "../utilities/authentification";
import UserModel from "../schemas/User"
import { Document } from "mongodb";
import { OK } from "../codes/success";
import jwt from "jsonwebtoken"

dotenv.config()
const DB = process.env.DATABASE as string

const router = express.Router();
const path = "/authentification/user"

// Sign up
router.post(path + "/signup", async (req : Request, res: Response) => {

    try {

        const { email, password }: {email: string, password: string} = await req.body;
        
        const hashedPassword : Error | string = await Hash(password);

        if( hashedPassword instanceof Error) {
            throw new Error(path + "/signup, msg: hash error")
        }

        const document : Document | null | undefined  =  await UserModel.findOne({email, hashedPassword});

        if (document && document instanceof Document) {
            throw new Error(path + "/signup, msg: findOne error")
        }
        
        const newUser = new UserModel({ email, hashedPassword});

        const result : Document  = await newUser.save();
        
        res.json(result);
    } 
    catch(err) {
        console.error(err)
        res.sendStatus(BAD_REQUEST)
    }
});
  

router.post(path + "/login" , async (req: Request, res: Response) => {
    try {
        const { email, password }: {email: string, password: string} = await req.body;

        const hashedPassword : Error | string = await Hash(password);

        if( hashedPassword instanceof Error) {
            throw new Error(path + "/login")
        }

        const document : Document | null | undefined = await UserModel.findOne({email, hashedPassword})

        if ( document === null ||  document === undefined) {
            throw new Error(path + "/login, msg: findOne error")
        }

        const secret: string | null | undefined = process.env.JWT_SECRET;

        if(typeof secret === null || typeof secret === undefined) {
            throw new Error(path + "/login, msg: JWT SECRET null or undefined")
        }

        const token : string = jwt.sign({ email, hashedPassword }, secret as string, { expiresIn: "18h" });

        res.status(OK).json({token});
    }
    catch(err) {
        console.error(err);
        res.json(BAD_REQUEST)

    }

})

export default router;