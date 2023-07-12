import moment from "moment";
import { UserContext } from "../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { List } from "antd";
import styles from "../../styles/Followings.module.css";
import axios from "axios";
import Link from "next/link";

const Followings = () => {
    const [state, setState] = useContext(UserContext);
    const router = useRouter();
    const [people, setPeople] = useState([]);

    useEffect(() => {
        if (state && state.token) fetchFollowings();
    }, [state && state.token])

    const fetchFollowings = async () => {
        try {
            const { data } = await axios.get("/user-followings");
            console.log(data);
            setPeople(data);
        } catch (err) {
            console.log(err);
        }
    }
    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return '/images/default.png';
        }
    }

    const handleUnfollow = async (user) => {
        try {
            const { data } = await axios.put("/user-unfollow", { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("user"));
            auth.user = data;
            localStorage.setItem("user", JSON.stringify(auth));
            setState({ ...state, user: data });

            //update people state
            let filtered = people.filter((p) => p._id !== user._id);
            setPeople(filtered);
            alert(`${auth.user.username}  Unfollowed ${user.username}`);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className={styles.container}>
            {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
            <h1 className="heading">Followings</h1>
            <List
                itemLayout="horizontal"
                dataSource={people}
                renderItem={(user) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={imageSource(user)} />}
                            title={
                                <div className={styles.box}>
                                    <span><Link href={`/user/${user._id}`} passHref>{user.username}</Link></span>
                                    <span
                                        className={styles.btn}
                                        onClick={() => handleUnfollow(user)}>
                                        Unfollow
                                    </span>
                                </div>
                            } />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Followings;