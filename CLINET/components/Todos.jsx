import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUser } from './App';
import Search from './Search';
import Delete from './Delete';
import Update from './Update';
import Add from './Add';
import Sort from './Sort';
import { fetchData } from './fetchData';
import '../style/Todos.css';

function Todos() {
    const navigate = useNavigate();
    const [userTodos, setUserTodos] = useState([]);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(CurrentUser);
    const [isChange, setIsChange] = useState(0);

    useEffect(() => {
        setIsChange(0);
        const fetchTodos = async () => {
            try {
                const response = await fetch(`http://localhost:3000/todos/?userId=${currentUser.id}`);
                if (response.ok) {
                    const todos = await response.json();
                    setUserTodos(todos);
                    navigate(`/users/${currentUser.id}/todos`)
                } else {
                    throw new Error(`Error: ${response.status}`);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch todos");
            }
        };

        fetchTodos();
    }, [currentUser.id, isChange]);

    if (error) {
        return <div>{error}</div>;
    }

    async function completeFunc(e, itemId) {
        const data = e.target.checked;
        try {
            await fetchData({
                type: `todos/${itemId}`,
                method: "PATCH",
                body: { completed: data },
                onSuccess: (result) => {
                    console.log("Update successful:", result);
                    setIsChange(1);
                },
                onError: (error) => {
                    console.log("Update was unsuccessful:", error);
                },
            });
        } catch (error) {
            console.log("Unexpected error:", error);
        }
    }

    return (
        <>
            <div className='control'>
                <Sort type={"todos"} options={["id", "title", "completed"]} userData={userTodos} setUserData={setUserTodos} />
                <Search type={"todos"} setIsChange={setIsChange} options={["All", "ID", "Title", "Completed"]} data={userTodos} setData={setUserTodos} />
                <Add type={"todos"} setIsChange={setIsChange} inputs={["title"]} defaultValue={{ userId: currentUser.id, completed: false }} />
            </div>
            <div className='container'>
                <h1>Todos</h1>
                {userTodos.length > 0 ? (
                    <ul className="todos-list">
                        {userTodos.map((todo) => (
                            <li key={todo.id} className="todo-item">
                                <div className="todo-details">
                                    <p>#{todo.id}</p>
                                    <h4>{todo.title}</h4>
                                </div>
                                <div className="todo-actions">
                                    <Update type={"todos"} itemId={todo.id} setIsChange={setIsChange} inputs={["title"]} />
                                    <Delete type={"todos"} itemId={todo.id} setIsChange={setIsChange} />
                                    <button>
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={(e) => completeFunc(e, todo.id)}
                                            className="todo-checkbox"
                                        />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No Todos found.</p>
                )}
            </div>
        </>
    );
}

export default Todos;