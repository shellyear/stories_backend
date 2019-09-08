import { Document } from 'mongoose';
import { IPost } from '../interfaces/post.interface';


export type createTokenFunc = () => {}
export type toJSONFunc = () => {}
export type isValidPasswordFunc = (password: string) => boolean;


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    avatar: string;
    likedPosts: [IPost];
    posts: [IPost];
    token: string
    
    createToken: createTokenFunc;
    toJSON: toJSONFunc;
    isValidPassword: isValidPasswordFunc;
}
