'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LoginUserContext = createContext();

export function LoginUserProvider({ children }) {
    const [user, setuser] = useState([]);

    const fetchuser = async () => {
        let req = await fetch("api/tokenvarify")
        let data = await req.json()
        setuser(data);
    }

    useEffect(() => {
        fetchuser()
    }, [])

    return (
        <LoginUserContext.Provider value={{
            user,
            setuser
        }}>
            {children}
        </LoginUserContext.Provider>
    );


}

export function LoginUserFunc() {
    const context = useContext(LoginUserContext);
    if (!context) {
        throw new Error('Check Login User Context Error');
    }
    return context;
}
