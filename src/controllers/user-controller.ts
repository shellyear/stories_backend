import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user-model';


export default class UserController {

    public register (req: Request, res: Response) {

        const user = new UserModel(req.body)

        user.save()
        .then(() => {
            return res.status(201).json({
                        signup: true, 
                        message: 'You have successfully registered',
                        userInfo: user.toJSON() // returns token after signup
                    })
        })
        .catch(({ errors }) => {
            return res.json({
                signup: false,
                error: errors
            });
        })
    }

    public login (req: Request, res: Response, next: NextFunction) {
        const { user } = req;
        res.send(user);
        return next();
    }

}