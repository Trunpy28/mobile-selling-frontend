import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;

const productService = {
    getAllProducts: async () => {
        const URL_BACKEND = `${apiUrl}/product`;
        const res = await axios.get(URL_BACKEND);
        return res.data;
    },

    getProductById: async (productId) => {
        const URL_BACKEND = `${apiUrl}/product/product-details/${productId}`;
        const res = await axios.get(URL_BACKEND);
        return res.data;
    },

    getProductBySlug: async (slug) => {
        const URL_BACKEND = `${apiUrl}/product/${slug}`;
        const res = await axios.get(URL_BACKEND);
        return res.data;
    }
};

export default productService;