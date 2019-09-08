import { Document, Schema } from 'mongoose';


export interface IPost extends Document {
    _id: Schema.Types.ObjectId; 
    content: string;
    likes: [Schema.Types.ObjectId];
    author: Schema.Types.ObjectId;
}

