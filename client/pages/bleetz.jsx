import PostForm from '@/components/forms/PostForm'
import React, { useState } from 'react'
import styles from "@/styles/Bleetz.module.scss"
import io from "socket.io-client";
import { useRouter } from "next/router";
import axios from 'axios';


// the reconnection option that we pass here to ensure to reconnect with the server again if the connection
// is lost somehow
const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
    reconnection: true
  })

const Bleetz = () => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);
    const router = useRouter();


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
                setContent("");
                setImage({});
                // socket
                socket.emit("new-post", data);
                router.push('/');
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


    return (
        <div className={styles.container}>
            <PostForm
                content={content}
                setContent={setContent}
                image={image}
                uploading={uploading}
                postSubmit={postSubmit}
                handleImage={handleImage}
            />
        </div>
    )
}

export default Bleetz