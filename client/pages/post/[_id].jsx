import styles from "../../styles/SinglePost.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import UserRoute from "../../components/routes/UserRoute";
import Post from "../../components/cards/Post";
import { Modal, Pagination } from "antd";
import CommentForm from "../../components/forms/CommentForm";

const PostComments = () => {
    const [post, setPost] = useState({});
    const [currentPost, setCurrentPost] = useState({});
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const _id = router.query._id;

    useEffect(() => {
        if (_id) fetchPost();
    }, [_id]);

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/user-post/${_id}`);
            setPost(data);
        } catch (err) {
            console.log(err);
        }
    }



    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure ?");
            if (!answer) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            alert("post deleted");
            router.push("/");
        } catch (err) {
            console.log(err);
        }
    }

    const handleLike = async (_id) => {
        try {
            const { data } = await axios.put("/like-post", { _id });
            fetchPost();
        } catch (err) {
            console.log(err);
        }
    }

    const handleUnlike = async (_id) => {
        try {
            const { data } = await axios.put("/unlike-post", { _id });
            fetchPost();
        } catch (err) {
            console.log(err);
        }
    }

    const handleComment = (post) => {
        setCurrentPost(post);
        setVisible(true);
    }

    const addComment = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.put('/add-comment', {
                postId: currentPost._id, comment
            });
            console.log(data);
            setComment('');
            setVisible(false);
            fetchPost()
        } catch (err) {
            console.log(err);
        }
    }

    const removeComment = async (postId, comment) => {
        let answer = window.confirm("Are you sure?");
        if (!answer) return;
        try {
            const { data } = await axios.put('/remove-comment', {
                postId, comment
            });
            alert('comment deleted');
            fetchPost();
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className={styles.container}>
            <Post
                post={post}
                commentsCount={100}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                handleComment={handleComment}
                handleDelete={handleDelete}
                removeComment={removeComment}
            />

            <Modal visible={visible} footer={null} onCancel={() => setVisible(false)} title="Comment">
                <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
            </Modal>
        </div>
    )
}

export default PostComments;