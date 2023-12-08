
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: Header component for CapySocial2
 */

import { NavLink } from "react-router-dom"
import useAuthStore from "../store/AuthStore"
import { RxMagnifyingGlass } from "react-icons/rx";
import { getUserIdFromToken } from "../services/jwt.service"
import useSearchStore from "../store/SearchStore"
import { useState } from "react";
import { IoHomeSharp } from "react-icons/io5";

export default function Header() {

    const { logoutService, user } = useAuthStore((state) => state)
    const { content, setContent } = useSearchStore((state) => state)
    const [expandedMenu, setExpandedMenu] = useState(true)
    const userId = getUserIdFromToken()

    function toggleMenu() {
        setExpandedMenu(!expandedMenu)
    }

    return (
        <header className="sticky z-50 top-0 md:flex justify-between bg-slate-700 text-white">
            {expandedMenu && <div className="flex flex-col md:flex-row">
                <NavLink to="/" className="text-center py-5 px-5">CapySocial2</NavLink>
                <NavLink to="/" className="flex py-2 md:py-5 mx-auto"><IoHomeSharp size={20} className=" text-center mx-2"/> Home</NavLink>
            </div >}
            {expandedMenu && <div>
                <div className="flex px-2 my-3 border rounded-lg border-white py-1 "><RxMagnifyingGlass size={25} className="" /> <input type="text" className="bg-transparent text-white focus:outline-none" placeholder="Search CapySocial" onChange={(e) => setContent(e.target.value)} /></div>
            </div>}
            {expandedMenu && <div className="flex flex-col md:block md:py-5">
                <NavLink to="/posts" className="text-center py-2 md:py-5 px-5">Posts</NavLink>
                {user && <NavLink to="posts/create" className="text-center py-2 md:py-5 px-5">Create</NavLink>}
            </div>}
            {expandedMenu && <div className="flex flex-col md:block md:py-5">
                {!user && <NavLink to="/users/login" className="text-center py-2 md:py-5 px-5">Login</NavLink>}
                {!user && <NavLink to="/users/signup" className="text-center py-2 md:py-5 px-5" >Signup</NavLink>}
                {user && <NavLink to={`users/${userId.toString()}`} className="text-center py-2 md:py-5 px-5">{user.username}</NavLink>}
                {user && <NavLink to="/" onClick={logoutService} className="text-center py-2 md:py-5 px-5">Logout</NavLink>}
            </div>}
            <div onClick={toggleMenu} className="text-center py-2 md:py-5 text-2xl md:hidden">&#127828;</div>
        </header>
    )
}