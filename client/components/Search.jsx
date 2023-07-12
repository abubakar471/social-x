import axios from 'axios';
import { useState, useContext } from 'react'
import { UserContext } from "../context/UserContext";
import People from './cards/People,';
import styles from "../styles/Search.module.scss";
import { Button, TextField } from '@mui/material';

const Search = ({ findPeople }) => {
    const [state, setState] = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);

    const searchUser = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.get(`/search-user/${query}`);
            setResult(data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleFollow = async (user) => {
        try {
            const { data } = await axios.put('/user-follow', { _id: user._id });
            let auth = JSON.parse(localStorage.getItem("user"));
            auth.user = data;
            localStorage.setItem("user", JSON.stringify(auth));
            setState({ ...state, user: data });

            //update people state
            let filtered = result.filter((p) => p._id !== user._id);
            setResult(filtered);
            alert(`${auth.user.username} started following ${user.username}`);
        } catch (err) {
            console.log(err);
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
            let filtered = result.filter((p) => p._id !== user._id);
            setResult(filtered);
            findPeople();
            alert(`${auth.user.username}  Unfollowed ${user.username}`);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            <form className={styles.searchbox_container} onSubmit={searchUser} >
                <TextField
                    className={styles.form__input}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setResult([]);
                    }}
                    value={query}
                    type="search" placeholder='search'
                    id="outlined-basic"
                    label="search"
                    variant="outlined" />
                <Button className={styles.search__btn} type='submit' variant="contained">search</Button>
            </form>
            {result && result.map(r => <People key={r._id} people={result}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow} />)
            }
        </>
    )
}

export default Search