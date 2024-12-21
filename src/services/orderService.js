import axiosJWT from "./axiosJWT";

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
    },
    getAllOrders: async (accessToken) => {
        const response = await axiosJWT.get(`${apiUrl}/order/get-all`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },
    changeOrderStatus: async (accessToken, orderId, data) => {
        const response = await axiosJWT.patch(`${apiUrl}/order/change-status/${orderId}`, { ...data }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    },
    deleteOrder: async (accessToken, orderId) => {
        const response = await axiosJWT.delete(`${apiUrl}/order/delete/${orderId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    }
}

export default orderService;
