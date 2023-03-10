import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import reportWebVitals from './reportWebVitals'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider as RouterDomProvider,
} from 'react-router-dom'
import Root from './Routes/Root'
import ErrorPage from './Components/ErrorPage/ErrorPage'
import Login from './Authentication/Login/Login'
import Register from './Authentication/Register/Register'
import {
  UserInfoHandler,
  useUserInfoStore,
} from './Authentication/UserInfoContext'
import ProfileDetail, {
  ProfileDetailLoader,
  ProfileUserDetailLoader,
} from './Routes/Profiles/ProfileDetail/ProfileDetail'
import ProfileEdit, {
  ProfileEditLoader,
  ProfileEditAction,
} from './Routes/Profiles/ProfileEdit/ProfileEdit'
import PostForm, {
  PostFormAction,
  PostFormLoader,
} from './Routes/Posts/PostForm/PostForm'
import Logout from './Authentication/Logout/Logout'
import PostDetail, {
  PostDetailAction,
  PostDetailLoader,
} from './Routes/Posts/PostDetail/PostDetail'
import axios from 'axios'
import ExplorePage, {
  ExplorePageLoader,
} from './Routes/Posts/ExplorePage/ExplorePage'
import {
  DeletePostAction,
  DeletePostLoader,
} from './Routes/Posts/DeletePost/DeletePost'
import LikedPage, { LikedPageLoader } from './Routes/Posts/LikedPage/LikedPage'
import SearchPage, {
  SearchPageLoader,
} from './Routes/Posts/SearchPage/SearchPage'
import HomePage from './Routes/HomePage/HomePage'
import FeedPage, { FeedPageLoader } from './Routes/Posts/FeedPage/FeedPage'
import LandingPage from './Routes/LandingPage/LandingPage'
import { MessageOutput } from './Components/Messages/MessagesContext'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

/**
 * Wrapper Component for the react router provider
 * Defines all the routes used in the application
 * @returns {ReactElement}
 */
function RouterProvider(): ReactElement {
  const { loggedIn } = useUserInfoStore()

  // Creates all the routes for the application
  const routes = (isLoggedIn: boolean) =>
    createBrowserRouter([
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: '/',
        element: <Root />,
        children: [
          {
            path: '',
            errorElement: <ErrorPage />,
            children: [
              {
                path: 'home',
                element: isLoggedIn ? <FeedPage /> : <HomePage />,
                loader: isLoggedIn ? FeedPageLoader : undefined,
              },
              {
                path: 'login',
                element: isLoggedIn ? (
                  <Navigate to={'/home'} replace />
                ) : (
                  <Login />
                ),
              },
              {
                path: 'register',
                element: isLoggedIn ? (
                  <Navigate to={'/home'} replace />
                ) : (
                  <Register />
                ),
              },
              {
                path: 'logout',
                element: !isLoggedIn ? (
                  <Navigate to={'/home'} replace />
                ) : (
                  <Logout />
                ),
              },
              {
                path: 'profiles/:id',
                element: <ProfileDetail />,
                loader: ProfileDetailLoader,
              },
              {
                path: 'profiles/user',
                element: <ProfileDetail />,
                loader: ProfileUserDetailLoader,
              },
              {
                path: 'profiles/edit',
                element: <ProfileEdit />,
                loader: ProfileEditLoader,
                action: ProfileEditAction,
              },
              {
                path: 'explore',
                element: <ExplorePage />,
                loader: ExplorePageLoader,
              },
              {
                path: 'search',
                element: <SearchPage />,
                loader: SearchPageLoader,
              },
              {
                path: 'liked',
                element: <LikedPage />,
                loader: LikedPageLoader,
              },
              {
                path: 'posts/create',
                element: <PostForm />,
                action: PostFormAction,
              },
              {
                path: 'posts/:id',
                element: <PostDetail />,
                loader: PostDetailLoader,
                action: PostDetailAction,
              },
              {
                path: 'posts/:id/delete',
                action: DeletePostAction,
                loader: DeletePostLoader,
              },
              {
                path: 'posts/:id/edit',
                element: isLoggedIn ? <PostForm /> : <Navigate to={'/home'} />,
                action: PostFormAction,
                loader: PostFormLoader,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={'/'} replace />,
      },
    ])

  return <RouterDomProvider router={routes(loggedIn)} />
}

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider />
    <MessageOutput />
    <UserInfoHandler />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
