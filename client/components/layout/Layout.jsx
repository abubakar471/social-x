import React, { PropsWithChildren, useContext } from "react";
import Navbar from "../navbar/Navbar";
import styles from "../../styles/Navbar.module.scss";
import { UserContext } from '@/context/UserContext';

const Layout = ({ children }, PropsWithChildren) => {
    const [state, setState] = useContext(UserContext);
    return (
        <>
            <Navbar state={state} setState={setState} />
            <div className={styles.layout}>{children}</div>
        </>
    );
};
export default Layout;