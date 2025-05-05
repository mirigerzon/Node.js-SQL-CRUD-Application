export const fetchData = async ({ type, params = {}, method = "GET", body = null, onSuccess, onError }) => {
    try {
        const query = method === "GET" ? `?${new URLSearchParams(params).toString()}` : "";
        const url = `http://localhost:3001/${type}${query}`;
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            ...(body && { body: JSON.stringify(body) }),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (onSuccess)
            onSuccess(data);
    } catch (error) {
        console.error(error);
        if (onError) onError(error.message);
    }
};