import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import PostForm from "../../../components/forms/PostForm";
import UserRoute from "../../../components/routes/UserRoute";
import styles from "../../../styles/EditPost.module.scss";

const EditPost = () => {
    const [post, setPost] = useState({});
    const router = useRouter();
    const _id = router.query._id;
    const [content, setContent] = useState("");
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

    const postSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.put(`/update-post/${_id}`, {
                content, image
            });
            if (data.error) {
                console.log(data.error);
                alert("Please Try Again!");
            } else {
                alert("post updated....")
                router.push("/user/profile");
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

    useEffect(() => {
        if (_id) fetchPost();
    }, [_id])

    const fetchPost = async () => {
        try {
            const { data } = await axios.get(`/user-post/${_id}`);
            setPost(data);
            setContent(data.content);
            setImage(data.image);
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <UserRoute>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div>
                        <PostForm
                            content={content}
                            setContent={setContent}
                            image={image}
                            uploading={uploading}
                            postSubmit={postSubmit}
                            handleImage={handleImage}
                        />
                    </div>
                    {/* <div>sidebar section here</div> */}
                </div>

            </div>
        </UserRoute>
    )

}

export default EditPost