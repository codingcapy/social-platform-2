
import axios from "axios"
import DOMAIN from "../services/endpoint";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { getUserIdFromToken } from "../services/jwt.service";
import { useState } from "react";

export default function PostDetailsPage() {

    const data = useLoaderData();
    const { user } = useAuthStore((state) => state);
    const userId = getUserIdFromToken();
    const [editMode, setEditMode] = useState(false)
    const navigate = useNavigate();

    return (
        <div>
            <p>Posted by <strong>{data.post.username}</strong> on {data.post.date} {data.post.edited && "(edited)"}</p>
            <h2 className="py-5 text-2xl text-slate-700 font-medium text-center">{data.post.title}</h2>
            <p>Upvotes: {data.postVotes.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
            <p>{data.post.content}</p>
            <h3>Comments</h3>
            {!user && <p>Please log in to add comments!</p>}
            {data.comments.map((comment)=>
            <div>
                {comment.content}
            </div>)}
        </div>
    )

}

export async function postDetailsLoader({ params }) {
    const res = await axios.get(`${DOMAIN}/api/posts/${params.postId}`)
    return res.data
}