import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Movies from "../Movies/movies";


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