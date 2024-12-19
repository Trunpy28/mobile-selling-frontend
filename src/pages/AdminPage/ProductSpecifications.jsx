import { Form, Input, Button, Spin, Row, Col, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productDetailService from "../../services/productDetailService";

const ProductSpecifications = () => {
    const { productId } = useParams();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSpecifications = async () => {
            setLoading(true);
            try {
                const specifications = await productDetailService.getProductDetail(productId);
                if (specifications) {
                    form.setFieldsValue(specifications.data);
                }
            } catch (error) {
                console.error('Error fetching product specifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpecifications();
    }, [productId, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await productDetailService.updateProductDetail(productId, values);
            message.success('Cập nhật thông số sản phẩm thành công');
            navigate(`/admin/products/detail/${productId}`);
        } catch (error) {
            console.error('Error updating product specifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
            <div className="p-4">
                <h2 className="font-bold text-xl text-gray-800 pb-4">Thông số sản phẩm</h2>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Row gutter={16}>
                        <Col span={6}>
                            <h3 className='font-bold'>Thông số kỹ thuật</h3>
                            <Form.Item label="Hệ điều hành" name={['specifications', 'os']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="CPU" name={['specifications', 'cpu']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="GPU" name={['specifications', 'gpu']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="RAM" name={['specifications', 'ram']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Bộ nhớ" name={['specifications', 'storage']}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <h3 className='font-bold'>Camera và Hiển thị</h3>
                            <Form.Item label="Camera trước" name={['cameraDisplay', 'frontCamera']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Camera sau" name={['cameraDisplay', 'backCamera']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Công nghệ màn hình" name={['cameraDisplay', 'displayTech']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Độ phân giải màn hình" name={['cameraDisplay', 'displayResolution']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Độ sáng màn hình" name={['cameraDisplay', 'displayBrightness']}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <h3 className='font-bold'>Thiết kế và Chất liệu</h3>
                            <Form.Item label="Thiết kế" name={['designMaterial', 'design']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Chất liệu" name={['designMaterial', 'material']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Kích thước và trọng lượng" name={['designMaterial', 'sizeWeight']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Ngày phát hành" name={['designMaterial', 'releaseDate']}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <h3 className='font-bold'>Pin và Adapter</h3>
                            <Form.Item label="Dung lượng pin" name={['pinAdapter', 'pinCapacity']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Loại pin" name={['pinAdapter', 'pinType']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Công suất tối đa" name={['pinAdapter', 'maxAdapterPower']}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu thông số
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    );
};

export default ProductSpecifications;
