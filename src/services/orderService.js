import axiosJWT from './axiosJWT';

const apiUrl = import.meta.env.VITE_API_URL;

const orderService = {
  createOrder: async (accessToken, shippingInfo, paymentMethod) => {
    try {
      const response = await axiosJWT.post(
        `${apiUrl}/order/create`, 
        { shippingInfo, paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log(response.data);
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
      return response.data;
    } catch (error) {
      console.error("Tạo đơn hàng thất bại:", error);
      throw error;
    }
  },

  countOrders: async () => {
    try {
      const response = await axiosJWT.get(
        `${apiUrl}/order/count`, 
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("access_token"))}`,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lấy số lượng đơn hàng thất bại:", error);
      throw error;
    }
  },

  getAllOrders: async (accessToken) => {
    const response = await axiosJWT.get(
      `${apiUrl}/order/get-all`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  },

  changeOrderStatus: async (accessToken, orderId, data) => {
    const response = await axiosJWT.patch(
      `${apiUrl}/order/change-status/${orderId}`, 
      { ...data },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  },

  deleteOrder: async (accessToken, orderId) => {
    const response = await axiosJWT.delete(
      `${apiUrl}/order/delete/${orderId}`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  }
};

export default orderService;

