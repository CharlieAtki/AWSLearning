import Product from '../models/Product.js';


export const productCreation = async (req, res) => {
    try {
        const { productName, description, price, category, imageUrl } = req.body;

        if ( !productName || !description || !price || !category || !imageUrl ) {
            return res.status(404).json({
                success: false,
                message: 'You have not provided the required product attributes'
            });
        }

        const product = new Product({
            productName: productName,
            description: description,
            price: price,
            category: category,
            imageUrl: imageUrl
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: product
        });

    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during product creation'
        });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({
            success: true,
            products: products
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products'
        });
    }
};
