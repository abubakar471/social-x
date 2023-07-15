import styles from "../../styles/Profile.module.scss"
import UserRoute from "../../components/routes/UserRoute";
import { useState, useContext, useEffect } from 'react';
import { UserContext } from "../../context/UserContext";
import { useRouter } from 'next/router';
import PostForm from "../../components/forms/PostForm";
import axios from 'axios';
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/People,";
import Link from "next/link";
import { Modal, Pagination } from "antd";
import CommentForm from "../../components/forms/CommentForm";
import Search from "../../components/Search";
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

// the reconnection option that we pass here to ensure to reconnect with the server again if the connection
// is lost somehow
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true
})

const Profile = () => {
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [newsFeed, setNewsFeed] = useState([]);
  const [people, setPeople] = useState([]);
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  //pagination
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(2);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  let collection = newsFeed.length > 0 ? newsFeed : posts;


  const getTotalPosts = async () => {
    const { data } = await axios.get('/profile-page-total-posts');
    console.log('total posts', data);

    setTotalPosts(data);
  }

  const fetchFollowings = async () => {
    try {
      let { data } = await axios.get("/user-followings");

      if (data.length > 8) {
        data = data.slice(0, 8);
        setPeople(data);
      } else {
        setPeople(data);
      }

    } catch (err) {
      console.log(err);
    }
  }

  const newsFeedFetcher = async () => {
    try {
      const { data } = await axios.get(`/news-feed`);
      console.log(data)
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/news-feed?page=${page}`);
      console.log(data)
      const rawArr = [...collection, ...data];
      setNewsFeed(rawArr);
      getTotalPosts();
      setPage(page + 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const findPeople = async () => {
    try {
      const { data } = await axios.get("/find-people");
      setPeople(data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put('/user-follow', { _id: user._id });
      let auth = JSON.parse(localStorage.getItem("user"));
      auth.user = data;
      localStorage.setItem("user", JSON.stringify(auth));
      setState({ ...state, user: data });

      //update people state
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);
      newsFeed();
      alert(`${auth.user.username} started following ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  }

  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log("content => ", content);
    try {
      const { data } = await axios.post("/create-post", {
        content,
        image
      });

      if (data.error) {
        alert(data.error);
      } else {

        setNewsFeed([data, ...collection]);
        getTotalPosts();
        setContent("");
        setImage({});
        // socket
        socket.emit("new-post", data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post('/upload-image', formData);
      // console.log("uploaded image", data);
      setImage({
        url: data.url,
        public_id: data.public_id
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
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
      getTotalPosts();
      setNewsFeed(rawArr);
    } catch (err) {
      console.log(err);
    }
  }

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });

      const rawArr = collection.map(p => {
        if (p._id === data._id) {
          return data;
        } else {
          return p;
        }
      });
      // console.log('raw array',rawArr)
      setNewsFeed(rawArr);

    } catch (err) {
      console.log(err);
    }
  }

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      const rawArr = collection.map(p => {
        if (p._id === data._id) {
          return data;
        } else {
          return p;
        }
      });
      setNewsFeed(rawArr);
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

      const rawArr = collection.map(p => {
        if (p._id === data._id) {
          return data;
        } else {
          return p;
        }
      });
      setNewsFeed(rawArr);
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

      const rawArr = collection.map(p => {
        if (p._id === data._id) {
          return data;
        } else {
          return p;
        }
      });
      setNewsFeed(rawArr);
    } catch (err) {
      console.log(err);
    }
  }

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));


  useEffect(() => {
    // fetch user posts
    if (state && state.token) {
      newsFeedFetcher();
      getTotalPosts();
      if (state.user.followings.length > 0) {
        fetchFollowings();
      }
    };

  }, [state && state.token]);



  return (
    <UserRoute>
      <div className={styles.container}>
        <div className={styles.wrapper}>

          <div className={styles.user_info}>
            <div className={styles.user_personal_details}>
              <div className={styles.image_and_name}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  {(state && state.token) && <Avatar className={styles.profileImage} alt="profile image" src={state.user.image ? (state.user.image.url) : ('/images/default.png')} />}
                </StyledBadge>

                <span className={styles.profileUsername}>{(state && state.token) && state.user.username}</span>
              </div>
              <div className={styles.about}>
                <p>{(state && state.token) && (state.user.about ? state.user.about : "None")}</p>
              </div>
              <hr style={{ margin: "10px 0" }} />
              <div style={{ margin: "10px 0" }} className={styles.extra_info}>
                <div className={styles.extra_info_item}>
                  <EmailIcon className={styles.extra_info_icon} /> <span>Email : </span> <span> &nbsp;{(state && state.token) && state.user.email}</span>
                </div>
                <div className={styles.extra_info_item}>
                  <PhoneIcon className={styles.extra_info_icon} /> <span>Phone : </span> <span> &nbsp;{(state && state.token) && state.user.phone}</span>
                </div>
                <div className={styles.extra_info_item}>
                  <HomeIcon className={styles.extra_info_icon} /> <span>Address : </span> <span> &nbsp;{(state && state.token) && state.user.address}</span>
                </div>
              </div>
            </div>

            <div className={styles.user_followings}>
              <h3 className={styles.user_followings_title}>{(state && state.user && state.user.followings) ? state.user.followings.length : "0"}<Link href="/user/followings" passHref><span>Followings</span></Link></h3>
              <hr style={{ margin: "10px 0" }} />
              <div className={styles.followings_container}>
                {
                  people.map((p) => (
                    <div key={p._id}>
                      <Link className={styles.following} href={`/user/${p._id}`} passHref>
                        <img className={styles.following_image} src={(state && state.token && p.image) ? p.image.url : "/images/default.png"} alt="following" />
                        <span>{p.username.slice(0, 6)} {(p.username.length > 6) && "..."}</span>
                      </Link>
                    </div>
                  ))
                }
                {(people.length > 7) && (
                  <div>
                    <Link style={{ color: "rgb(24, 139, 206)", fontFamily: "Arial" }} href="/user/followings" passHref>See More</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.posts_container}>
            <PostForm
              content={content}
              setContent={setContent}
              image={image}
              uploading={uploading}
              postSubmit={postSubmit}
              handleImage={handleImage}
            />
            <br />

            {/* <InfiniteScroll
              dataLength={posts.length}
              next={fetchData}
              hasMore={(posts.length < totalPosts) ? true : false} // Replace with a condition based on your data source
              loader={<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>}
              endMessage={<p>No more data to load.</p>}
            >
             
            </InfiniteScroll> */}

            {/* <InfiniteScroll
              dataLength={collection.length}
              next={fetchData}
              hasMore={collection.length < totalPosts}
              loader={<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>}
              endMessage={<p>No more data to load</p>}
            >
              
            </InfiniteScroll> */}

            <PostList
              posts={collection}
              handleDelete={handleDelete}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              handleComment={handleComment}
              removeComment={removeComment}
            />
            {(collection.length < totalPosts) && <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className={styles.loadMoreBtn} onClick={fetchData}>Load More</button>
            </div>}
          </div>

        </div>

        {/* <pre>{JSON.stringify(posts, null, 4)}</pre> */}

        <Modal visible={visible} footer={null} onCancel={() => setVisible(false)} title="Comment">
          <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
        </Modal>
      </div>
    </UserRoute>
  )
}



export default Profile