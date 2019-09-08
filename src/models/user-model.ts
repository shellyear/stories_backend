import * as uniqueValidator from 'mongoose-unique-validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';
import { IUser } from '../interfaces/user.interface';

require('dotenv').config();


const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            lowercase: true,
            unique: true, 
            minlength: [4, 'Username must have at least 4 symbols'],
            maxlength: [14, 'Username max length is 14 symbols'] 
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            unique: [true, 'User with that email already exists'],   
            lowercase: true,
            validate: [isEmail, 'Email is invalid']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            trim: true,
            minlength: [6, 'Password must contain more than 6 symbols']
        },
        likedPosts: [ { type: Schema.Types.ObjectId, ref: 'Post' } ],
        posts: [ { type: Schema.Types.ObjectId, ref: 'Post' } ] 
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', function save(this: IUser, next) {//arrow func in that way will have no leksical scope
    if (!this.isModified('password')) {
        next();
    } else {
        bcrypt.genSalt(10, (err, salt) => { // this достается из внешнего контекста (из ф-ции save)
            if (err) {
                console.log(err);
                next();
            } else {
                bcrypt.hash(this.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                        next();
                    } else {
                        this.password = hash;
                        next();
                    }
                });    
            }
        });
    }
});


const createToken = function () { // jwt payload
    return jwt.sign({_id: this._id,
                     email: this.email,
                     username: this.username
                    }, process.env.JWT_SECRET); 
}

const isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    
    return compare;
}

const toJSON = function () {
    return { 
        logged: true,
        token: this.createToken()
    }
}

UserSchema.methods.createToken = createToken;
UserSchema.methods.isValidPassword = isValidPassword;
UserSchema.methods.toJSON = toJSON;

UserSchema.plugin(uniqueValidator, { message: "User with that {PATH} already exists"}); // for unique property

export default model<IUser>('User', UserSchema);