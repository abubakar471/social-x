import styles from "../styles/Signup.module.scss";
import AuthForm from "../components/forms/AuthForm";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [state, setState] = useContext(UserContext);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/forgot-password`, {
                email, newPassword, secret
            });
            if (data.error) {
                alert(data.error);
                setLoading(false);
            } else {
                alert(data.success);
                console.log(data);
                router.push("/signin");
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (state && state.token) {
        router.push("/");
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <section className={styles.hero}>
                    <img className={styles.heroImg} src="/images/image2.jpg" />
                </section>
                <section className={styles.form}>
                    <h1 className={styles.formHeading}>Forgot your Social X account password?</h1>
                    <ForgotPasswordForm
                        email={email}
                        setEmail={setEmail}
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
                        secret={secret}
                        setSecret={setSecret}
                        loading={loading}
                        handleSubmit={handleSubmit}
                    />
                </section>

            </div>
        </div>
    )
}

export default ForgotPassword