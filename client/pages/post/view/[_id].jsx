import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from "../../../styles/SinglePost.module.scss";
import axios from 'axios';
import PostPublic from "../../../components/cards/PostPublic";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../../components/forms/CommentForm";


export default function SinglePost({ fetchedPost }) {

    const [currentPost, setCurrentPost] = useState({});
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [post, setPost] = useState(fetchedPost)
    const imageSource = (post) => {
        if (post.image) {
            return post.image.url;
        } else {
            return '/images/default.jpg'
        }
    }

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/post/${post._id}`);
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
            <Head>
                <title>Social X - Coxas</title>
                <meta name="description" content={post.content} />
                {/* the following meta tag is for social media platform like facebook or twitter, when 
        you share your post there, and the og:description property means open graph 
        description */}
                <meta property='og:description' content="Social X a social media platform of abs production" />
                <meta property='og:type' content="website" />
                <meta property='og:site_name' content="Social X" />
                <meta property='og:url' content={`http://socialx.com/post/view/${post._id}`} />
                {/* this is the image that will appear to preview our site. we have to give the full path 
        for that */}
                <meta property='og:image:secure_url' content={imageSource(post)} />
            </Head>

            <div className='container'>
                <PostPublic
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
        </div>
    )
}

// the ctx is like req, res object in server side node js we can use this to access url parameter
export async function getServerSideProps(ctx) {
    const { data } = await axios.get(`/post/${ctx.params._id}`);

    return {
        props: {
            fetchedPost: data
        }
    }
}