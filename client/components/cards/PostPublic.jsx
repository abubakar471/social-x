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
import { IconButton } from '@mui/material';

const PostPublic = ({ post, handleDelete, handleLike, handleUnlike, handleComment, removeComment, commentsCount = 2 }) => {
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
        <>
            {post && post.postedBy && (
                  <div key={post._id} className={styles.card}>
                  <div className={styles.card__header}>
                      <Avatar className="mb-1 mr-3" src={imageSource(post.postedBy)} />
                      <Link href={`/user/${post.postedBy._id}`}>
                          <span className={styles.username}>{post.postedBy.username}</span>
                      </Link>
                      <span className={styles.createdAt}>{moment(post.createdAt).fromNow()}</span>
                  </div>
                  <div className={styles.card__body}>
                      {renderHTML(post.content)}
                  </div>
                  <div className={styles.card__footer}>
                      {post.image && (
                          <PostImage url={post.image.url} />
                      )}
                      <div className={styles.reactionDiv}>
                          <div className={styles.reactionandcomments}>
                              {state && state.user && post.likes && post.likes.includes(state.user._id) ?
                                  (<IconButton onClick={() => handleUnlike(post._id)} className={styles.reactionIcons}>
                                      <FavoriteIcon />
                                  </IconButton>)
                                  : (<IconButton onClick={() => handleLike(post._id)} className={styles.reactionIcons}>
                                      <FavoriteBorderIcon />
                                  </IconButton>)
                              }
                              <div style={{ margin: "0 5px" }}>{post.likes.length} likes</div>
                              <CommentIcon onClick={() => handleComment(post)} className={styles.reactionIcons} />
                              <div style={{ margin: "0 5px" }}>
                                  <Link href={`/post/${post._id}`} passHref>
                                      {post.comments.length} comments
                                  </Link>
                              </div>
                          </div>

                          {state && state.user && state.user._id === post.postedBy._id && (
                              <div className={styles.postEditAndDelete}>
                                  <EditIcon onClick={() => router.push(`/user/post/${post._id}`)} className={styles.reactionIcons} />
                                  <DeleteIcon onClick={() => handleDelete(post)} className={styles.reactionIcons} />
                              </div>
                          )}
                      </div>

                      {post.comments && post.comments.length > 0 && (
                          <ol style={{ listStyleType: "none" }} className='list-group'>
                              {post.comments.slice(0, commentsCount).map(c => (
                                  <li className={styles.comment_container}>
                                      <div className='ms-2 me-auto'>
                                          <div className={styles.comment_user_info}>
                                              <div className={styles.comment_user_info_item}>
                                                  <Avatar className="mb-1 mr-3" src={imageSource(c.postedBy)} />
                                                  <span style={{ marginLeft: "5px" }}>{c.postedBy.username}</span>
                                              </div>
                                              <div>
                                                  <div className={styles.comment_time}>
                                                      {moment(c.created).fromNow()}
                                                      {state && state.user && state.user._id === c.postedBy._id && (
                                                          <DeleteIcon onClick={() => removeComment(post._id, c)} className={styles.reactionIcons} />
                                                      )}
                                                  </div>
                                              </div>
                                          </div>
                                          <div>{c.text}</div>
                                      </div>


                                  </li>
                              ))}
                          </ol>
                      )}
                  </div>
              </div>
            )}
        </>
    )
}

export default PostPublic;