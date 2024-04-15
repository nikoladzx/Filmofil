import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App';
import ReviewPage from './Reviews/ReviewPage';
import LoginPage from './User/LoginPage';
import RegisterPage from './User/RegisterPage';
import ReviewList from './Reviews/ReviewList';
import CommentList from './Comments/CommentsList';
import { UserProvider } from './Context/useAuth';
const router = createBrowserRouter([{
  path: '/',
  element: <App/>,
},
{
  path: '/addreview',
  element: <ReviewPage/>
},
{
  path: '/addreview/:movieId',
  element: <ReviewPage/>
},
{
  path: '/Login',
  element: <LoginPage/>
},
{
  path: '/Register',
  element: <RegisterPage/>
},
{
  path: '/Reviews/:movieId',
  element: <ReviewList/>
},
{
  path: '/comments/:reviewId',
  element: <CommentList/>
}
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
<UserProvider>
<RouterProvider router={router}/>
</UserProvider>
   

  </React.StrictMode>,
)

