import React, { useEffect, useState } from 'react'
import AdminRoute from '@/components/routes/AdminRoute'
import styles from '@/styles/Admin.module.scss'
import axios from 'axios';
import { CircularProgress, IconButton } from '@mui/material';
import Link from 'next/link';
import moment from 'moment';
import { Avatar } from 'antd';
import PostImage from '@/components/images/PostImage';
import renderHTML from 'react-render-html';
import DeleteIcon from '@mui/icons-material/Delete';

const Admin = () => {
    const [loading, setLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [result, setResult] = useState(null);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("post");
    const [message, setMessage] = useState('');

    const fetchTotalPosts = async () => {
        try {
            const { data } = await axios.get('/total-posts');
            setTotalPosts(data);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchTotalUsers = async () => {
        try {
            const { data } = await axios.get('/total-users');
            setTotalUsers(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (filter === 'user') {
                try {
                    let { data } = await axios.get(`/admin/users/${query}`);
                    console.log(data);
                    if (data === null) {
                        setMessage('No Data Found');
                        setResult(data);
                    } else {
                        data['type'] = 'user'
                        setResult(data);
                        setMessage('');
                    }

                } catch (err) {
                    console.log(err);
                }
            }



            if (filter === 'post') {
                try {
                    let { data } = await axios.get(`/admin/posts/${query}`);
                    console.log(data);
                    if (data === null) {
                        setMessage('No Data Found');
                        setResult(data);
                    } else {
                        data['type'] = 'post'
                        setResult(data);
                        setMessage('');
                    }

                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return '/images/default.png';
        }
    }

    const handleDelete = async (result) => {
        if (filter === 'post') {
            try {
                const answer = window.confirm("Are you sure ?");
                if (!answer) return;
                const { data } = await axios.delete(`/admin/delete-post/${result._id}`);
                if (data.ok) {
                    setMessage('Post Deleted')
                    fetchTotalPosts();
                    setResult(null);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (filter === 'user') {
            try {
                const answer = window.confirm("Are you sure ?");
                if (!answer) return;
                const { data } = await axios.delete(`/admin/delete-user/${result._id}`);
                if (data.ok) {
                    setMessage('User Deleted');
                    fetchTotalUsers();
                    fetchTotalPosts();
                    setResult(null);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        fetchTotalPosts();
        fetchTotalUsers();
    }, []);

    return (
        <AdminRoute>
            <div className={styles.container}>
                <h1 className={styles.heading}>Administrator Page</h1>

                <div className={styles.totalsContainer}>
                    <div className={styles.totalItem}>Total Users : {totalUsers}</div>
                    <div className={styles.totalItem}>Total Posts : {totalPosts}</div>
                </div>

                <form onSubmit={handleSearch} className={styles.searchContainer}>
                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder='search with post id or user id' className={styles.searchInput} />

                    <select onChange={(e) => setFilter(e.target.value)} defaultValue={filter} className={styles.filters}>
                        <option value="post">post</option>
                        <option value='user'>user</option>
                    </select>
                </form>


                {
                    result !== null && (
                        <section className={styles.results}>

                            {result.type === 'user' && (
                                <div className={styles.userCardContainer}>
                                    <Link href={`/user/${result._id}`} className={styles.userCard} passHref>
                                        <Avatar src={imageSource(result)} />
                                        <p className={styles.userCard__username}>{(result.username.length > 6) ? (result.username.slice(0, 7) + "...") : (result.username)}</p>
                                    </Link>

                                    <div className={styles.userDeleteContainer}>
                                        <div className={styles.postEditAndDelete}>
                                            <DeleteIcon onClick={() => handleDelete(result)} className={styles.reactionIcons} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {result.type === 'post' && (
                                <div className={styles.card}>
                                    <div className={styles.card__header}>
                                        <Avatar className="mb-1 mr-3" src={imageSource(result.postedBy)} />
                                        <Link href={`/user/${result.postedBy._id}`}>
                                            <span className={styles.username}>{result.postedBy.username}</span>
                                        </Link>
                                        <span className={styles.createdAt}>{moment(result.createdAt).fromNow()}</span>
                                    </div>
                                    <div className={styles.card__body}>
                                        {renderHTML(result.content)}
                                    </div>
                                    <div className={styles.card__footer}>
                                        {result.image && (
                                            <PostImage url={result.image.url} />
                                        )}
                                        <div className={styles.reactionDiv}>
                                            <div className={styles.reactionandcomments}>
                                                <div style={{ margin: "0 5px" }}>{result.likes.length} likes</div>
                                                <div style={{ margin: "0 5px" }}>
                                                    <Link href={`/post/${result._id}`} passHref>
                                                        {result.comments.length} comments
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className={styles.postEditAndDelete}>
                                                <DeleteIcon onClick={() => handleDelete(result)} className={styles.reactionIcons} />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            )}
                        </section>
                    )
                }

                {message && <div className={styles.results}>{message}</div>}

                {loading && <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><CircularProgress /></div>}
            </div>
        </AdminRoute >
    )
}

export default Admin