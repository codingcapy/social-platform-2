
import { NavLink } from "react-router-dom"
import useAuthStore from "../store/AuthStore"

import { getUserIdFromToken } from "../services/jwt.service"

export default function Header() {

    const { logoutService, user } = useAuthStore((state) => state)
    const userId = getUserIdFromToken()

    return (
        <header className="md:flex justify-between bg-slate-700 text-white">
            <div className="flex flex-col md:block md:py-5">
                <NavLink to="/" className="text-center py-5 px-5">CapySocial2</NavLink>
                <NavLink to="/" className="text-center py-5 px-5">Home</NavLink>
            </div >
            <div className="flex flex-col md:block md:py-5">
                <NavLink to="/posts" className="text-center py-5 px-5">Posts</NavLink>
                {user && <NavLink to="posts/create" className="text-center py-5 px-5">Create</NavLink>}
            </div>
            <div className="flex flex-col md:block md:py-5">
                {!user && <NavLink to="/users/login" className="text-center py-5 px-5">Login</NavLink>}
                {!user && <NavLink to="/users/signup" className="text-center py-5 px-5" >Signup</NavLink>}
                {user && <span><NavLink to={`users/${userId.toString()}`} className="text-center py-5 px-5">{user.username}</NavLink></span>}
                {user && <NavLink to="/" onClick={logoutService} className="text-center py-5 px-5">Logout</NavLink>}
            </div>
        </header>
    )
}