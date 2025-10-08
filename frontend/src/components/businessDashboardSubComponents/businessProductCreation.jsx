import { useState } from "react";
import { useOutletContext } from 'react-router-dom';

const BusinessProductCreation = () => {
    // Fetching the current user information from the parent menu
    const { userData } = useOutletContext();

    // useState to manage form inputs
    const [input, setInput] = useState({
        productName: "",
        description: "",
        price: "",
        category: "",
        imageUrl: ""
    });

    const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const inputFormElement = [
        {
            name: "productName",
            label: "Product Name",
            type: "text",
            placeholder: "Enter product name",
            required: true
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Enter product description",
            required: true
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            placeholder: "Enter product price",
            required: true
        },
        {   
            name: "category",
            label: "Category",
            type: "text",
            placeholder: "Enter product category",
            required: true
        },
        {
            name: "imageUrl",
            label: "Product Image",
            type: "file",
            placeholder: "Upload image",
            required: true
        }
    ];

    const handleChange = async (event) => {
        const { name, value, type, files } = event.target;

        if (type === "file") {
            const file = files[0];
            if (!file) return;

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "unsigned_preset"); // Replace with your actual preset

            try {
                const res = await fetch(`${cloudinaryUrl}`, {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                console.log("Uploaded image URL:", data.secure_url);

                setInput((prev) => ({ ...prev, imageUrl: data.secure_url }));
            } catch (err) {
                console.error("Image upload failed", err);
            }
        } else {
            setInput((prev) => ({ ...prev, [name]: value }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Submit the form data to your backend API
        console.log("Submitting product:", input);
        console.log("current user busienss iD", userData.businessId)
        try {
            const response = await fetch(`${backendUrl}/api/product-unAuth/createProduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    productName: input.productName,
                    description: input.description,
                    price: input.price,
                    category: input.category,
                    imageUrl: input.imageUrl,
                    businessId: userData.businessId // Current user businessId
                })
            });
            const data = await response.json();
            console.log("Product created:", data);
        } catch (err) {
            console.error("Product creation failed", err);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Create New Product</h2>

            <form className="space-y-4">
                {inputFormElement.map((input, index) => (
                    <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {input.label}
                        </label>
                        {input.type === "textarea" ? (
                            <textarea
                                name={input.name}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                placeholder={input.placeholder}
                                required={input.required}
                                onChange={handleChange}
                            />
                        ) : input.type === "file" ? (
                            <input
                                type="file"
                                accept="image/*"
                                name="imageUrl"
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                required={input.required}
                            />
                        ) : (
                            <input
                                type={input.type}
                                name={input.name}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                placeholder={input.placeholder}
                                required={input.required}
                                onChange={handleChange}
                            />
                        )}
                    </div>
                ))}
                {input.imageUrl && (
                    <div className="mt-2">
                        <img src={input.imageUrl} alt="Product Preview" className="h-32 object-cover rounded" />
                    </div>
                )}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-1/2 mx-auto flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        Create Product
                    </button>
                </div>

            </form>
        </div>
    );
}
                      
export default BusinessProductCreation;
