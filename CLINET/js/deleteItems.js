import { fetchData } from '../components/fetchData';

export function deleteItems({ type, params, onDeleteSuccess, onDeleteError }) {
    fetchData({
        type,
        params,
        onSuccess: (items) => {
            items.forEach((item) => {
                fetchData({
                    type: `${type}/${item.id}`,
                    method: "DELETE",
                    onSuccess: () => {
                        console.log(`${type.slice(0, -1)} with ID ${item.id} deleted successfully.`);
                        if (onDeleteSuccess) {
                            onDeleteSuccess(item);
                        }
                    },
                    onError: (err) => {
                        console.error(`Failed to delete ${type.slice(0, -1)} with ID ${item.id}: ${err}`);
                        if (onDeleteError) {
                            onDeleteError(err, item);
                        }
                    },
                });
            });
        },
        onError: (err) => {
            console.error(`Failed to fetch ${type} with params ${JSON.stringify(params)}: ${err}`);
        },
    });
}