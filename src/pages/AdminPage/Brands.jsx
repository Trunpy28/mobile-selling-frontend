import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react'
import brandService from '../../services/brandService';

const Brands = () => {

    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

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
        fetchBrands();
    }, []);


    const handleEdit = (record) => {
        console.log("Edit:", record);
    };

    const handleDelete = (record) => {
        console.log("Delete:", record);
    };

    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Logo',
            dataIndex: 'logoUrl',
            render: (text) => <img src={text} alt="product" style={{ width: 50 }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },

        {
            title: 'Description',
            dataIndex: 'description',
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
        },
    ];
    return (
        <div>
            <div className='flex justify-between py-4'>
                <h1 className='font-bold text-xl text-gray-800'>Danh sách thương hiệu</h1>
                <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
                    + New
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={brands}
                loading={loading}
            />
        </div>
    )
}

export default Brands