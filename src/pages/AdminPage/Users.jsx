import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Modal, Popconfirm, Row, Table } from 'antd'
import { useEffect, useState } from 'react'
import userService from '../../services/userService';

const Users = () => {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (userId) => {
        try {
            userService.deleteUser(userId);
            setUsers(users.filter(user => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleView = async (userId) => {
        try {
            const user = await userService.getUserById(userId);
            setSelectedUser(user.data);
            setIsModalOpen(true);
            console.log("User:", user.data);

        } catch (error) {
            console.error("Error fetching user by ID:", error);
        }
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const users = await userService.getAllUsers();
                setUsers(users.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchAllUsers();
    }, []);

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            render: (text, record, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatarUrl',
            render: (text) => (
                <img
                    src={text || 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'}
                    alt="avatar"
                    style={{ width: 60, height: 60 }}
                />
            ),
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
        },
        {
            title: 'Email người dùng',
            dataIndex: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Vai trò',
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
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <EyeOutlined
                        onClick={() => handleView(record._id)}
                        style={{ cursor: 'pointer', color: 'orange' }}
                    />
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn chắc chắn xóa người dùng này ?"
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
            <Modal
                title="Thông tin người dùng"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
            >
                {selectedUser ? (
                    <div>
                        <Row>
                            <Col span={8} className='flex justify-start items-center'>
                                <img
                                    src={selectedUser.avatarUrl || 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'}
                                    alt="avatar"
                                    style={{ width: 80 }}
                                />
                            </Col>
                            <Col span={16} className='flex-col gap-2'>
                                <p><strong>Name:</strong> {selectedUser.name}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
                                <p><strong>Role:</strong> {selectedUser.role}</p>
                                <p><strong>Address:</strong>{selectedUser.address.detailedAddress}, {selectedUser.address.ward}, {selectedUser.address.district}, {selectedUser.address.city}</p>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <p>Đang tải thông tin người dùng...</p>
                )}
            </Modal>
        </div>
    )
}

export default Users