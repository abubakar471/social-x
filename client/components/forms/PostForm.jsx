import styles from "../../styles/CreatePostForm.module.scss";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
// we can't import react-quill like normal import because it works just fine and normal in core react js but not in next js. cause , next js uses both
// server side rendering(SSR) and client side rendering but react quill only works on client side rendering . so to integrate it with next js we need to
// use dynamic import and in dynamic import we need to set the option for ssr (server side rendering) to false.
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const PostForm = ({ content, setContent, image, postSubmit, handleImage, uploading }) => {
    return (
        <div className={styles.postFormCard}>
            <form onSubmit={postSubmit}>
                <ReactQuill
                    className={styles.reactQuill}
                    theme="snow"
                    value={content}
                    onChange={(e) => setContent(e)}
                    placeholder="What's in your mind?"
                />


                <div className={styles.postFormBtnGroup}>
                    <Button type="submit" variant="contained" className={styles.postButton}>Post</Button>
                    <label>
                        {image && image.url ? (<Avatar src={image.url} className={styles.imageAvatar} />) : uploading ? <CircularProgress disableShrink className={styles.imageLoading} /> : <CameraAltIcon className={styles.cameraIcon} />}
                        <input type="file" accept="images/*" hidden onChange={handleImage} />
                    </label>
                </div>
            </form>
        </div>
    )
}

export default PostForm;