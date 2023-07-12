import styles from "../styles/Signup.module.scss";
import AuthForm from "../components/forms/AuthForm";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ok, setOk] = useState(false);
    const [state, setState] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/signin`, {
                email, password
            });
            if (data.error) {
                alert(data.error);
                setLoading(false);
            } else {
                setState({
                    user: data.user,
                    token: data.token
                });
                window.localStorage.setItem("user", JSON.stringify(data));
                setEmail("");
                setPassword("");
                setOk(data.ok);
                setLoading(false);
                router.push("/");
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    if (state && state.token) {
        router.push("/");
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <section className={styles.hero}>
                    <img className={styles.heroImg} src="/images/image1.jpg" />
                </section>
                <section className={styles.form}>
                    <h1 className={styles.formHeading}>Sign In with your Social X account</h1>
                    <AuthForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                        handleSubmit={handleSubmit}
                        page="signin"
                    />
                    <Link href="/signup" passHref>Don't have an account | Sign up Instead</Link>
                    <Link href="/forgot-password" passHref>Forgot password</Link>
                </section>

            </div>
        </div>
    )
}

export default Signin