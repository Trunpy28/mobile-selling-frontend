import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Popconfirm, Table } from 'antd'
import { useEffect, useState } from 'react'
import userService from '../../services/userService';

const Users = () => {

    const [users, setUsers] = useState([]);

    const handleDetail = (record) => {
        console.log("Edit:", record);
    };

    const handleDelete = (record) => {
        console.log("Delete:", record);
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const users = await userService.getAllUsers();
                setUsers(users.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchAllUsers();
    }, [])

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatarUrl',
            render: (text) => <img src={text} alt="product" style={{ width: 50 }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            filters: [
                {
                    text: 'User',
                    value: 'User',
                },
                {
                    text: 'Admin',
                    value: 'Admin',
                }
            ],

            onFilter: (value, record) => record.name.indexOf(value) === 0,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: "flex", gap: "20px" }}>
                    <EyeOutlined
                        onClick={() => {
                            handleDetail(record);
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

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div className='flex-col gap-5'>
            <h1 className='font-bold text-xl text-gray-800 pb-4'>Danh sách người dùng</h1>
            <Table
                columns={columns}
                dataSource={users}
                onChange={onChange}
            />
        </div>
    )
}

export default Users