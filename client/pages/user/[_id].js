import { useContext, useState, useEffect, react } from "react";
import moment from "moment";
import { UserContext } from "../../context/UserContext";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { List, Card } from "antd";
import styles from "../../styles/Followings.module.scss";
import axios from "axios";

const { Meta } = Card;

const UserById = () => {
    const [state, setState] = useContext(UserContext);
    const router = useRouter();
    const [user, setUser] = useState({});

    useEffect(() => {
        if (router.query._id) fetchUser();
    }, [router.query._id])

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`/user/${router.query._id}`);
            setUser(data);
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


    return (
        <div className={styles.container}>
            {/* <pre>{JSON.stringify(user, null, 4)}</pre> */}

            <div className={styles.card_body}>
                <Card hoverable cover={<img src={imageSource(user)} className={styles.user_image} alt={user.username} />}>
                    <Meta title={user.username} description={user.about} />

                    <p className="pt-5 text-muted">Joined {moment(user.createdAt).fromNow()}</p>

                    <div className={styles.box}>
                        <span className="btn btn-sm">{user.followers && user.followers.length} followers</span>
                        <span className="btn btn-sm">{user.followers && user.followings.length} followings</span>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default UserById;