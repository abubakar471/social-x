import styles from "@/styles/Friends.module.scss"
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import axios from "axios";
import Link from "next/link";
import { CircularProgress, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";

const Friends = () => {
    const [state, setState] = useContext(UserContext);
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const findPeople = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/find-people');
            console.log(data);
            if (data) {
                setPeople(data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (state && state.token) {
            findPeople();
        }
    }, [state && state.token]);

    const handleFollow = async (user) => {
        try {
            const { data } = await axios.put('/user-follow', { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("user"));
            auth.user = data;
            localStorage.setItem("user", JSON.stringify(auth));
            setState({ ...state, user: data });

            //update people state
            let filtered = people.filter((p) => p._id !== user._id);
            setPeople(filtered);
            alert(`${auth.user.username} started following ${user.username}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            {people ? (
                <div>
                    <div className={styles.heading}>

                        <h1 className={styles.title}><IconButton>
                            <ArrowBackIcon onClick={() => router.back()} ></ArrowBackIcon>
                        </IconButton>People you may know</h1>
                    </div>

                    <div className={styles.friendsContainer}>
                        {people.map(p => (
                            <div className={styles.card} >
                                <Link href={`/user/${p._id}`} passHref key={p._id}>
                                    <img className={styles.peopleImage} src={(state && state.token && p.image) ? p.image.url : "/images/default.png"} alt="following" />
                                    <p className={styles.username}>{p.username}</p>
                                </Link>
                                <button onClick={() => handleFollow(p)} className={styles.followBtn}>Follow</button>
                            </div>
                        ))}
                    </div>

                    {loading && <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress />
                    </div>}
                </div>
            ) : (
                <div>loading</div>
            )}
        </div>
    )
}

export default Friends