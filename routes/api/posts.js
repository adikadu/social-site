const express = require("express");
const {check ,validationResult} = require("express-validator");
const auth = require("../../middlewares/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const router = express.Router();

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post("/", [auth, [
    check("text", "text is required.").not().isEmpty()
]], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    const user = await User.findById(req.user.id).select("-password");
    if(!user) return res.status(400).json({msg: "User not found"});
    try {
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// @route  GET api/posts
// @desc   get all posts
// @access Private

router.get("/", auth, async(req, res)=>{
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route  GET api/posts/:postId
// @desc   get post by id
// @access Private

router.get("/:postId", auth, async(req, res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        if(!post) return res.status(404).json({msg: "Post not found."});
        res.json(post);
    } catch (error) {
        console.log(error);
        if(error.name === "CastError") return res.status(404).json({msg: "Post not found."});
        res.status(500).send("Server Error");
    }
});

// @route  DELETE api/posts/:postId
// @desc   delete post by id
// @access Private

router.delete("/:postId", auth, async(req, res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        if(!post) return res.status(404).json({msg: "Post not found."});
        if(post.user.toString() !== req.user.id) return res.status(401).json({msg: "User Not authorized."});
        await post.remove();
        res.status(200).json({msg: "Post deleted."});
    } catch (error) {
        console.log(error);
        if(error.name === "CastError") return res.status(404).json({msg: "Post not found."});
        res.status(500).send("Server Error");
    }
});
// @route  PUT api/posts/like/:postId
// @desc   like a post.
// @access Private
router.put("/like/:postId", auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        // console.log(post);
        if(!post) return res.status(400).json({msg: "Post not found"});
        // if(post.likes) post.likes.pop;
        if(post.likes.filter(like => like.user.toString() === req.user.id).length>0) return res.status(400).json({msg: "Post already liked by you"});
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.status(200).json(post.likes);
    } catch (error) {
        console.log(error);
        if(error.name === "CastError") return res.status(404).json({msg: "Post not found."});
        res.status(500).send("Server Error");
    }
});

// @route  PUT api/posts/unlike/:postId
// @desc   unlike a post.
// @access Private
router.put("/unlike/:postId", auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        if(!post) return res.status(400).json({msg: "Post not found"});
        if(post.likes.filter(like => like.user.toString() === req.user.id).length===0) return res.status(400).json({msg: "Post is not liked by you."});
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.status(200).json(post.likes);
    } catch (error) {
        console.log(error);
        if(error.name === "CastError") return res.status(404).json({msg: "Post not found."});
        res.status(500).send("Server Error");
    }
});

// @route  POST api/posts/comment/:postId
// @desc   Comment on a post
// @access Private
router.post("/comment/:postId", [auth, [
    check("text", "text is required.").not().isEmpty()
]], async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user) return res.status(400).json({msg: "User not found"});
        const post = await Post.findById(req.params.postId);
        if(!post) return res.status(400).json({msg: "Post not found."});
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// @route  DELETE api/posts/comment/:postId/:commentId
// @desc   Delete a Comment a on post
// @access Private
router.delete("/comment/:postId/:commentId", auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.postId);
        // pull out comment.
        const comment = post.comments.find(comment=> comment.id === req.params.commentId);
        if(!comment) return res.status(404).json({msg: "Comment not Found"});
        // check user
        if(comment.user.toString() !== req.user.id) return res.status(401).json({msg: "User not authorized."});
        // finally remove comment.
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.status(200).json(post.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");        
    }
});
module.exports = router;