import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;

const productDetailService = {
    getProductDetail: async (productId) => {
        const URL_BACKEND = `${apiUrl}/product-detail?productId=${productId}`;
        const res = await axios.get(URL_BACKEND);
        return res.data;
    }
};

export default productDetailService;