import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useMemo } from "react";
import { fetchData } from "./fetchData";
import { CurrentUser } from './App';
import Delete from "./Delete";
import Update from "./Update";
import Add from "./Add";
import '../style/photos.css';

function Photos() {
    const { currentUser } = useContext(CurrentUser);
    const [photosByPage, setPhotosByPage] = useState({});
    const albumId = useMemo(() => { const id = localStorage.getItem("albumId"); return id ? JSON.parse(id) : null; }, []);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const [page, setPage] = useState(1);
    const [endPagesLoaded, setEndPagesLoaded] = useState(0);
    const navigate = useNavigate();
    const [amountPerPage, setAmountPerPage] = useState(6);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (photosByPage[page] && isChange == 0) {
                return;
            }
            setIsChange(0);
            try {
                await fetchData({
                    type: "photos",
                    params: { _page: page, _per_page: amountPerPage, albumId },
                    method: "GET",
                    onSuccess: (photos) => {
                        setPhotosByPage((prev) => ({
                            ...prev,
                            [page]: photos.data,
                        }));
                        setEndPagesLoaded(photos.next == null ? 1 : 0);
                    },
                    onError: (error) => {
                        console.error(error);
                        setError("Failed to fetch photos");
                    },
                });
            } catch (error) {
                console.error("Unexpected error:", error);
                setError("Failed to fetch photos");
            }
        };
        fetchPhotos();
    }, [albumId, isChange, page, amountPerPage]);

    const currentPhotos = photosByPage[page] || [];

    const handleAmountPerPageChange = (e) => {
        const value = Number(e.target.value);
        setAmountPerPage(value);
        setPage(1);
        setPhotosByPage({});
    };

    return (
        <>
            <div className='control'>
                <button onClick={() => navigate(`/users/${currentUser.id}/albums`)}>back to albums</button>
                <select name="amountPerPage" onChange={handleAmountPerPageChange}>
                    <option value={6} > 6 per page</option>
                    <option value={9}> 9 per page</option>
                    <option value={12}> 12 per page</option>
                    <option value={15}> 15 per page</option>
                    <option value={21}> 21 per page</option>
                </select>
                <Add type={"photos"} setIsChange={setIsChange} inputs={["title", "thumbnailUrl"]} setData={(newPhoto) => setPhotosByPage((prev) => ({ ...prev, [page]: [...(prev[page] || []), newPhoto], }))} defaultValue={{ albumId: albumId }} name="Add Photo" />
            </div >
            <div className="container">
                <h1>Photos</h1>
                {currentPhotos.length > 0 ? (
                    <div>
                        <ul className="photo-list">
                            {currentPhotos.map((photo) => (
                                <li className="photo-item" key={photo.id}>
                                    <div className="photo-details">
                                        <img src={photo.thumbnailUrl} alt={photo.title} />
                                    </div>
                                    <div className="photo-actions">
                                        <Update type={"photos"} itemId={photo.id} setIsChange={setIsChange} inputs={["url"]} />
                                        <Delete type={"photos"} itemId={photo.id} setIsChange={setIsChange} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="controlPages">
                            <button onClick={() => { setPage((prev) => prev - 1); setEndPagesLoaded(0); }} disabled={page === 1}> Preview Page </button>
                            <h4>page #{page}</h4>
                            <button onClick={() => setPage((prev) => prev + 1)} disabled={endPagesLoaded == 1}> Next Page </button>
                        </div>
                    </div>
                ) : (
                    <p>No Photos found.</p>
                )}
            </div>
        </>
    );
}

export default Photos;