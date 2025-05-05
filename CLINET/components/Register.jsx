import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from './fetchData';
import { CurrentUser } from './App';
import '../style/Register.css';

function Register() {
    const { register, handleSubmit: handleFirstSubmit, reset: resetFirstForm } = useForm();
    const { register: registerSecond, handleSubmit: handleSecondSubmit, reset: resetSecondForm } = useForm();
    const [registerIsCompleted, setRegisterIsCompleted] = useState(0);
    const [responsText, setResponstText] = useState("Fill the form and click the sign up button");
    const { setCurrentUser } = useContext(CurrentUser);
    const [userData, setUserData] = useState({
        name: "",
        username: "",
        email: "",
        address: {
            street: "",
            suite: "",
            city: "",
            zipcode: "",
            geo: {
                lat: "",
                lng: "",
            },
        },
        phone: "",
        website: "",
        company: {
            name: "",
            catchPhrase: "",
            bs: "",
        },
    });
    const navigate = useNavigate();

    const onFirstSubmit = async (data) => {
        const userDetails = {
            name: data.username,
            password: data.password,
            verifyPassword: data.verifyPassword,
        };
        await checkIfExsist(userDetails);
        resetFirstForm();
    };

    const onSecondSubmit = async (data) => {
        const updatedUserData = {
            ...userData,
            name: data.name,
            username: data.username,
            email: data.email,
            address: {
                street: data.street,
                suite: data.suite,
                city: data.city,
                zipcode: data.zipcode,
                geo: {
                    lat: data.lat,
                    lng: data.lng,
                },
            },
            phone: data.phone,
            website: data.password,
            company: {
                name: data.companyName,
                catchPhrase: data.catchPhrase,
                bs: data.bs,
            },
        };
        setUserData(updatedUserData);
        await signUpFunc(updatedUserData);
        resetSecondForm();
    };

    async function signUpFunc(createdUserData) {
        fetchData({
            type: "users",
            method: "POST",
            body: createdUserData,
            onSuccess: (createdUser) => {
                console.log("User registered successfully:", createdUser);
                navigate(`/users/${createdUser.id}/home`);
                setCurrentUser(createdUser);
                localStorage.setItem("currentUser", JSON.stringify(createdUser));
            },
            onError: (errorMessage) => {
                console.error("Failed to register user:", errorMessage);
                setResponstText("Registration failed. Please try again.");
            },
        });
    }

    async function checkIfExsist(userDetails) {
        const username = userDetails.name;
        const password = userDetails.password;
        fetchData({
            type: "users",
            params: { username },
            onSuccess: (user) => {
                if (user.length > 0 && user[0].website === password) {
                    setResponstText("The user already exists");
                } else {
                    if (userDetails.password === userDetails.verifyPassword) {
                        if (userDetails.password.length < 6) {
                            setResponstText("Password must contain at least 6 characters.");
                        } else {
                            setUserData((prevData) => ({ ...prevData, username: userDetails.name, website: userDetails.password }));
                            setRegisterIsCompleted(1);
                        }
                    } else {
                        setResponstText("Password and verifyPassword are not the same");
                    }
                }
            },
            onError: () => { setResponstText("ERROR"); },
        });
        setTimeout(() => setResponstText("Fill the form and click the sign up button"), 5000);
    }

    return (
        <>
            <div className="back-ground-img">
                {registerIsCompleted === 0 &&
                    <div>
                        <h2>Sign Up</h2>
                        <div className="entryContainer">
                            <form onSubmit={handleFirstSubmit(onFirstSubmit)} className="entryForm">
                                <input
                                    type="text"
                                    placeholder="username"
                                    required
                                    {...register("username", { required: true })}
                                />
                                <input
                                    type="password"
                                    placeholder="password"
                                    required
                                    {...register("password", { required: true })}
                                />
                                <input
                                    type="password"
                                    placeholder="verifyPassword"
                                    required
                                    {...register("verifyPassword", { required: true })}
                                />
                                <button type="submit">sign up</button>
                                <h4>{responsText}</h4>
                            </form>
                        </div>
                    </div>
                }
                {registerIsCompleted === 1 &&
                    <div className="form-container">
                        <form onSubmit={handleSecondSubmit(onSecondSubmit)}>
                            <h2 className="form-title">More Details</h2>
                            <input
                                type="text"
                                name="name"
                                {...registerSecond("name", { required: true })}
                                placeholder="Name"
                                className="form-input"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                {...registerSecond("email", { required: true })}
                                placeholder="Email"
                                className="form-input"
                                required
                            />
                            <fieldset className="form-fieldset">
                                <legend>Address</legend>
                                <input
                                    type="text"
                                    name="street"
                                    {...registerSecond("street", { required: true })}
                                    placeholder="Street"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="suite"
                                    {...registerSecond("suite", { required: true })}
                                    placeholder="Suite"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="city"
                                    {...registerSecond("city", { required: true })}
                                    placeholder="City"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="zipcode"
                                    {...registerSecond("zipcode", { required: true })}
                                    placeholder="Zipcode"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lat"
                                    {...registerSecond("lat", { required: true })}
                                    placeholder="Latitude"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lng"
                                    {...registerSecond("lng", { required: true })}
                                    placeholder="Longitude"
                                    className="form-input"
                                    required
                                />
                            </fieldset>
                            <input
                                type="text"
                                name="phone"
                                {...registerSecond("phone", { required: true })}
                                placeholder="Phone"
                                className="form-input"
                                required
                            />
                            <fieldset className="form-fieldset">
                                <legend>Company</legend>
                                <input
                                    type="text"
                                    name="companyName"
                                    {...registerSecond("companyName", { required: true })}
                                    placeholder="Company Name"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="catchPhrase"
                                    {...registerSecond("catchPhrase", { required: true })}
                                    placeholder="CatchPhrase"
                                    className="form-input"
                                    required
                                />
                                <input
                                    type="text"
                                    name="bs"
                                    {...registerSecond("bs", { required: true })}
                                    placeholder="Business Strategy (bs)"
                                    className="form-input"
                                    required
                                />
                            </fieldset>
                            <button type="submit" className="form-button">Submit</button>
                        </form>
                    </div>
                }
            </div>
        </>
    );
}

export default Register;