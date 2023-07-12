import styles from "../../styles/Profile.module.scss";
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

const CommentForm = ({ addComment, comment, setComment }) => {
    return (
        <form onSubmit={addComment}>
            <TextField onChange={(e) => setComment(e.target.value)} value={comment} className={styles.input} id="outlined-basic" label="Comment" variant="outlined" />
            <LoadingButton type="submit" className={styles.btn} loading={false} variant="contained">
                Comment
            </LoadingButton>
        </form>
    )
}

export default CommentForm;