import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Image, Input, InputNumber, Row, Select, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import brandService from '../../services/brandService';
import productService from '../../services/productService';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {


    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState("Apple");
    const [fileList, setFileList] = useState([]);

    const navigate = useNavigate();

    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 6,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 14,
            },
        },
    };

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

    useEffect(() => {
        const fetchBrands = async () => {
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
        }
        fetchBrands();
    }, []);

    const handleBrandChange = (value) => {
        setSelectedBrand(value);
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        try {
            const brandData = await brandService.getBrandByName(selectedBrand);
            const brandId = brandData.data._id;
            const newProduct = {
                ...values,
                brand: brandId,
                imageUrl: fileList.map((file) => file.originFileObj),
            }
            console.log("New product:", newProduct);

            const res = await productService.createProduct(newProduct, fileList);
            console.log("Create product:", res);
            form.resetFields();
            navigate('/admin/products');
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };


    return (
        <div className='flex'>
            <div className='flex-1'>
                <div className='font-bold text-xl text-gray-800 py-4'>Thêm sản phẩm</div>
                <Form
                    {...formItemLayout}
                    form={form}
                    style={{ maxWidth: 1200 }}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                label="Thương hiệu"
                                name="brand"
                                rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
                            >
                                <Select
                                    placeholder="Chọn thương hiệu"
                                    value={selectedBrand}
                                    onChange={handleBrandChange}
                                >
                                    {brands.map((brand) => (
                                        <Select.Option key={brand._id} value={brand.name}>
                                            {brand.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Màu sắc"
                                name="color"
                                rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Giá gốc"
                                name="originalPrice"
                                rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                label="Giá giảm"
                                name="price"
                                rules={[{ required: true, message: "Vui lòng nhập giá đã giảm" }]}
                            >
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item
                                label="Số lượng"
                                name="countInStock"
                                rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="Upload ảnh"
                                name="imageUrl"
                                rules={[{ required: true, message: "Vui lòng thêm ảnh sản phẩm" }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={() => false}
                                >
                                    {fileList.length >= 6 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        wrapperCol={{
                            offset: 6,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Thêm sản phẩm
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    )
}

export default AddProduct