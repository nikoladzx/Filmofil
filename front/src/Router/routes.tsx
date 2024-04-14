import { Navigate, createBrowserRouter } from "react-router-dom";

import Movies from "../Movies/movies";
import App from "../App";


export const router=createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            
            {path:'/movies', element: <Movies/>},

            {path: '*', element: <Navigate replace to = '/not-found'/>}
           //{path: '*', element: <NotFound/>}
        ]
    }
])