import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Select } from "antd";
import { useEffect, useState } from "react";
import brandService from "../../services/brandService";
import productService from "../../services/productService";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState("Apple");
    const navigate = useNavigate();

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
        };

        const fetchProductByBrand = async () => {
            setLoading(true);
            try {
                const products = await productService.getProductsByBrand(selectedBrand, 30);
                setProducts(products.products);
                console.log("Products:", products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
        fetchProductByBrand();

    }, [selectedBrand]);

    const handleEdit = (record) => {
        navigate(`/admin/products/detail/${record._id}`);
    };

    const handleDelete = (productId) => {
        try {
            productService.deleteProduct(productId);
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleBrandChange = (value) => {
        setSelectedBrand(value);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'image',
            render: (text) => {
                const firstImage = Array.isArray(text) && text.length > 0 ? text[0] : '';
                return firstImage ? <img src={firstImage} alt="product" style={{ width: 50 }} /> : null;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (text, record, index, action) => {
                if (text)
                    return new Intl.NumberFormat('vi-VN',
                        { style: 'currency', currency: 'VND' }).format(text)

            },
        },
        {
            title: 'Original Price',
            dataIndex: 'originalPrice',
            render: (text, record, index, action) => {
                if (text)
                    return new Intl.NumberFormat('vi-VN',
                        { style: 'currency', currency: 'VND' }).format(text)

            },
        },

        {
            title: 'Quantity',
            dataIndex: 'countInStock',
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <EditOutlined
                        onClick={() => {
                            handleEdit(record);
                        }}
                        style={{ cursor: "pointer", color: "orange" }} />
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn chắc chắn xóa sản phẩm này ?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        placement="left"
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex-col justify-between items-center">
                <h1 className="font-bold text-xl text-gray-800">Danh mục sản phẩm</h1>
                <div className="flex py-4 items-center justify-between">
                    <Select
                        value={selectedBrand}
                        onChange={handleBrandChange}
                        className="w-1/12"
                    >
                        {brands.map((brand) => (
                            <Select.Option key={brand._id} value={brand.name}>
                                {brand.name}
                            </Select.Option>
                        ))}
                    </Select>

                    <Button
                        type="primary"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/admin/products/create')}
                    >
                        + New
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={products}
                loading={loading}
            />
        </div>
    );
};

export default Products;
