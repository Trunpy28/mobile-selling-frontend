import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;

const productDetailService = {
    getProductDetail: async (productId) => {
        const URL_BACKEND = `${apiUrl}/product-detail/${productId}`;
        const res = await axios.get(URL_BACKEND);
        return res.data;
    },

    updateProductDetail: async (productId, specifications) => {
        const URL_BACKEND = `${apiUrl}/product-detail/update/${productId}`;
        const res = await axios.put(URL_BACKEND, specifications,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("access_token"))}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res.data;
    },
};

export default productDetailService;