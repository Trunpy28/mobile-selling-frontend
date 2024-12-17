import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select, Upload, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import brandService from '../../services/brandService';
import productService from '../../services/productService';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetail = () => {
    const { productId } = useParams();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const formItemLayout = {
        labelCol: { xs: { span: 24 }, sm: { span: 6 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
    };

    const uploadButton = (
        <button
            style={{ border: 0, background: 'none' }}
            type="button"
        >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    useEffect(() => {
        const fetchBrandsAndProduct = async () => {
            setLoading(true);
            try {
                const [brandsData, productData] = await Promise.all([
                    brandService.getAllBrands(),
                    productService.getProductById(productId),
                ]);
                setBrands(brandsData);

                const brand = brandsData.find((brand) => brand._id === productData.product.brand);
                setSelectedBrand(brand ? brand._id : '');

                setFileList(
                    productData.product.imageUrl.map((url, index) => ({
                        uid: index,
                        name: `image-${index}`,
                        url,
                    }))
                );

                form.setFieldsValue({
                    ...productData.product,
                    brand: brand ? brand._id : '',
                });
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrandsAndProduct();
    }, [productId, form]);


    const handleBrandChange = (value) => {
        setSelectedBrand(value);
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Tách các ảnh cũ và mới từ fileList
            const oldImages = fileList
                .filter((file) => file.url)
                .map((file) => file.url); // URL của ảnh đã lưu
            const newImages = fileList
                .filter((file) => file.originFileObj)
                .map((file) => file.originFileObj); // File ảnh mới

            // Gọi service updateProduct với 3 tham số
            const images = [...oldImages, ...newImages]; // Gộp ảnh cũ và mới thành một mảng
            await productService.updateProduct(
                productId, // ID sản phẩm
                {
                    ...values,
                    brand: selectedBrand, // Gửi thông tin sản phẩm (bao gồm brand là ID của thương hiệu)
                },
                images // Gửi danh sách ảnh cũ và mới
            );

            // Điều hướng về trang danh sách sản phẩm sau khi cập nhật thành công
            navigate('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className='flex'>
            <div className='flex-1'>
                <div className='font-bold text-xl text-gray-800 py-4'>Chi tiết sản phẩm</div>
                <Spin spinning={loading} tip="Đang tải dữ liệu...">
                    <Form {...formItemLayout} form={form} style={{ maxWidth: 1200 }} onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item
                                    label="Thương hiệu"
                                    name="brand"
                                    rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
                                >
                                    <Select
                                        placeholder="Chọn thương hiệu"
                                        value={selectedBrand}
                                        onChange={handleBrandChange}
                                    >
                                        {brands.map((brand) => (
                                            <Select.Option key={brand._id} value={brand._id}>
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
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={(value) => {
                                            if (!value) return '';
                                            return `${new Intl.NumberFormat('vi-VN').format(value)}`;
                                        }}
                                        parser={(value) => value.replace(/[^\d]/g, '')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Giá giảm"
                                    name="price"
                                    rules={[{ required: true, message: "Vui lòng nhập giá đã giảm" }]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={(value) => {
                                            if (!value) return '';
                                            return `${new Intl.NumberFormat('vi-VN').format(value)}`;
                                        }}
                                        parser={(value) => value.replace(/[^\d]/g, '')}
                                    />
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
                                <Form.Item label="Upload ảnh" name="imageUrl">
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

                        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                            <Button
                                type="default"
                                onClick={() => console.log('Xem thông số sản phẩm')}
                                style={{ marginRight: '10px' }}
                            >
                                Thông số sản phẩm
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật sản phẩm
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default ProductDetail;
