import User from "../routes/Models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import KeyPair from "../routes/keyPair.js";
import { encryptPrivateKey } from "../utils/KeyHandling.js";

export const register = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(req.body.password, salt);
        
        const key = new KeyPair();
        const publicKey = key.publicKey;
        const privateKey = key.privateKey;

        // Encrypt the private key
        const encryptedPrivateKey = encryptPrivateKey(privateKey);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            publicKey: publicKey,
            privateKey: encryptedPrivateKey
        });

        await newUser.save();
        res.status(200).json("User has been created!");
    } catch (err) {
        next(err);
    }
};
 
export const login= async(req,res,next)=>{
    try {
        const user=await User.findOne({username:req.body.username});
        if(!user) return next(createError(404,"User not found"))
        const isPasswordCorrect= await bcrypt.compare(req.body.password,user.password);
        if (!isPasswordCorrect) return next(createError(400,"Wrong Password!"));
        res.json(user);
        
    
        
          
    } catch (err) {
        next(err)
    }
}


