import Cookies from 'js-cookie';
export const fetchData = ({ type, params = {}, method = "GET", body = null, onSuccess, onError }) => {
    const query = method === "GET" ? `?${new URLSearchParams(params).toString()}` : "";
    const url = `http://localhost:3001/${type}${query}`;
    const token = Cookies.get('accessToken');
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (onSuccess) onSuccess(data);
        })
        .catch(error => {
            console.error(error);
            if (onError) onError(error.message);
        });
};
