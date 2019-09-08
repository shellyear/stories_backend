import * as uniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';
import { IPost } from '../interfaces/post.interface';


const PostSchema: Schema = new Schema (
    {   
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            unique: true,
            minlength: [40, 'Post must contain at least 40 symbols'],
            maxlength: [1200, 'Post must contain less than 1200 symbols']
        },
        likes: [{
             type: Schema.Types.ObjectId,
             ref: 'User'
        }]
    },
    {
        timestamps: true
    }
);

PostSchema.plugin(uniqueValidator, {message: 'Expected {PATH} to be unique'});

export default model<IPost>('Post', PostSchema);
