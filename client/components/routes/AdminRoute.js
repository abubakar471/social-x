import styles from "../../styles/UserRoute.module.scss";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from "../../context/UserContext";
import { useRouter } from 'next/router';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const AdminRoute = ({ children}) => {
    const [state] = useContext(UserContext);
    const [ok, setOk] = useState(false);
    const router = useRouter();

    const getCurrentAdmin = async () => {
        try {
            const { data } = await axios.get('/current-admin');
            console.log('userRoute => ', data);
            if (data.ok) setOk(true);
        } catch (err) {
            router.push("/");
        }
    }

    useEffect(() => {
        if (state && state.token) getCurrentAdmin();
    }, [state && state.token]);

    process.browser && state === null && setTimeout(() => {
        getCurrentAdmin();
    }, 1000);

    return !ok ? <div className={styles.loader}><CircularProgress disableShrink /></div> : <>{children}</>
}

export default AdminRoute;