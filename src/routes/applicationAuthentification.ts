import express, { Request, Response } from "express";
import dotenv from "dotenv"
import applicationAuthorization from "../middlewears/applicationMiddlewear";
import { OK } from "../codes/success";
import { BAD_REQUEST } from "../codes/errors";


dotenv.config()
const uri = process.env.REMOTE_DEV_DB_URI as string
const DB = process.env.DATABASE as string

const router = express.Router();
const path = "/authentification/application"
const targetCollection = "Applications" 

router.get(path + "/login", applicationAuthorization,  async (req : Request, res: Response) => {
    try {
      res.status(OK).json({ message: "Authorized"})
    }
    catch(err) {
        res.status(BAD_REQUEST)
        console.log(err);
    }


    
})


export default router;