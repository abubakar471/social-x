import moment from "moment";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { List } from "antd";
import styles from "../../styles/People.module.scss";
import Link from "next/link";

const People = ({ people, handleFollow, handleUnfollow }) => {
    const [state] = useContext(UserContext);
    const router = useRouter();
    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        } else {
            return '/images/default.png';
        }
    }

    return (
        <>
            {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
            <List
                itemLayout="horizontal"
                dataSource={people}
                renderItem={(user) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={imageSource(user)} />}
                            title={
                                <div className={styles.container}>
                                    <Link href={`/user/${user._id}`} passHref>
                                        {(user.username.length > 6) ? (user.username.slice(0, 7) + "...") : (user.username)}
                                    </Link>
                                    {state && state.user && user.followers && user.followers.includes(state.user._id) ? (
                                        <span
                                            className={styles.btn}
                                            onClick={() => handleUnfollow(user)}>
                                            Unfollow
                                        </span>
                                    ) : (
                                        <span
                                            className={styles.btn}
                                            onClick={() => handleFollow(user)}>
                                            Follow
                                        </span>
                                    )}
                                </div>
                            } />
                    </List.Item>
                )}
            />
        </>
    )
}

export default People;