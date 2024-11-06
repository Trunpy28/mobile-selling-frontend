import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;
import userService from '../../services/userService';

const SignUp = () => {

    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log(values);
        const res = await userService.register(
            values.email,
            values.password,
            values.passwordConfirm
        );

        if (res.data) {
            message.success('Đăng ký thành công!');
            navigate('/sign-in');
        }
        else {
            message.error('Đăng ký thất bại!');
        }
    };

    return (
        <div className="bg-primary w-screen flex justify-center py-20">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-300 bg-white p-10 shadow-lg w-full max-w-md">
                <Title level={2} className="text-center">Đăng ký</Title>
                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Hãy nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: 'Hãy nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="passwordConfirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Hãy xác nhận mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    <Form.Item className="text-center">
                        <Button type="primary" htmlType="submit" className="w-full">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default SignUp;
