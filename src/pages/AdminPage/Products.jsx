import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Select } from "antd";
import { useEffect, useState } from "react";
import brandService from "../../services/brandService";
import productService from "../../services/productService";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState("Apple");

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
                const products = await productService.getProductsByBrand(selectedBrand, 50);
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
        console.log("Edit:", record);
    };

    const handleDelete = (record) => {
        console.log("Delete:", record);
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
            render: (text) => <img src={text} alt="product" style={{ width: 50 }} />,
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

                    <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
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
