import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { CurrentUser } from './App';
import { fetchData } from './fetchData';
import Search from './Search';
import Sort from './Sort';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import { deleteItems } from '../js/deleteItems';
import '../style/Posts.css';

function Posts() {
    const [userPosts, setUserPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [isAllPost, setIsAllPosts] = useState(0);
    const [displayData, setDisplayData] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const [displayDetails, setDisplayDetails] = useState(null);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        setIsChange(0);
        if (!currentUser || !currentUser.id) {
            setError("User is not logged in");
            return;
        }
        fetchData({
            type: "posts",
            params: { userId: currentUser.id },
            onSuccess: (data) => setUserPosts(data),
            onError: (err) => setError(`Failed to fetch posts: ${err}`),
        });
    }, [currentUser.id, isChange]);

    useEffect(() => {
        setIsChange(0);
        if (!currentUser || !currentUser.id) {
            setError("User is not logged in");
            return;
        }
        fetchData({
            type: "posts",
            onSuccess: (data) => setAllPosts(data),
            onError: (err) => setError(`Failed to fetch posts: ${err}`),
        });
    }, [isChange]);

    useEffect(() => {
        setDisplayData(isAllPost == 0 ? userPosts : allPosts);
    }, [isAllPost, userPosts, allPosts]);

    if (error) {
        return <div>{error}</div>;
    }

    function displayDetailsFunc(post) {
        const details = <div className='details'>
            <h2 className='more-details-h2'>Written by: {post.userId}</h2><br />
            <h3 className='more-details-h3'>title: {post.title}</h3><br />
            <h4>{post.body}</h4><br />
            <button onClick={() => setDisplayDetails(null)}>Close</button>
        </div>
        setDisplayDetails(details);
    }

    return (
        <>
            <div className='control'>
                <button onClick={() => setIsAllPosts((prev) => !prev)}>{isAllPost == 0 ? "All Posts" : "My Posts"}</button>
                <Sort type={"posts"} setIsChange={setIsChange} options={["id", "title"]} userData={userPosts} setUserData={setUserPosts} />
                <Search type={"posts"} setIsChange={setIsChange} options={["All", "ID", "Title"]} data={userPosts} setData={setUserPosts} />
                <Add type={"posts"} setIsChange={setIsChange} inputs={["title", "body"]} setData={setUserPosts} defaultValue={{ userId: currentUser.id }} />
            </div>
            <div className="container">
                <h1>Posts</h1>
                {displayData.length > 0 ? (
                    <div className="posts-list">
                        {displayData.map((post) => (
                            <div
                                key={post.id}
                                className="post-item"
                            >
                                <div className='post-details'>
                                    <p>#{post.id}</p>
                                    <h4>{post.title}</h4>
                                    <button onClick={() => displayDetailsFunc(post)}>More Details</button>
                                    <button onClick={() => navigate(`/users/${currentUser.id}/posts/${post.id}/comments`)}>Comments</button>
                                    <Add type={"comments"} setIsChange={null} inputs={["name", "body"]} setData={setUserPosts} defaultValue={{ postId: post.id, email: currentUser.email }} name="Add Comment" />
                                </div>
                                <div className='post-actions'>
                                    {post.userId == currentUser.id && <Update type={"posts"} itemId={post.id} setIsChange={setIsChange} inputs={["title", "body"]} />}
                                    {post.userId == currentUser.id && <Delete type={"posts"} itemId={post.id} setIsChange={setIsChange} deleteChildren={deleteItems} typeOfChild={"comments"} />}

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No posts found.</p>
                )}
                {displayDetails != null && displayDetails}
            </div >
            <Outlet />
        </>
    );
}

export default Posts;