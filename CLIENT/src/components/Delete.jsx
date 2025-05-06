import React, { useState } from "react";
import { fetchData } from "./fetchData";
function Delete({ type, itemId, setIsChange, deleteChildren = null, typeOfChild = null }) {
    const [process, setProcess] = useState(0);
    
    async function deleteFunc(e) {
        if (deleteChildren) {
            if (confirm(`Deleting this ${type} will delete all of his ${typeOfChild}. Are you sure?`)) {
                setProcess(1);
                deleteChildren({
                    type: typeOfChild,
                    params: { itemId },
                    onDeleteSuccess: (result) => {
                        console.log(`Additional success handling for ${typeOfChild} ID ${result.id}`);
                    },
                    onDeleteError: (err, result) => {
                        console.error(`Error handling for ${typeOfChild} ID ${result.id}: ${err}`);
                    },
                });
            }
            else
                return;
        }
        try {
            await fetchData({
                type: `${type}/${itemId}`,
                method: "DELETE",
                onSuccess: (result) => {
                    console.log("Delete successful:", result);
                    setIsChange(1);
                },
                onError: (error) => {
                    console.error(`Failed to delete ${type} with ID ${itemId}: ${error}`);
                    alert("Failed to delete the item. Please try again.");
                },
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
        setProcess(0);
    }

    return (
        <>
            <button onClick={(e) => deleteFunc(e)} className="action-btn delete-btn">
                <i className="fa fa-trash"></i>
            </button>
            {process == 1 && <h3>in process...</h3>}
        </>
    )
}

export default Delete;