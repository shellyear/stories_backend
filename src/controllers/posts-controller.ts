import PostModel from '../models/post-model';
import UserModel from '../models/user-model';    
import { IPost } from '../interfaces/post.interface';
import { Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';


export default class PostsController {
    
    public async createPost (req: Request, res: Response) { // надо будет связать с авторизацией юзера 
        const { body, user: { _id } } = req;
        
        if (!body) {
            return res.status(400).json({
                success: false,
                message: 'you must write a post' // ?
            });
        }

        const newPost = {
            ...body,
            author: _id
        };

        const post = new PostModel(newPost);

        await post.save((err, post: IPost) => {
            if (err) {
                const { errors: { content: { message } } } = err;
                return res.status(400).json({
                    success: false,
                    error: message, 
                    message: 'Post not created!' // ?
                });  
            };

            return res.status(201).json({
                        success: true,
                        id: post._id,
                        message: 'Post created!' // ?
                    }); 
        });

    };

    public async getPosts(req: Request, res: Response) {
        
        const totalAmount: number = await PostModel.estimatedDocumentCount();
        const perPage = parseInt(req.query.perPage);
        const page = parseInt(req.query.page);

        PostModel.find({})
        .skip(perPage * (page - 1))  
        .limit(perPage)
        .sort({ createdAt: 'descending'})
        .exec((err, posts: Array<IPost>) => {
            if (err) {
                return res.status(400).json({
                        success: false, 
                        error: err
                    });
            };

            if(!posts.length){
                return res.status(404).json({
                        success: false,
                        error: 'Posts not found'
                    });
            };

            return res.status(200).json({
                    success: true, 
                    posts,
                    totalAmount
            });    
        });
    };

    public async getPostById(req: Request, res: Response) {

        await PostModel.findById({ _id: req.params.id }, (err, post: IPost) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    err
                });
            };

            if(!post) {
                return res.status(404).json({
                    success: false,
                    error: 'Post not found'
                });
            };
            
            return res.status(200).json({
                success: true,
                post
            });

        });
    };

    public getUserPosts(req: Request, res: Response) {
        const { user: { _id } } = req;
        
        PostModel.find({ author: _id }, (err, posts: [IPost]) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        err 
                    });   
                };
                return res.status(200).json({
                    success: true,
                    posts   
                }); 
            });
        };
        
    public getUserPostsWithLike(req: Request, res: Response) {
        const { user } = req;

        UserModel.findOne({ _id: user._id })
        .populate('likedPosts')
        .exec((error, user: IUser) => { 
               if (error) {
                   return console.log(error);
               }
               console.log('USERPOSTS', user);
               return res.status(200).json({
                    posts: user.likedPosts
               });
        });        
    };
        
    public async likePostAct(req: Request, res: Response) {
        const { user } = req;
        const type = req.query.type;
        const postId = req.params.id;
        const postCheck = await PostModel.findById({ _id: postId });
        const allowLike = postCheck.likes.includes(user._id);
        
        if (type === 'LIKE' && !allowLike) {
            PostModel.findByIdAndUpdate({ _id: postId }, { $push: { likes: user._id } }, { new: true })
            .then((post) => {
                return res.status(200).json({ post });
            })
            .catch(error => {
                return res.status(404).json({ error })
            });
            
            await UserModel.findByIdAndUpdate({ _id: user._id }, { $push: { likedPosts: postId }});
        }
    
        if (type === 'UNLIKE') {
            PostModel.findByIdAndUpdate({ _id: postId }, { $pull: { likes: user._id } }, { new: true })
            .then((post) => {
                return res.status(200).json({ post });
            })
            .catch(error => {
                console.log('BACKENDERR', error);
                return res.status(404).json({ error })
            });

            await UserModel.findByIdAndUpdate({ _id: user._id }, { $pull: { likedPosts: postId }});
        }
    };

};