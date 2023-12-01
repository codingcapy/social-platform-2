import DOMAIN from "../services/endpoint";
import axios from "axios"
import useAuthStore from "../store/AuthStore";
import { useLoaderData } from "react-router-dom"
import { Link } from "react-router-dom";

export default function ProfilePage(){

    const { user } = useAuthStore((state) => state);
    const incomingData = useLoaderData();

    return(
        <div>
            <h2 className="py-10 text-2xl text-slate-700 font-medium">Your Profile</h2>
            <p>Username: {user.username}</p>
            <h2 className="py-10 text-2xl text-slate-700 font-medium">Your Posts</h2>
            <h2 className="py-10 text-2xl text-slate-700 font-medium">Your Comments</h2>
            <h2 className="py-10 text-2xl text-slate-700 font-medium">Your Replies</h2>
        </div>
    )
}