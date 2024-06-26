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
import CreateMovie from './Movies/CreateMovie';
import EditReviewPage from './Reviews/EditReviewPage';


const router = createBrowserRouter([{
  path: '/',
  element: <App/>,
},
{
  path: '/addreview',
  element: <ReviewPage/>
},
{
  path: '/movies',
  element: <App/>
},
{
  path: '/addreview/:movieId',
  element: <ReviewPage/>
},
{
  path: '/editreview/:reviewID/:authorID',
  element: <EditReviewPage/>
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
  path: '/createmovie',
  element: <CreateMovie/>
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

