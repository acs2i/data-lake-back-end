import express, { Request, Response } from "express"
import { OK } from "../../codes/success";
import { BAD_REQUEST } from "../../codes/errors";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';

import UserModel, { User } from "../../schemas/userSchema";
dotenv.config();

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).send('Username and password are required');
    }


    if(password.length === 0) {
        return res.status(BAD_REQUEST).send('Password cannot be an empty string');
    }
  
    // Check if user already exists
    const existingUser: User | null | undefined = await UserModel.findOne({email});
    
    if (existingUser) {
      return res.status(BAD_REQUEST).send('User already exists');
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt(10); // 10 is the salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { email, password: hashedPassword };

    console.log("user: " , newUser)

    const createdUser = new UserModel({...newUser})

    const user: User | null | undefined = await createdUser.save({timestamps: true})
  
    // Generate JWT token
    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    
    res.status(OK).json({ email, token });
})

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send('Username and password are required');
    }
  
    // Find the user
    const existingUser: User | null | undefined = await UserModel.findOne({email});
    if (!existingUser) {
      return res.status(401).send('Invalid username or password');
    }
  
    try {
      // Check the password
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).send('Invalid username or password');
      }
  
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET as string);

      res.status(200).json(token)
    } catch (error) {
      res.status(500).send('Error during login');
    }
  });
  


export default router;