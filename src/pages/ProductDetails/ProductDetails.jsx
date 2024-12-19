import { useState, useEffect } from 'react';
import 'antd/dist/reset.css';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import productDetailService from '../../services/productDetailService';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Tabs, Collapse, message, Spin } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { handleGetAccessToken } from '../../services/axiosJWT';
import cartService from '../../services/cartService';
import { useDispatch } from 'react-redux';
import { setCart } from '../../redux/cartSlice';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const ProductDetail = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [fade, setFade] = useState(false);

    const mutationAddToCart = useMutation({
        mutationFn: () => {
            const accessToken = handleGetAccessToken();
            return cartService.addProductToCart(accessToken, productId);
        },
        onSuccess: (data) => {
            message.success(data?.message, 3);
            dispatch(setCart(data?.cart));
        },
        onError: (error) => {
            message.error("Thêm sản phẩm thất bại", 3);
        }
    });

    const { data, isPending } = mutationAddToCart;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await productService.getProductById(productId);
                const productDetailResponse = await productDetailService.getProductDetail(productId);
                setProduct(productResponse.product);
                setProductDetail(productDetailResponse.data);
            } catch (error) {
                console.error('Error fetching product or product details', error);
            }
        };

        fetchData();
    }, [productId]);

    const handleNextImage = () => {
        if (product && product?.imageUrl) {
            setFade(true);
            setTimeout(() => {
                setSelectedImageIndex((prevIndex) =>
                    prevIndex === product?.imageUrl?.length - 1 ? 0 : prevIndex + 1
                );
                setFade(false);
            }, 300);
        }
    };

    const handlePreviousImage = () => {
        if (product && product?.imageUrl) {
            setFade(true);
            setTimeout(() => {
                setSelectedImageIndex((prevIndex) =>
                    prevIndex === 0 ? product?.imageUrl?.length - 1 : prevIndex - 1
                );
                setFade(false);
            }, 300);
        }
    };

    const handleThumbnailClick = (index) => {
        setFade(true);
        setTimeout(() => {
            setSelectedImageIndex(index);
            setFade(false);
        }, 300);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    const addToCart = () => {
        mutationAddToCart.mutate();
    }

    return (
        <Spin spinning={isPending}>
            <div className='max-w-screen-lg mx-auto p-6'>
                <div className='flex flex-col md:flex-row gap-8'>
                    <div className="w-full md:w-1/2 mb-4">
                        {product && product?.imageUrl && (
                            <div className="relative">
                                <div className={`mb-4 relative transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
                                    <img
                                        src={product?.imageUrl[selectedImageIndex]}
                                        alt={product?.name}
                                        className="w-full rounded-md"
                                    />
                                    <button
                                        onClick={handlePreviousImage}
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 shadow-lg opacity-80 hover:opacity-100 hover:bg-gray-600 transition-colors"
                                    >
                                        <FaChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-3 shadow-lg opacity-80 hover:opacity-100 hover:bg-gray-600 transition-colors"
                                    >
                                        <FaChevronRight size={20} />
                                    </button>
                                </div>
                                <div className="flex gap-2 overflow-x-auto mt-4">
                                    {product?.imageUrl?.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`cursor-pointer border ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'}`}
                                            onClick={() => handleThumbnailClick(index)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/2">
                        {product && (
                            <div>
                                <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
                                {productDetail && (
                                    <div className="space-y-2">
                                        <p><strong>Dung lượng:</strong> {productDetail.specifications.storage}</p>
                                        <p><strong>Màu:</strong> {product?.color}</p>
                                    </div>
                                )}
                                <div className="max-w-lg mx-auto py-7 rounded-lg ">
                                    <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 rounded-t-lg text-white flex justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-bold">Online Giá Rẻ Quá</h2>
                                            <div className="text-3xl font-bold">{formatCurrency(product?.price)}<sup>₫</sup></div>
                                            <div className="text-gray-200 line-through">{formatCurrency(product?.originalPrice)}<sup>₫</sup></div>
                                        </div>

                                    </div>
                                    <div className="bg-gray-900 p-4 text-white space-y-2">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Giao hàng nhanh chóng (tùy khu vực)</li>
                                            <li>Một số điện thoại chỉ mua 3 sản phẩm trong 1 tháng</li>
                                            <li>Giá và khuyến mãi có thể kết thúc sớm</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-900 p-4">
                                        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-colors" onClick={addToCart}>
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p>📦 Bộ sản phẩm gồm: Cáp, Cây lấy sim, Hộp, Sách hướng dẫn</p>
                        <p>🚚 Giao hàng nhanh toàn quốc</p>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto p-4 bg-[#242424]">
                    <Tabs defaultActiveKey="1" centered className='bg-dark text-white'>
                        <TabPane tab="Thông số kỹ thuật" key="1">
                            <Collapse
                                accordion
                                className="bg-[#242424] text-white"
                            >
                                <Panel
                                    header="Cấu hình & Bộ nhớ"
                                    key="1"
                                    className="bg-[#242424] text-white"
                                >
                                    <p>Hệ điều hành: {productDetail?.specifications.os}</p>
                                    <p>CPU: {productDetail?.specifications.cpu}</p>
                                    <p>GPU: {productDetail?.specifications.gpu}</p>
                                    <p>RAM: {productDetail?.specifications.ram}</p>
                                </Panel>
                                <Panel
                                    header="Camera & Màn hình"
                                    key="2"
                                    className="bg-[#242424] text-white"
                                >
                                    <p>Camera sau: {productDetail?.cameraDisplay.backCamera}</p>
                                    <p>Camera trước: {productDetail?.cameraDisplay.frontCamera}</p>
                                    <p>Độ rộng: {productDetail?.cameraDisplay?.displayWidth}</p>
                                    <p>Màn hình: {productDetail?.cameraDisplay?.displayTech}</p>
                                </Panel>
                                <Panel
                                    header="Pin & Sạc"
                                    key="3"
                                    className="bg-[#242424] text-white"
                                >
                                    <p>Loại pin: {productDetail?.pinAdapter?.pinType}</p>
                                    <p>Adapter Power: {productDetail?.pinAdapter?.maxAdapterPower}</p>
                                    <p>Capacity: {productDetail?.pinAdapter?.pinCapacity}</p>
                                </Panel>
                                <Panel
                                    header="Thiết kế & Chất liệu"
                                    key="4"
                                    className="bg-[#242424] text-white"
                                >
                                    <p>Thiết kế: {productDetail?.designMaterial?.design}</p>
                                    <p>Vật liệu: {productDetail?.designMaterial?.material}</p>
                                    <p>Khối lượng: {productDetail?.designMaterial?.sizeWeight}</p>
                                </Panel>
                            </Collapse>

                        </TabPane>
                        <TabPane tab="Đánh giá sản phẩm" key="2">
                            <div>
                                <h3>Đánh giá sản phẩm</h3>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Spin>
    );
};

export default ProductDetail;
