
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../services/jwt.service";
import useAuthStore from "../store/AuthStore";
import axios from "axios"
import DOMAIN from "../services/endpoint";
import { TbArrowBigUp, TbArrowBigDown, TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb'

export default function Comment(props) {

    const [commentEditMode, setCommentEditMode] = useState(false)
    const { user } = useAuthStore((state) => state);
    const [editedContent, setEditedContent] = useState(props.content);
    const navigate = useNavigate();
    const userId = getUserIdFromToken()
    const [replyMode, setReplyMode] = useState(false)

    function toggleCommentEditMode() {
        setCommentEditMode(!commentEditMode)
    }

    function toggleReplyMode() {
        setReplyMode(!replyMode)
    }

    async function handleEditComment(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const edited = true;
        const deleted = false;
        const updatedComment = { content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/comments/${props.id}`, updatedComment)
        toggleCommentEditMode()
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`)
        }
    }

    async function handleDeleteComment() {
        const content = "[This comment was deleted]"
        const edited = false;
        const deleted = true;
        const updatedComment = { content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/comments/${props.id}`, updatedComment)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`)
        }
    }

    async function handleReplySubmit(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const postId = props.postid;
        const commentId = props.commentId;
        const username = user.username;
        const newComment = { content, postId, commentId, username };
        const res = await axios.post(`${DOMAIN}/api/reply`, newComment);
        toggleReplyMode()
        if (res?.data.success) {
            e.target.content.value = "";
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickUpvote() {
        if (!props.commentVotes.find((commentVote) => commentVote.voterId === userId)) {
            const value = 1
            const voterId = userId;
            const commentId = props.commentId
            const postId = props.postId;
            const vote = { value, postId, commentId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === 0 || props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === -1) {
            const value = 1
            const voterId = userId;
            const commentId = props.commentId
            const postId = props.postId;
            const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].commentVoteId;
            const updatedVote = { value, postId, commentId, voterId, commentVoteId }
            const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    async function neutralVote() {
        const value = 0
        const voterId = userId;
        const postId = props.postId;
        const commentId = props.commentId;
        const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].commentVoteId;
        const updatedVote = { value, postId, commentId, voterId, commentVoteId }
        const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickDownVote() {
        if (!props.commentVotes.find((commentVote) => commentVote.voterId === userId)) {
            const value = -1
            const voterId = userId;
            const commentId = props.commentId
            const postId = props.postId;
            const vote = { value, postId, commentId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === 0 || props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].value === 1) {
            const value = -1
            const voterId = userId;
            const commentId = props.commentId
            const postId = props.postId;
            const commentVoteId = props.commentVotes.filter((commentVote) => commentVote.voterId === parseInt(userId))[0].commentVoteId;
            const updatedVote = { value, postId, commentId, voterId, commentVoteId }
            const res = await axios.post(`${DOMAIN}/api/commentvotes/${commentVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    return (
        <div className="py-3">
            <p className="py-2"><strong>{props.username}</strong> {props.date} {props.edited && '(edited)'}</p>
            {commentEditMode
                ? <form onSubmit={handleEditComment}>
                    <input type="text" name="content" id="content" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="px-2 py-1 border rounded-lg border-slate-700" required />
                    <p><button type="submit" className="font-bold">Update</button>
                        <button onClick={toggleCommentEditMode} className="px-3 font-bold">Cancel</button></p>
                </form>
                : <div>
                    <p className="py-2">{props.content} {props.deleted ? "" : props.username === user.username && <button onClick={toggleCommentEditMode} className="font-bold">Edit</button>}
                    {props.deleted ? "" : props.username === user.username && <button onClick={handleDeleteComment} className="px-3 font-bold">Delete</button>}</p>
                    
                </div>
            }
            <p className="">Upvotes: {props.commentVotes.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}
                {user.username !== props.username
                    ? props.commentVotes.find((commentVote) => commentVote.voterId === userId) !== undefined && props.commentVotes.find((commentVote) => commentVote.voterId === userId).value > 0
                        ? userId && <button onClick={neutralVote} className="px-1"><TbArrowBigUpFilled size={20} /></button>
                        : userId && <button onClick={clickUpvote} className="px-1"><TbArrowBigUp size={20} /></button>
                    : ""}
                {user.username !== props.username
                    ? props.commentVotes.find((commentVote) => commentVote.voterId === userId) !== undefined && props.commentVotes.find((commentVote) => commentVote.voterId === userId).value < 0
                        ? userId && <button onClick={neutralVote} className="px-1"><TbArrowBigDownFilled size={20} /></button>
                        : userId && <button onClick={clickDownVote} className="px-1"><TbArrowBigDown size={20} /></button>
                    : ""}
                {userId && <button onClick={toggleReplyMode} className="px-3 font-bold">Reply</button>}
            </p>
        </div>
    )
}