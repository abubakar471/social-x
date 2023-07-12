import styles from "../../../styles/Signup.module.scss";
import AuthForm from "../../../components/forms/AuthForm";
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CircularProgress from '@mui/material/CircularProgress';

const ProfileUpdate = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [about, setAbout] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [state, setState] = useContext(UserContext);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // profile image
    const [image, setImage] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (state && state.user) {
            setUsername(state.user.username);
            setEmail(state.user.email);
            setAbout(state.user.about);
            setImage(state.user.image);
            setPhone(state.user.phone);
            setAddress(state.user.address);
        }
    }, [state && state.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.put(`/profile-update`, {
                username, email, password, secret, about, phone, address, image
            });
            if (data.error) {
                alert(data.error);
                setLoading(false);
            } else {
                // update localstorage, update user and token
                let auth = JSON.parse(localStorage.getItem("user"));
                auth.user = data;
                localStorage.setItem("user", JSON.stringify(auth));
                setState({ ...state, user: data });
                setOk(true);
                console.log("ite executed")
                setLoading(false);
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
            <div className={styles.wrapper}>
                <section className={styles.hero}>
                    <img className={styles.heroImg} src="/images/image2.jpg" />
                </section>
                <section className={styles.form}>
                    <h1 className={styles.formHeading}>Update Profile</h1>

                    <label>
                        {image && image.url ? (<Avatar src={image.url} className={styles.imageAvatar} />) : uploading ? <CircularProgress disableShrink className={styles.imageLoading} /> : <CameraAltIcon className={styles.cameraIcon} />}
                        <input type="file" accept="images/*" hidden onChange={handleImage} />
                    </label>

                    <AuthForm
                        profileUpdate={true}
                        username={username}
                        setUsername={setUsername}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        secret={secret}
                        setSecret={setSecret}
                        about={about}
                        setAbout={setAbout}
                        phone={phone}
                        setPhone={setPhone}
                        address={address}
                        setAddress={setAddress}
                        loading={loading}
                        handleSubmit={handleSubmit}
                    />
                    <Link href="/signin" passHref>Already have an account | Log In Instead</Link>
                </section>

            </div>
        </div>
    )
}

export default ProfileUpdate;