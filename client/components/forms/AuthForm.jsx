import styles from "../../styles/Signup.module.scss";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const AuthForm = ({ username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    secret,
    setSecret,
    about,
    setAbout,
    phone,
    setPhone,
    address,
    setAddress,
    handleSubmit,
    loading,
    page,
    profileUpdate
}) => {
    return (
        <form onSubmit={handleSubmit}>
            {page !== "signin" && (<TextField onChange={(e) => setUsername(e.target.value)} value={username} className={styles.input} id="outlined-basic" label="Username" variant="outlined" />)}
            <TextField onChange={(e) => setEmail(e.target.value)} disabled={profileUpdate} value={email} className={styles.input} id="outlined-basic" label="E-mail" variant="outlined" />
            <TextField onChange={(e) => setPassword(e.target.value)} value={password} className={styles.input} id="outlined-basic" label="Password" variant="outlined" />
            {page !== "signin" && (
                <>
                    <TextField onChange={(e) => setPhone(e.target.value)} value={phone} className={styles.input} id="outlined-basic" label="Phone" variant="outlined" />
                    <TextField onChange={(e) => setAddress(e.target.value)} value={address} className={styles.input} id="outlined-basic" label="Address" variant="outlined" />
                </>
            )}
            {page !== "signin" && (
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
            )}

            {profileUpdate && (
                <TextField onChange={(e) => setAbout(e.target.value)} value={about} className={styles.input} id="outlined-basic" label="About" variant="outlined" />
            )}

            <LoadingButton type="submit" className={styles.input} loading={loading} variant="contained">
                {!profileUpdate ? (page !== "signin" ? "Sign Up" : "Sign In") : "Update Profile"}
            </LoadingButton>
        </form>
    )
}

export default AuthForm