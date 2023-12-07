
/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: home page jsx for CapySocial
 */

import { Link, useLoaderData } from "react-router-dom"
import axios from "axios"
import DOMAIN from "../services/endpoint"
import { useState } from "react"

export default function HomePage() {

    const data = useLoaderData()
    const [sortState, setSortState] = useState(
        data.posts.map((post) =>
                <div key={post.id} className="border border-slate-700 rounded-xl px-3 py-3">
                    <Link to={`posts/${post.id}`} className="flex flex-col text-center">
                        <p className="py-2">Posted by <strong>{post.username}</strong> on {post.date.toLocaleString()}</p>
                        <p >upvotes: {data.postVotes.filter((postVote) => postVote.postId === post.id).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                        <h3 className="py-3 text-2xl text-slate-700 font-medium">{post.title}</h3>
                        <p>{post.content}</p>
                        <p className="py-3">{data.comments.filter((comment) => comment.postId === post.id).length + data.replies.filter((reply) => reply.postId === post.id).length} {data.comments.filter((comment) => comment.postId === post.id).length + data.replies.filter((reply) => reply.postId === post.id).length == 1 ? "comment" : "comments"}</p>
                    </Link>
                </div>)
    )

    function sortByOldest(){
        data.posts.sort((a,b)=>{
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return dateA-dateB
        })
        setSortState(
            data.posts.map((post) =>
                <div key={post.id} className="border border-slate-700 rounded-xl px-3 py-3">
                    <Link to={`posts/${post.id}`} className="flex flex-col text-center">
                        <p className="py-2">Posted by <strong>{post.username}</strong> on {post.date.toLocaleString()}</p>
                        <p >upvotes: {data.postVotes.filter((postVote) => postVote.postId === post.id).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                        <h3 className="py-3 text-2xl text-slate-700 font-medium">{post.title}</h3>
                        <p>{post.content}</p>
                        <p className="py-3">{data.comments.filter((comment) => comment.postId === post.id).length + data.replies.filter((reply) => reply.postId === post.id).length} {data.comments.filter((comment) => comment.postId === post.id).length + data.replies.filter((reply) => reply.postId === post.id).length == 1 ? "comment" : "comments"}</p>
                    </Link>
                </div>)
        )
    }

    function sortByLatest(){
        data.posts.sort((a,b)=>{
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return dateB-dateA
        })
        setSortState(
            data.posts.map((post) =>
                <div key={post.id} className="border border-slate-700 rounded-xl px-3 py-3">
                    <Link to={`posts/${post.id}`} className="flex flex-col text-center">
                        <p className="py-2">Posted by <strong>{post.username}</strong> on {post.date.toLocaleString()}</p>
                        <p >upvotes: {data.postVotes.filter((postVote) => postVote.postId === post.id).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)}</p>
                        <h3 className="py-3 text-2xl text-slate-700 font-medium">{post.title}</h3>
                        <p>{post.content}</p>
                        <p className="py-3">{data.comments.filter((comment) => comment.postId === post.id).length + data.replies.filter((reply) => reply.postId === post.id).length} {data.comments.filter((comment) => comment.postId === post.id).length + data.replies.filter((reply) => reply.postId === post.id).length == 1 ? "comment" : "comments"}</p>
                    </Link>
                </div>)
        )
    }

    function sortByMostPopular(){

    }

    return (
        <div>
            <h1 className="py-5 text-2xl text-slate-700 font-medium text-center">CapySocial2 Home</h1>
            <p className="py-3">Sort By: <button className="px-3" onClick={sortByOldest}>Oldest</button><button onClick={sortByLatest}className="px-3">Latest</button><button className="px-3">Most Popular</button></p>
            {sortState}
        </div>
    )
}

export async function pageLoader() {
    const res = await axios.get(`${DOMAIN}/api/posts`)
    return res.data
}