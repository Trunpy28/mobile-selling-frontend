import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Typography } from "antd";
const { Title } = Typography;
import React, { useEffect } from "react";
import userService from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

function SignIn() {
	const navigate = useNavigate();

	const { mutate, data ,isPending, isSuccess, isError } = useMutation({
		mutationFn: async ({email, password}) => {
			await userService.signIn(email, password);
		},
		onSuccess: () => {
			message.success("Đăng nhập thành công!", 3);
		},
		onError: (error) => {
			message.error(error?.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.", 3);
		}
	})

  const onFinish = (values) => {
    mutate(values);
  };

	useEffect(() => {

	}, [isSuccess, isError])

  return (
    <div className="bg-primary w-screen flex justify-center py-20">
			<Loading isLoading={isPending}>
        <div className="flex flex-col gap-4 rounded-3xl border-slate-300  justify-center p-20 bg-white">
          <Title level={2} style={{textAlign: 'center'}}>Đăng nhập</Title>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
              width: 400
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Mật khẩu không được để trống!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item 
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button type="primary" htmlType="submit">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Loading>
    </div>
  );
}

export default SignIn;
