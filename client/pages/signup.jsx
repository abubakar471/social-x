import styles from "../styles/Signup.module.scss";
import AuthForm from "../components/forms/AuthForm";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [state, setState] = useContext(UserContext);
    const [ok, setOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/signup`, {
                username, email, password, secret, phone, address
            });
            if (data.error) {
                alert(data.error);
                setLoading(false);
            } else {
                setUsername("");
                setEmail("");
                setPassword("");
                setSecret("");
                setPhone("");
                setAddress("");
                setOk(data.ok);
                setLoading(false);
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
                    <h1 className={styles.formHeading}>Sign up for  a Social X account</h1>
                    <AuthForm
                        username={username}
                        setUsername={setUsername}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        secret={secret}
                        setSecret={setSecret}
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

export default Signup