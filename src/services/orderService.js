import axiosJWT from './axiosJWT';

const apiUrl = import.meta.env.VITE_API_URL;

const orderService = {
    createOrder: async (accessToken, shippingInfo, paymentMethod) => {  
        const response = await axiosJWT.post(`${apiUrl}/order/create`, {
            shippingInfo,
            paymentMethod
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
};

export default orderService;



