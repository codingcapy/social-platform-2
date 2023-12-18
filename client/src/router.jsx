
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: router for CapySocial2
 */

import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";
import HomePage, { pageLoader } from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PostsPage, { postsLoader } from "./pages/PostsPage";
import ProfilePage, { userPostsLoader } from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailsPage, { postDetailsLoader } from "./pages/PostDetailsPage";
import MaintenancePage from "./pages/MaintenancePage";

export function Router() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<Layout />}>
                <Route path="/maintenance" element={<HomePage />} loader={pageLoader} />
                <Route path="/posts" element={<PostsPage />} loader={postsLoader} />
                <Route path="/users/login" element={<LoginPage />} />
                <Route path="/users/signup" element={<SignupPage />} />
                <Route path="/posts/:postId" element={<PostDetailsPage />} loader={postDetailsLoader} />
                <Route path="/users/:userId" element={<ProfilePage />} loader={userPostsLoader} />
                <Route path="/posts/create" element={<CreatePostPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/posts/maintenance" element={<MaintenancePage />} />
                <Route path="/users/maintenance" element={<MaintenancePage />} />
            </Route>
        )
    )
    return router
}