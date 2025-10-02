const MarketplaceGrid = () => {

    const products = [
        {
            id: 1,
            name: "Latte",
            description: "Freshly brewed espresso with steamed milk.",
            imageUrl: "/latte.png"
        },
        {
            id: 2,
            name: "Croissant",
            description: "Buttery and flaky pastry.",
            imageUrl: "/croissant.png"
        },
        {
            id: 3,
            name: "Espresso",
            description: "Strong and bold coffee shot.",
            imageUrl: "/espresso.png"
        },
        {
            id: 4,
            name: "Macaron",
            description: "Delicate French pastry with a creamy filling.",
            imageUrl: "/macaron.png"
        },
        {
            id: 5,
            name: "Tart",
            description: "A sweet or savory dish with a pastry base.",
            imageUrl: "/tart.png"
        }
    ]


    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 bg-gray-50 px-4 py-16">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:transform hover:scale-105 transition-transform duration-300 overflow-hidden flex flex-col">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-6 flex flex-col flex-grow">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {product.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 flex-grow">
                                {product.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MarketplaceGrid;
