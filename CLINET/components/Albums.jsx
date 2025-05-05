import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUser } from "./App";
import { fetchData } from './fetchData';
import Search from './Search';
import Delete from './Delete';
import Update from './Update';
import Add from './Add';
import Sort from './Sort';
import { deleteItems } from '../js/deleteItems';
import '../style/Albums.css';

function Albums() {
    const [userAlbums, setUserAlbums] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUser);
    const [isChange, setIsChange] = useState(0);

    useEffect(() => {
        setIsChange(0);
        const fetchAlbums = async () => {
            try {
                await fetchData({
                    type: "albums",
                    params: { userId: currentUser.id },
                    method: "GET",
                    onSuccess: (albums) => {
                        setUserAlbums(albums);
                        navigate(`/users/${currentUser.id}/albums`);
                    },
                    onError: (error) => {
                        console.error(error);
                        setError("Failed to fetch albums");
                    },
                });
            } catch (error) {
                console.error("Unexpected error:", error);
                setError("Failed to fetch albums");
            }
        };
        fetchAlbums();
    }, [currentUser.id, isChange]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className='control'>
                <Sort type={"albums"} options={[]} userData={userAlbums} setUserData={setUserAlbums} />
                <Search setIsChange={setIsChange} options={["All", "ID", "Title"]} data={userAlbums} setData={setUserAlbums} />
                <Add type={"albums"} setIsChange={setIsChange} inputs={["title"]} defaultValue={{ userId: currentUser.id }} />
            </div>
            <div className='container'>
                <h1>Albums</h1>
                {userAlbums.length > 0 ? (
                    <ul className='albums-list'>
                        {userAlbums.map((album) => (
                            <li className='album-item' key={album.id}>
                                <div className="album-details">
                                    <p>#{album.id}</p>
                                    <h4>{album.title}</h4>
                                </div>
                                <Delete type={"albums"} itemId={album.id} setIsChange={setIsChange} deleteChildren={deleteItems} typeOfChild={"photos"} />
                                <Update type={"albums"} itemId={album.id} setIsChange={setIsChange} inputs={["title"]} />
                                <button onClick={() => { navigate(`/users/${currentUser.id}/albums/${album.id}/photos`); localStorage.setItem("albumId", JSON.stringify(album.id)) }}>Photos</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No albums found.</p>
                )}
            </div>
        </>
    );
}

export default Albums;