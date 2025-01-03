import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Divider, Table, Typography } from "antd";
import { formatCurrency, timeTranformFromMongoDB } from "../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { handleGetAccessToken } from "../../services/axiosJWT";
import orderService from "../../services/orderService";
const { Title } = Typography;

function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { data = {}, isPending } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: async () => {
      const accessToken = handleGetAccessToken();
      return await orderService.getOrderDetails(accessToken, orderId);
    },
    enabled: true,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const { order, payment } = data;

  const handleProductDetails = (productId) => {
    navigate(`/product/product-details/${productId}`);
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.product.imageUrl[0]}
            alt={record.product.name}
            style={{
              width: 100,
              height: 100,
              marginRight: 10,
              cursor: "pointer",
            }}
            onClick={() => handleProductDetails(record?.product?._id)}
          />
          <div>
            <div
              className="text-base hover:text-sky-500 cursor-pointer"
              onClick={() => handleProductDetails(record?.product?._id)}
            >
              {record.product.name}
            </div>
            <div className="text-gray-500">{record.product.color}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div className="font-bold text-base">
          {formatCurrency(record?.price)}
          <sup>₫</sup>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <div className="text-base">{record?.quantity}</div>
      ),
    },
    {
      title: "Tạm tính",
      dataIndex: "total",
      key: "total",
      render: (text, record) => (
        <div className="text-red-600 font-bold text-base">
          {formatCurrency(record?.price * record?.quantity)}
          <sup>₫</sup>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 py-14 px-48 text-base">
      <div className="bg-white rounded-md py-8 text-black">
        <div className="flex justify-center">
          <Title level={2}>Thông tin đơn hàng</Title>
        </div>
        <div className="px-16 py-3 flex justify-between">
          <div className="text-lg">
            <div><strong>Mã đơn hàng:</strong> #{orderId}</div>
            <div><strong>Thời gian đặt hàng:</strong> {timeTranformFromMongoDB(order?.createdAt)}</div>
          </div>
          {payment?.paymentStatus === "Completed" ? (
            <div className="text-lg px-2 py-1 bg-green-400 w-fit rounded-lg font-bold text-white h-fit">
              Đã thanh toán
            </div>
          ) : (
            <div className="text-lg px-2 py-1 bg-yellow-500 w-fit rounded-lg font-bold text-white h-fit">
              Chưa thanh toán
            </div>
          )}
        </div>
        <Divider />
        <div className="px-16 py-3">
          <div className="text-lg font-bold mb-2">Thông tin nhận hàng</div>
          <div>Người nhận: {order?.shippingInfo?.name}</div>
          <div>Số điện thoại: {order?.shippingInfo?.phoneNumber}</div>
          <div>
            {`Địa chỉ: ${order?.shippingInfo?.detailedAddress}, ${order?.shippingInfo?.ward}, ${order?.shippingInfo?.district}, ${order?.shippingInfo?.city}`}
          </div>
        </div>
        <Divider />
        <div className="px-16 py-3">
          <div className="text-lg font-bold mb-2">Phương thức thanh toán</div>
          <div className="text-lg p-2 bg-blue-500 w-fit rounded-lg font-bold text-white">
            {payment?.paymentMethod}
          </div>
        </div>
        <Divider />
        <div className="px-16 py-3">
          <div className="text-lg font-bold mb-2">Đơn hàng</div>
          <Table
            dataSource={order?.products}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className="px-16 py-3 mt-8 flex justify-end">
          <div className="flex flex-col gap-1">
            <div>
              <span className="text-lg">Tạm tính: </span>
              <span className="font-bold text-lg">
                {formatCurrency(order?.subTotal)}
                <sup>₫</sup>
              </span>
            </div>
            <div>
              <span className="text-lg">Phí vận chuyển: </span>
              <span className="font-bold text-lg">
                {formatCurrency(order?.shippingPrice)}
                <sup>₫</sup>
              </span>
            </div>
            <div>
              <span className="text-lg">Tổng tiền: </span>
              <span className="font-bold text-xl text-red-600">
                {formatCurrency(order?.totalPrice)}
                <sup>₫</sup>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
