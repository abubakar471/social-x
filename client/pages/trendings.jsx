import PostPublic from "@/components/cards/PostPublic";
import CommentForm from "@/components/forms/CommentForm";
import styles from "@/styles/Trendings.module.scss"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from "@mui/material";
import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Trendings = () => {
    const [posts, setPosts] = useState([]);
    const [taggedPosts, setTaggedPosts] = useState([]);
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});
    const router = useRouter();

    const fetchLikedPosts = async () => {
        const { data } = await axios.get('/trendings');
        console.log(data)
        setPosts(data);
    }

    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure ?");
            if (!answer) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            alert("post deleted");

            const rawArr = collection.filter(p => {
                if (p._id !== post._id) {
                    return data;
                }
            });

            setPosts(rawArr);
        } catch (err) {
            console.log(err);
        }
    }

    const handleLike = async (_id) => {
        try {
            const { data } = await axios.put("/like-post", { _id });

            const rawArr = posts.map(p => {
                if (p._id === data._id) {
                    return data;
                } else {
                    return p;
                }
            });
            // console.log('raw array',rawArr)
            setPosts(rawArr);
            fetchLikedPosts();
        } catch (err) {
            console.log(err);
        }
    }

    const handleUnlike = async (_id) => {
        try {
            const { data } = await axios.put("/unlike-post", { _id });
            const rawArr = posts.map(p => {
                if (p._id === data._id) {
                    return data;
                } else {
                    return p;
                }
            });
            setPosts(rawArr);
            fetchLikedPosts();
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

            setComment('');
            setVisible(false);

            const rawArr = posts.map(p => {
                if (p._id === data._id) {
                    return data;
                } else {
                    return p;
                }
            });
            setPosts(rawArr);
            fetchLikedPosts();
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

            const rawArr = posts.map(p => {
                if (p._id === data._id) {
                    return data;
                } else {
                    return p;
                }
            });
            setPosts(rawArr);
            fetchLikedPosts();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchLikedPosts();
    }, []);



    return (
        <div className={styles.container}>

            <h1 className={`${styles.heading} ${styles.title} `}></h1>
            
            <div className={styles.division}>
            <IconButton >
                <ArrowBackIcon onClick={() => router.back()} ></ArrowBackIcon>
            </IconButton>
                <h1 className={styles.trends__header}># top 10 most trending now</h1>
                <div>
                    {
                        posts.map(post => (
                            <PostPublic key={post._id}
                                handleLike={handleLike}
                                handleUnlike={handleUnlike}
                                handleDelete={handleDelete}
                                handleComment={handleComment}
                                removeComment={removeComment}
                                post={post}
                            />
                        ))
                    }

                </div>
            </div>


            <Modal visible={visible} footer={null} onCancel={() => setVisible(false)} title="Comment">
                <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
            </Modal>
        </div>
    )
}

export default Trendings