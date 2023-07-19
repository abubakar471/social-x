import React, { useEffect, useState } from 'react'
import styles from "@/styles/SearchPage.module.scss"
import PostList from '@/components/cards/PostList';
import { Modal } from 'antd';
import CommentForm from '@/components/forms/CommentForm';
import axios from 'axios';
import { CircularProgress, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ArrowBack } from '@mui/icons-material';

const Search = () => {
    const router = useRouter();
    const { searchQuery } = router.query;
    const [query, setQuery] = useState('');
    const [message, setMesssage] = useState("");
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState({});
    const [totalPosts, setTotalPosts] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);


    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.get(`/search/${query}?page=1`);

            if (data.length <= 0) {
                setMesssage("No result found!")
            } else {
                setPosts(data.data);
                setTotalPosts(data.totalPosts);
                setPage(2);
            }

        } catch (err) {
            console.log(err);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/search/${query}?page=${page}`);
            console.log('page => ', page)
            const rawArr = [...posts, ...data.data];
            setPosts(rawArr);
            setTotalPosts(data.totalPosts);
            setPage(page + 1);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchQuery = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/search/${searchQuery}?page=1`);
            setPosts(data.data);
            setTotalPosts(data.totalPosts);
            setPage(2);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setQuery(searchQuery)
        fetchQuery();
       
    }, [searchQuery]);

    const handleDelete = async (post) => {
        try {
            const answer = window.confirm("Are you sure ?");
            if (!answer) return;
            const { data } = await axios.delete(`/delete-post/${post._id}`);
            alert("post deleted");

            const rawArr = posts.filter(p => {
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
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className={styles.container}>
            

            <form onSubmit={handleSearch} className={styles.searchBox}>
            <IconButton>
                <ArrowBackIcon onClick={() => router.back()} />
            </IconButton>
                <input className={styles.search_input} onChange={(e) => setQuery(e.target.value)} value={query} type="search" placeholder='search' autoFocus />
            </form>

            {posts.length > 0 ? (
                <div className={styles.results__container}>
                    <h3 className={styles.results__length}>search results ({posts.length})</h3>
                    <PostList
                        posts={posts}
                        handleDelete={handleDelete}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                        handleComment={handleComment}
                        removeComment={removeComment}
                    />
                    {(posts.length < totalPosts) && <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {loading && <CircularProgress />}
                        {!loading && <button className={styles.loadMoreBtn} onClick={fetchData}>Load More</button>}
                    </div>}
                </div>
            ) : <div className={styles.hr}>{message}</div>}


            <Modal visible={visible} footer={null} onCancel={() => setVisible(false)} title="Comment">
                <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
            </Modal>
        </div>
    )
}

export default Search