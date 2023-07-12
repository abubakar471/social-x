import styles from "../../styles/Signup.module.scss";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const ForgotPasswordForm = ({
    email, setEmail, newPassword, setNewPassword, secret, setSecret, handleSubmit, loading
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <TextField onChange={(e) => setEmail(e.target.value)} value={email} className={styles.input} id="outlined-basic" label="E-mail" variant="outlined" />
            <TextField onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className={styles.input} id="outlined-basic" label="Password" variant="outlined" />

            <>
                <div className={styles.selectionBox}>
                    <small>pick a question</small>
                    <select>
                        <option className={styles.item}>What is your nickname?</option>
                        <option className={styles.item}>Who is your first crush?</option>
                        <option className={styles.item}>What is your hobby?</option>
                    </select>
                </div>
                <p>you can use this to reset your password</p>
                <TextField onChange={(e) => setSecret(e.target.value)} value={secret} className={styles.input} id="outlined-basic" label="What's your answer" variant="outlined" />
            </>

            <LoadingButton type="submit" className={styles.input} loading={loading} variant="contained">
                Change Password
            </LoadingButton>
        </form>
    )
}

export default ForgotPasswordForm;