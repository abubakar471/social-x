import { useState, useEffect, useContext } from 'react';
import Head from 'next/head'
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ForumIcon from '@mui/icons-material/Forum';
import TagIcon from '@mui/icons-material/Tag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Search from '@/components/Search';
import People from '@/components/cards/People,';
import { UserContext } from '../context/UserContext';
import axios from 'axios'
import io from "socket.io-client";
import { useRouter } from "next/router";
import PostForm from '@/components/forms/PostForm';
import PostPublic from "../components/cards/PostPublic";
import { Modal } from "antd";
import CommentForm from "../components/forms/CommentForm";
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

// the reconnection option that we pass here to ensure to reconnect with the server again if the connection
// is lost somehow
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  reconnection: true
})


const Home = ({ posts }) => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(2);
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [comment, setComment] = useState('');
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const [newsFeed, setNewsFeed] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);

  let collection = newsFeed.length > 0 ? newsFeed : posts;

  const getTotalPosts = async () => {
    const { data } = await axios.get('/total-posts');
    setTotalPosts(data);
  }

  useEffect(() => {
    getTotalPosts();
  }, [])

  useEffect(() => {
    // fetch user posts
    if (state && state.token) {
      // newsFeed();
      findPeople();
    };
  }, [state && state.token && state.user, page]);


  socket.on('new-post', (newPost) => {
    setNewsFeed([newPost, ...collection]);
    setTotalPosts(totalPosts + 1);
  })
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/posts?page=${page}`);
      setNewsFeed([...collection, ...data]);
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

  const newsFeedFetcher = async () => {
    try {
      // const { data } = await axios.get(`/posts?page=${page}`);
      // console.log(data);
      // const rawPost = collection.filter(p => p._id === _id);

      for (let i = 0; i < collection.length; i++) {
        if (collection[i]._id === data._id) {
          collection[i] = data;
        }
      }
      // updatedArray = newsFeed[]
      // setNewsFeed([...collection, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log("content => ", content);
    try {
      const { data } = await axios.post("/create-post", {
        content,
        image
      });
      console.log("this post was created => ", data);
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
        if(p._id !== post._id){
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
        if(p._id === data._id){
          return data;
        } else{
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
        if(p._id === data._id){
          return data;
        } else{
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
        if(p._id === data._id){
          return data;
        } else{
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
        if(p._id === data._id){
          return data;
        } else{
          return p;
        }
      });
      setNewsFeed(rawArr);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>Social X -coxas</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon_logo2.ico" />

      </Head>
      <main className={styles.container}>
        <div className={styles.sidebar_links}>
          <Link href="/" passHref className={styles.sidebar_link_item}><span><HomeIcon />Home</span></Link>
          <Link href="/user/profile" passHref className={styles.sidebar_link_item}><span><AccountCircleIcon />Profile</span></Link>
          <Link href="/friends" passHref className={styles.sidebar_link_item}><span><PeopleAltIcon />Friends</span></Link>
          <Link href="/forum" passHref className={styles.sidebar_link_item}><span><ForumIcon />Forum</span></Link>
          <Link href="/saved-items" passHref className={styles.sidebar_link_item}><span><TagIcon />Saved Items</span></Link>
        </div>
        <section>
          <PostForm
            content={content}
            setContent={setContent}
            image={image}
            uploading={uploading}
            postSubmit={postSubmit}
            handleImage={handleImage}
          />
          <br />



          <InfiniteScroll
            dataLength={collection.length}
            next={fetchData}
            hasMore={collection.length < totalPosts} // Replace with a condition based on your data source
            loader={<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>}
            endMessage={<p>No more data to load.</p>}
          >
            {collection.map(post => (
              <PostPublic key={post._id}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                handleDelete={handleDelete}
                handleComment={handleComment}
                removeComment={removeComment}
                post={post}
              />
            ))}
          </InfiniteScroll>

        </section>
        <section>
          <div>
            <Search className={styles.search__section} findPeople={findPeople} />
            <People people={people} handleFollow={handleFollow} />
          </div>
        </section>


        <Modal visible={visible} footer={null} onCancel={() => setVisible(false)} title="Comment">
          <CommentForm comment={comment} setComment={setComment} addComment={addComment} />
        </Modal>
      </main>
    </>
  )
}


export async function getServerSideProps() {
  const { data } = await axios.get('https://social-x-backend.onrender.com/api/posts');

  return {
    props: {
      posts: data
    }
  }
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });