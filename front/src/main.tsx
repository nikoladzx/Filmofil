import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App';
import ReviewPage from './Reviews/ReviewPage';
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
}
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

