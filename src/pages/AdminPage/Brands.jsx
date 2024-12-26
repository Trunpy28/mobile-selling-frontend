import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popconfirm, Table, Upload, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react'
import brandService from '../../services/brandService';

const Brands = () => {

    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [editingFile, setEditingFile] = useState(null);

    const [editForm] = Form.useForm();
    const [form] = Form.useForm();

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            const brands = await brandService.getAllBrands();
            setBrands(brands);
            console.log("Brands:", brands);
        } catch (error) {
            console.error("Error fetching brands:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleEdit = (brand) => {
        setEditingBrand(brand);
        setEditingFile(null);

        editForm.setFieldsValue({
            name: brand.name,
            description: brand.description,
            logoUrl: brand.logoUrl,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (brandId) => {
        try {
            brandService.deleteBrand(brandId);
            setBrands(brands.filter(brand => brand._id !== brandId));
            message.success("Xóa thương hiệu thành công!");
        } catch (error) {
            console.error("Error deleting brand:", error);
            message.error("Đã xảy ra lỗi khi xóa thương hiệu.");
        };
    }

    const onFinish = async (values) => {
        try {
            setIsCreating(true);
            if (!file) {
                throw new Error("Vui lòng thêm logo thương hiệu!");
            }
            const newBrand = {
                name: values.name,
                description: values.description,
                logoUrl: file
            };
            const response = await brandService.createBrand(newBrand, file);
            console.log("Response:", response);

            message.success("Thêm thương hiệu thành công!");
            form.resetFields();
            setFile(null);
            setIsModalOpen(false);
            fetchBrands();
        } catch (error) {
            message.error(error.message || "Đã xảy ra lỗi khi thêm thương hiệu.");
        } finally {
            setIsCreating(false);
        }
    };

    const onEditFinish = async (values) => {
        try {
            setIsUpdating(true);
            const updatedData = {
                name: values.name,
                description: values.description,
            };
            if (editingFile) {
                updatedData.logoUrl = editingFile;
            } else {
                updatedData.logoUrl = editingBrand.logoUrl;
            }
            await brandService.updateBrand(editingBrand._id, updatedData, editingFile);

            message.success("Cập nhật thương hiệu thành công!");
            setIsEditModalOpen(false);
            fetchBrands();
        } catch (error) {
            message.error(error.message || "Đã xảy ra lỗi khi cập nhật thương hiệu.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUploadChange = ({ file }) => {
        setFile(file);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            render: (text, record, index) => <strong>{index + 1}</strong>,
            width: 50,
        },
        {
            title: 'Logo',
            dataIndex: 'logoUrl',
            render: (text) => <img src={text} alt="product" style={{ width: 50 }} />,
            width: 80,
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: 'name',
            width: 150
        },

        {
            title: 'Mô tả',
            dataIndex: 'description',
        },

        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <EditOutlined
                        onClick={() => {
                            handleEdit(record);
                        }}
                        style={{ cursor: "pointer", color: "orange" }} />
                    <Popconfirm
                        title="Xóa thương hiệu"
                        description="Bạn chắc chắn xóa thương hiệu này ?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>
                </div>
            ),
            width: 120
        },
    ];

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: "none",
            }}
            type="button"
        >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    return (
        <div>
            <div className='flex justify-between py-4'>
                <h1 className='font-bold text-xl text-gray-800'>Danh sách thương hiệu</h1>
                <Button
                    type="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    + New
                </Button>
                <Modal
                    title="Thêm thương hiệu"
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                >
                    <Spin spinning={isCreating}>
                        <Form
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Tên thương hiệu"
                                name="name"
                                rules={[{ required: true, message: 'Hãy nhập tên thương hiệu!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[{ required: true, message: 'Hãy nhập mô tả!' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Upload ảnh"
                                name="logoUrl"
                                rules={[{ required: true, message: "Vui lòng thêm ảnh" }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    onChange={handleUploadChange}
                                >
                                    {uploadButton}
                                </Upload>
                            </Form.Item>

                            <Form.Item label={null}>
                                <div style={{ textAlign: "center" }}>
                                    <Button type="primary" htmlType="submit" loading={isCreating}>
                                        Submit
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Modal>
                <Modal
                    title="Chỉnh sửa thương hiệu"
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    footer={null}
                >
                    <Spin spinning={isUpdating}>
                        <Form
                            form={editForm}
                            onFinish={onEditFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Tên thương hiệu"
                                name="name"
                                rules={[{ required: true, message: 'Hãy nhập tên thương hiệu!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[{ required: true, message: 'Hãy nhập mô tả!' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Upload ảnh"
                                name="logoUrl"
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    onChange={({ file }) => setEditingFile(file)}
                                    defaultFileList={editingBrand?.logoUrl ? [{
                                        uid: '-1',
                                        name: 'logo.png',
                                        url: editingBrand.logoUrl,
                                    }] : []}
                                >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <div style={{ textAlign: "center" }}>
                                    <Button type="primary" htmlType="submit" loading={isUpdating}>
                                        Cập nhật
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={brands}
                loading={loading}
                rowKey='_id'
            />
        </div>
    )
}

export default Brands