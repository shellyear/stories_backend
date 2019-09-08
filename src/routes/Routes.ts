import * as express from 'express';
import PostsController from '../controllers/posts-controller';
import UserController from '../controllers/user-controller';
import { authLocal, authJwt } from '../middleware/passport';


class Routes {
    public PostsCtrl: PostsController;
    public UserCtrl: UserController;

    constructor() {
        this.PostsCtrl = new PostsController();
        this.UserCtrl = new UserController();
    }

    public routes(server: express.Application) {
        server.post('/signup', this.UserCtrl.register);
        server.post('/login', authLocal, this.UserCtrl.login);
        server.post('/posts/create', authJwt, this.PostsCtrl.createPost);
        server.put('/post/like/:id', authJwt, this.PostsCtrl.likePostAct); // ?
        server.get('/posts/all', this.PostsCtrl.getPosts);
        server.get('/posts/user', authJwt, this.PostsCtrl.getUserPosts);
        server.get('/posts/user/liked', authJwt, this.PostsCtrl.getUserPostsWithLike);
        server.get('/post/:id', this.PostsCtrl.getPostById); // для отдельной компоненты с постом
    } 

}

export default Routes;