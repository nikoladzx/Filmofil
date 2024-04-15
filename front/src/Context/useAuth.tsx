import { createContext, useEffect, useState } from "react";
import { User } from "../User/user";
import agent from "../API/agent";
import React from "react";
import axios from "axios";

type UserContextType = {
    user: User | null;
    token : string ;
    registerUser: (username : string, password : string, role : boolean) => void;
    loginUser: (username:string, password: string) => void;
    logout: () =>void;
    getCurrentUser: ()=> void;
}
type Props = {children: React.ReactNode};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({children} : Props) => {
    const [token, setToken] = useState<string>("");
    const [user, setUser] = useState<User | null> (null);
    const [isReady, setIsReady] = useState(false);

    useEffect(()=>{
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token)
            {
                
                setUser(JSON.parse(user));
                setToken(token);
                console.log(token);
                console.log(user);
               
                axios.defaults.headers.common["Authorization"] = "Bearer "+ token;
                
            }
            setIsReady(true);
    },[]);

    const registerUser = async (
        username:string,
        password:string,
        role:boolean
    ) => agent.Home.register(username, password, role)
    .then((res)=>{
        if(res){
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            setUser(res.user);
            setToken(JSON.parse(res.token));
            console.log(user?.role)

        }
        
    })
    .catch(error=>console.log(error))
const loginUser = async (
    username:string,
    password:string
) => await agent.Home.login(username, password)
.then((res)=>{
    if(res){
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        setToken(res.token);
        console.log(res.user);
        
    }
    
}
)
.catch(error=>console.log(error))

const logout = () =>
    {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
    }
const getCurrentUser = () =>
    {
        setToken(localStorage.getItem("token")!)
        setUser(JSON.parse(localStorage.getItem("user")!));
    }
 return (
    <UserContext.Provider value={{user, token, getCurrentUser, registerUser, loginUser, logout}}>
        {isReady ? children : null}
    </UserContext.Provider>
 )
};
export const useAuth = () => React.useContext(UserContext);
