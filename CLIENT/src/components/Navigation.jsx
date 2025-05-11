import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CurrentUser } from './App';
import { fetchData } from './fetchData';
import Cookies from 'js-cookie';

function Navigation({ setIsShowInfo }) {
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    function logOutFunc() {
        fetchData({
            type: 'logout',
            method: 'POST',
            onSuccess: () => {
                Cookies.remove('accessToken'); 
                localStorage.removeItem("currentUser"); 
                setCurrentUser(null); 
                navigate('/home'); 
            },
            onError: (err) => {
                console.error('Logout failed:', err);
            }
        });
    }

    return (
        <>
            {currentUser ? <div>
                <nav className='header'>
                    <div className="left">
                        <ul><Link to="/home" >Home</Link></ul>
                        <ul><a onClick={() => setIsShowInfo(1)}>Info</a></ul>
                        <ul><Link to={`/users/${currentUser.id}/posts`} >Posts</Link></ul>
                        <ul><Link to={`/users/${currentUser.id}/todos`} >Todos</Link></ul>
                    </div>
                    <h3 className='userName'> Hello {currentUser.name}</h3>
                    <div className="right">
                        <ul onClick={logOutFunc}><a>LogOut</a></ul>
                    </div>
                </nav>
            </div>
                :
                < nav className='header' >
                    <div className="left">
                        <ul><Link to="/home" >Home</Link></ul>
                        <ul><Link to="/login" >Login</Link></ul>
                        <ul><Link to="/register" >Register</Link></ul>
                    </div>
                </nav >
            }
        </>
    )
}
export default Navigation;