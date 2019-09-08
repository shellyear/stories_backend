import * as passport from 'passport';
import * as dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'; 
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from '../models/user-model';


dotenv.config({ path: '.env' });

const JWT_OPTIONS = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const jwtStrategy = new JwtStrategy(JWT_OPTIONS, async (jwt_payload, done) => {
    try {
        console.log("PASSSSSPORT", jwt_payload);
        const user = await UserModel.findById(jwt_payload._id);
        
        if(!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        done(err, false);
    }
});


const LOCAL_OPTIONS = {
    usernameField: 'email',
    passwordField: 'password',
    session: false
}

const localStrategy = new LocalStrategy(LOCAL_OPTIONS, async (email: string, password: string, done) => {
    try {

        if (password === '') {
            return done(null, { logged: false, error: `please enter password` });
        }

        const user = await UserModel.findOne({ email });
        if(!user) {
            return done(null, { logged: false, error: `User with email ${email} not found`});
        }

        const validate = await user.isValidPassword(password);
        
        if (!validate) {
            return done(null, { logged: false, error: 'Wrong password'}); 
        }

        user.toJSON();

        return done(null, user);
    } catch (err) {
        console.log('passport.ts', err);
        return done(err, false);
    }
});


passport.use(jwtStrategy);
passport.use(localStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
