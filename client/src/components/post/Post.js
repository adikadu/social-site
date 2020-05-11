import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import {getPost} from "../../actions/post";
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layout/spinner";
import PostItem from "../posts/PostItem";
import {addComment} from "../../actions/post";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({ post: {post, loading}, match, getPost, addComment }) => {
    useEffect(() => {
        getPost(match.params.id);
    }, [getPost, match.params.id]);
    return loading || post === null ? <Spinner /> : <Fragment>
        <Link to="/posts" className="btn">Back To Posts</Link>
        <PostItem post={post} showActions={false} />
        <CommentForm postId={post._id}/>
        <div clsaaName="comments">
            {post.comments.map(comment => (<CommentItem key={comment._id} comment={comment} postId={post._id} />))}
        </div>
    </Fragment>
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, {getPost, addComment})(Post);
