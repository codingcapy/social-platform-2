
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../services/jwt.service";
import useAuthStore from "../store/AuthStore";
import axios from "axios"
import DOMAIN from "../services/endpoint";
import { TbArrowBigUp, TbArrowBigDown, TbArrowBigUpFilled, TbArrowBigDownFilled } from 'react-icons/tb'

export default function Reply(props) {

    const [replyEditMode, setReplyEditMode] = useState(false)
    const { user } = useAuthStore((state) => state);
    const [editedContent, setEditedContent] = useState(props.content);
    const navigate = useNavigate();
    const userId = getUserIdFromToken()
    const [replyMode, setReplyMode] = useState(false)

    function toggleReplyEditMode() {
        setReplyEditMode(!replyEditMode)
    }

    function toggleReplyMode() {
        setReplyMode(!replyMode)
    }

    async function handleEditReply(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const edited = true;
        const deleted = false;
        const updatedReply = { content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/comments/${props.id}`, updatedReply)
        toggleReplyEditMode()
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`)
        }
    }

    async function handleDeleteReply() {
        const content = "[This comment was deleted]"
        const edited = false;
        const deleted = true;
        const updatedReply = { content, edited, deleted };
        const res = await axios.post(`${DOMAIN}/api/comments/${props.id}`, updatedReply)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`)
        }
    }

    async function handleReplySubmit(e) {
        e.preventDefault()
        const content = e.target.content.value;
        const postId = props.postId;
        const commentId = props.commentId;
        const username = user?.username;
        const newComment = { content, postId, commentId, username };
        const res = await axios.post(`${DOMAIN}/api/replies`, newComment);
        toggleReplyMode()
        if (res?.data.success) {
            e.target.content.value = "";
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickUpvote() {
        if (!props.replyVotes.find((replyVote) => replyVote.voterId === userId)) {
            const value = 1
            const postId = props.postId;
            const commentId = props.commentId
            const replyId = props.id
            const voterId = userId;
            const vote = { value, postId, commentId, replyId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/replyvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].value === 0 || props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].value === -1) {
            const value = 1
            const replyVoteId = props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].id;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/replyvotes/${replyVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    async function neutralVote() {
        const value = 0
        const replyVoteId = props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].id;
        const updatedVote = { value }
        const res = await axios.post(`${DOMAIN}/api/commentvotes/${replyVoteId}`, updatedVote)
        if (res?.data.success) {
            navigate(`/posts/${props.postId}`);
        }
    }

    async function clickDownVote() {
        if (!props.replyVotes.find((replyVote) => replyVote.voterId === userId)) {
            const value = -1
            const postId = props.postId;
            const commentId = props.commentId
            const replyId = props.id
            const voterId = userId;
            const vote = { value, postId, commentId, replyId, voterId, };
            const res = await axios.post(`${DOMAIN}/api/commentvotes`, vote);
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
        else if (props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].value === 0 || props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].value === 1) {
            const value = -1
            const replyVoteId = props.replyVotes.filter((replyVote) => replyVote.voterId === parseInt(userId))[0].id;
            const updatedVote = { value }
            const res = await axios.post(`${DOMAIN}/api/commentvotes/${replyVoteId}`, updatedVote)
            if (res?.data.success) {
                navigate(`/posts/${props.postId}`);
            }
        }
    }

    return (
        <div className="ml-5 pl-2 my-3 border border-cyan-400 border-t-0 border-l-2 border-r-0 border-b-0">
            <p className="py-2"><strong>{props.username}</strong> {props.date} {props.edited && '(edited)'}</p>
            <p className="py-2">{props.content}</p>
            <p className="">Upvotes: {props.replyVotes.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}
                {user?.username !== props.username
                    ? props.replyVotes.find((replyVote) => replyVote.voterId === userId) !== undefined && props.replyVotes.find((replyVote) => replyVote.voterId === userId).value > 0
                        ? userId && <button onClick={neutralVote} className="px-1"><TbArrowBigUpFilled size={20} /></button>
                        : userId && <button onClick={clickUpvote} className="px-1"><TbArrowBigUp size={20} /></button>
                    : ""}
                {user?.username !== props.username
                    ? props.replyVotes.find((replyVote) => replyVote.voterId === userId) !== undefined && props.replyVotes.find((replyVote) => replyVote.voterId === userId).value < 0
                        ? userId && <button onClick={neutralVote} className="px-1"><TbArrowBigDownFilled size={20} /></button>
                        : userId && <button onClick={clickDownVote} className="px-1"><TbArrowBigDown size={20} /></button>
                    : ""}
                {userId && <button onClick={toggleReplyMode} className="px-3 font-bold">Reply</button>}
            </p>
        </div>
    )
}