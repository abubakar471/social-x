import { useContext } from 'react';
import styles from "../../styles/PostList.module.scss";
import Avatar from '@mui/material/Avatar';
import renderHTML from 'react-render-html';
import moment from 'moment';
import PostImage from "../images/PostImage";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Post from './Post';

const PostList = ({ posts, handleDelete, handleLike, handleUnlike, handleComment, removeComment }) => {
    const [state] = useContext(UserContext);
    const router = useRouter();
    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return '/images/default.png';
        }
    }

    return (
        <div className={styles.container}>
            {
                posts && posts.map((post) => (
                    <Post key={post._id} post={post}
                        handleLike={handleLike}
                        handleUnlike={handleUnlike}
                        handleComment={handleComment}
                        handleDelete={handleDelete}
                        removeComment={removeComment}
                    />
                ))
            }
        </div>
    )
}

export default PostList;