import axios from "axios";
import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [state, setState] = useState({
        user: {},
        token: ""
    });

    useEffect(() => {
        setState(JSON.parse(window.localStorage.getItem("user")))
    }, []);

    const router = useRouter();
    const token = (state && state.token) ? state.token : null;
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            let res = error.response;
            if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
                setState(null);
                window.localStorage.removeItem("user");
                router.push("/signin");
            }
        }
    )
    return (
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };