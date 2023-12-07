
import axios from "axios"
import DOMAIN from "../services/endpoint";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";
import { getUserIdFromToken } from "../services/jwt.service";
import { useState } from "react";
import { TbArrowBigUp, TbArrowBigDown, TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb'

export default function PostDetailsPage() {

    const data = useLoaderData();
    const { user } = useAuthStore((state) => state);
    const userId = getUserIdFromToken();
    const [editMode, setEditMode] = useState(false)
    const [editedTitle, setEditedTitle] = useState(data.post.title);
    const [editedContent, setEditedContent] = useState(data.post.content);
    const navigate = useNavigate();

    function toggleEditMode() {
        setEditMode(!editMode)
    }

    async function handleEditPost(e) {
        e.preventDefault()
        const title = e.target.title.value;
        const content = e.target.content.value;
        const edited = true;
        const deleted = false;
        const updatedPost = { title, content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/posts/${data.post.id}`, updatedPost);
        toggleEditMode();
        if (res?.data.success) {
            e.target.title.value = "";
            e.target.content.value = "";
            navigate(`/posts/${data.post.id}`);
        }
    }

    async function handleDeletePost() {
        const title = data.post.title;
        const content = "[This post was deleted]";
        const edited = false;
        const deleted = true;
        const updatedPost = { title, content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/posts/${data.post.id}`, updatedPost);
        if (res?.data.success) {
            navigate(`/posts/${data.post.id}`);
        }
    }

    async function handleCommentSubmit(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const postId = data.post.id;
        const username = user.username;
        const newComment = { content, postId, username };
        const res = await axios.post(`${DOMAIN}/api/comments`, newComment);
        if (res?.data.success) {
            e.target.content.value = "";
            navigate(`/posts/${data.post.id}`);
        }
    }

    async function clickUpvote() {
        if (!post.postVotes.find((postVote) => postVote.voterId === userId)) {
            const value = 1
            const voterId = userId;
            const postId = post.post._doc.postId;
            const vote = { value, postId, voterId };
            const res = await axios.post(`${DOMAIN}/api/votes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${post.post._doc.postId}`);
            }
        }
        else if (post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].value === 0 || post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].value === -1) {
            const value = 1
            const voterId = userId;
            const postId = post.postId;
            const postVoteId = post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].postVoteId;
            const updatedVote = { value, postId, voterId, postVoteId }
            const res = await axios.post(`${DOMAIN}/api/votes/${postVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${post.post._doc.postId}`);
            }
        }
    }

    async function neutralVote() {
        const value = 0
        const voterId = userId;
        const postId = post.postId;
        const postVoteId = post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].postVoteId;
        const updatedVote = { value, postId, voterId, postVoteId }
        const res = await axios.post(`${DOMAIN}/api/votes/${postVoteId}`, updatedVote)
        if (res?.data.success) {
            navigate(`/posts/${post.post._doc.postId}`);
        }
    }

    async function clickDownVote() {
        if (!post.postVotes.find((postVote) => postVote.voterId === userId)) {
            const value = -1
            const voterId = userId;
            const postId = post.post._doc.postId;
            const vote = { value, postId, voterId };
            const res = await axios.post(`${DOMAIN}/api/votes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${post.post._doc.postId}`);
            }
        }
        else if (post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].value === 0 || post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].value === 1) {
            const value = -1
            const voterId = userId;
            const postId = post.postId;
            const postVoteId = post.postVotes.filter((postVote) => postVote.voterId === parseInt(userId))[0].postVoteId;
            const updatedVote = { value, postId, voterId, postVoteId }
            const res = await axios.post(`${DOMAIN}/api/votes/${postVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${post.post._doc.postId}`);
            }
        }
    }

    return (
        <div className="py-10 px-10 shadow-xl">
            {editMode
                ? <div>
                    <form onSubmit={handleEditPost} className="flex flex-col">
                        <h2>Edit Post</h2>
                        <div className="flex flex-col">
                            <label htmlFor="title">Title</label>
                            <input type="text" name='title' id='title' placeholder="Title" value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)} required className="px-2 border rounded-lg border-slate-700 py-1" />
                        </div>
                        <div className="flex flex-col my-2">
                            <label htmlFor="content">Content</label>
                            <textarea type="text" name='content' id='content' placeholder='Content' value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)} required rows="10" cols="50" className="px-2 border rounded-lg border-slate-700 py-1" />
                        </div>
                        <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Update</button>
                        <button onClick={toggleEditMode} className="">Cancel</button>
                    </form>
                </div>
                : <div>
                    <p>Posted by <strong>{data.post.username}</strong> on {data.post.date} {data.post.edited && "(edited)"}</p>
                    <h2 className="py-5 text-2xl text-slate-700 font-medium text-center">{data.post.title}</h2>
                    {user?.username !== data.post.username
                        ? data.postVotes.find((postVote) => postVote.voterId === userId) !== undefined && post.postVotes.find((postVote) => postVote.voterId === userId).value > 0
                            ? user && <div onClick={neutralVote} className=""><TbArrowBigUpFilled size={25} /></div>
                            : user && <div onClick={clickUpvote} className=""><TbArrowBigUp size={25} /></div>
                        : ""}
                    <p>Upvotes: {data.postVotes.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                    {user?.username !== data.post.username
                        ? data.postVotes.find((postVote) => postVote.voterId === userId) !== undefined && post.postVotes.find((postVote) => postVote.voterId === userId).value < 0
                            ? user && <div onClick={neutralVote} className=""><TbArrowBigDownFilled size={25} /></div>
                            : user && <div onClick={clickDownVote} className=""><TbArrowBigDown size={25} /></div>
                        : ""}
                    <p className="py-3">{data.post.content}</p>
                    {data.post.deleted ? "" : user?.username === data.post.username && <button onClick={toggleEditMode} className="px-3 py-3 font-bold">Edit</button>}
                    {data.post.deleted ? "" : user?.username === data.post.username && <button onClick={handleDeletePost} className="px-3 font-bold">Delete</button>}
                    <h3 className="py-5 text-2xl text-slate-700 font-medium">Comments</h3>
                    {!user && <p>Please log in to add comments!</p>}
                    {user && <form onSubmit={handleCommentSubmit}>
                        <label htmlFor="content">Add comment</label>
                        <div className="flex flex-col">
                            <textarea type="text" name="content" id="content" placeholder="What are your thoughts?" required rows="5" cols="15" className="px-2 border rounded-lg border-slate-700 py-1" />
                            <button type="submit" className="rounded-xl my-5 py-2 px-2 bg-slate-700 text-white">Comment</button>
                        </div>
                    </form>}
                    <hr />
                    {data.comments.map((comment) =>
                        <div>
                            {comment.content}
                        </div>)}
                </div>
            }
        </div>
    )

}

export async function postDetailsLoader({ params }) {
    const res = await axios.get(`${DOMAIN}/api/posts/${params.postId}`)
    return res.data
}