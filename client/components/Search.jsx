import axios from 'axios';
import { useState, useContext } from 'react'
import { UserContext } from "../context/UserContext";
import People from './cards/People,';
import styles from "../styles/Search.module.scss";
import { Button, TextField } from '@mui/material';

const Search = ({ findPeople, setPeople }) => {
    const [state, setState] = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);
    const [message, setMesssage] = useState("");

    const searchUser = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.get(`/search-user/${query}`);
            
            if(data.length <= 0){
                setMesssage("No result found!")
            } else{
                setResult(data);
            }
        
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
                        setMesssage("");
                        setResult([]);
                    }}
                    value={query}
                    type="search" placeholder='search'
                    id="outlined-basic"
                    label="search"
                    variant="outlined" />
                <Button className={styles.search__btn} type='submit' variant="contained">search</Button>
            </form>
            {result.length > 0 ? (
                <div>
                    <h3 className={styles.results__length}>search results ({result.length})</h3>
                    <People people={result} handleFollow={handleFollow} handleUnfollow={handleUnfollow} />
                </div>
            ) : <div className={styles.hr}>{message}</div>}

            {result.length > 0 && <hr className={styles.hr} />}
        </>
    )
}

export default Search