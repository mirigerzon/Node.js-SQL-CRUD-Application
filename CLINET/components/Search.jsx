import { useState } from "react";

function Search({setIsChange, options, data, setData }) {
    const [searchParams, setSearchParams] = useState({});

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value
        }));
    };

    function searchFunc(e) {
        e.preventDefault();
        if (searchParams.type === "All") {
            setIsChange(1);
        }
        else if (searchParams.type === "ID" && !(/^\d+$/.test(searchParams.value))) {
            alert('search type and value do not match: Please enter numbers only');
        }
        else if (searchParams.type === "Completed" && searchParams.value !== 'true' && searchParams.value !== 'false') {
            alert('search type and value do not match: Please enter true or false');
        }
        else {
            const type = searchParams.type.toLowerCase();
            if (type === "completed") {
                searchParams.value = searchParams.value.toLowerCase() === 'true';
            }
            setData(data.filter((item) => {
                let result = item[type];
                return result.toLowerCase().includes(searchParams.value.toLowerCase())
            }));
            e.target.reset();
        }
    }

    return (
        <>
            <div className="search-container">
                <form onSubmit={searchFunc}>
                    <input name="value" className='search' placeholder='search' onChange={handleSearchChange}></input>
                    <select name="type" onChange={handleSearchChange}>
                        <option>search by</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}> {option}</option>
                        ))}
                    </select>
                    <button type='submit'>search</button>
                </form>
            </div>
        </>
    )
}

export default Search;