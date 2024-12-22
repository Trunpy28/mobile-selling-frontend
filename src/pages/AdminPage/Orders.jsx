import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Table,
  Select,
  message,
  Modal,
  Form,
  Tag,
} from "antd";
import { useState } from "react";
import orderService from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleGetAccessToken } from "../../services/axiosJWT";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Orders = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();
  const [orderToDelete, setOrderToDelete] = useState(null);

  const { data: ordersData, isPending: isPendingGetAll } = useQuery({
    queryKey: ["orders", "admin"],
    queryFn: async () => {
      const accessToken = handleGetAccessToken();
      return orderService.getAllOrders(accessToken);
    },
    enabled: true,
    keepPreviousData: true,
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const editOrderMutation = useMutation({
    mutationFn: async ({ orderId, data }) => {
      console.log(orderId, data);
      
      const accessToken = handleGetAccessToken();
      return await orderService.changeOrderStatus(accessToken, orderId, data);
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái đơn hàng thành công!", 3);
      queryClient.invalidateQueries(["orders", "admin"]);
      setIsModalOpen(false);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || error.message);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const accessToken = handleGetAccessToken();
      return await orderService.deleteOrder(accessToken, orderId);
    },
    onSuccess: () => {
      message.success("Xóa đơn hàng thành công!", 3);
      queryClient.invalidateQueries(["orders", "admin"]);
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || error.message);
    },
  });

  const handleDelete = async () => {
    if (orderToDelete) {
      await deleteOrderMutation.mutateAsync(orderToDelete);
    }
  };

  const handleEditOrder = (record) => {
    setCurrentOrder(record);
    
    form.setFieldsValue({
      shippingStatus: record.order.shippingStatus,
      paymentStatus: record.payment.paymentStatus,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      await editOrderMutation.mutateAsync({
        orderId: currentOrder.order._id,
        data: values,
      });
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      align: "center",
      render: (text, record, index) => <strong>{index + 1}</strong>, // Đánh số thứ tự
    },
    {
      title: "Tên người nhận",
      dataIndex: ["order", "shippingInfo", "name"],
      key: "shippingInfo.name",
      render: (text) => text || "Không có thông tin",
    },
    {
      title: "Email người dùng",
      dataIndex: ["order", "userId", "email"],
      key: "userId.email",
      render: (text) => text || "Không có thông tin",
    },
    {
      title: "Trạng thái vận chuyển",
      dataIndex: ["order", "shippingStatus"],
      key: "shippingStatus",
      render: (text) => {
        const statusMap = {
          Pending: "Chờ xử lý",
          Shipping: "Đang giao",
          Completed: "Hoàn thành",
        };
        let color = "default";
        if (text === "Pending") color = "orange";
        else if (text === "Shipping") color = "blue";
        else if (text === "Completed") color = "green";
  
        return <Tag color={color}>{statusMap[text] || "Không xác định"}</Tag>;
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: ["payment", "paymentStatus"],
      key: "paymentStatus",
      render: (text) => {
        const paymentMap = {
          Pending: "Chưa thanh toán",
          Completed: "Đã thanh toán",
        };
        return <Tag color={text === "Pending" ? "red" : "green"}>{paymentMap[text] || "Không xác định"}</Tag>;
      },
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: ["payment", "paymentMethod"],
      key: "paymentMethod",
      render: (text) => text || "Không có thông tin",
    },
    {
      title: "Tổng giá trị đơn hàng",
      dataIndex: ["order", "totalPrice"],
      key: "totalPrice",
      align: "right",
      render: (text) => {
        if (text) {
          return (
            <span
              style={{
                color: "red",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(text)}
            </span>
          );
        }
        return "Không có thông tin";
      },
    },
    {
      title: "Thời gian đặt hàng",
      dataIndex: ["order", "createdAt"],
      key: "createdAt",
      render: (text) => {
        return dayjs(text).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Button
            type="primary"
            onClick={() => handleEditOrder(record)}
            icon={<EditOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          >
            Sửa
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => {
              setOrderToDelete(record.order._id);
              setIsDeleteModalOpen(true);
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex-col justify-between items-center mb-5">
        <h1 className="font-bold text-xl text-gray-800">Danh mục đơn hàng</h1>
      </div>
      <Table
        columns={columns}
        dataSource={ordersData?.data}
        loading={isPendingGetAll}
        rowKey="_id"
      />
      {/* Modal for editing */}
      <Modal
        title="Chỉnh sửa trạng thái đơn hàng"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="shippingStatus"
            label="Trạng thái vận chuyển"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
            <Select>
              <Select.Option value="Pending">Chờ xử lý</Select.Option>
              <Select.Option value="Shipping">Đang giao hàng</Select.Option>
              <Select.Option value="Completed">Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="paymentStatus"
            label="Trạng thái thanh toán"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}>
            <Select>
              <Select.Option value="Pending">Chưa thanh toán</Select.Option>
              <Select.Option value="Completed">Đã thanh toán</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for deleting */}
      <Modal
        title="Xóa đơn hàng"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn xóa đơn hàng này không?</p>
      </Modal>
    </div>
  );
};

export default Orders;
