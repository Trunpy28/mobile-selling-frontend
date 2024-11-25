import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Button, Form, Input, message, Select, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAccessToken } from "../../services/axiosJWT";
import userService from "../../services/userService";
import { changeAvatar, updateUserProfile } from "../../redux/userStore";
import Loading from "../../components/Loading/Loading";
import axios from "axios";
import addressVietNam from "../../constants/addressConstants";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const user = useSelector((state) => state.user);

  const formRef = useRef(null); // Ref để truy cập Form
  useEffect(() => {
    if (formRef.current && user) {
      formRef.current.setFieldsValue({
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        city: user?.address?.city,
        district: user?.address?.district,
        ward: user?.address?.ward,
        detailedAddress: user?.address?.detailedAddress,
      });
    }
  }, [user]);

  const dispatch = useDispatch();
  const accessToken = handleGetAccessToken();
  const navigate = useNavigate();

  //Xử lý địa chỉ
  const [address, setAddress] = useState({
    city: user?.address?.city, // Mã tỉnh được chọn
    district: user?.address?.district, // Mã quận/huyện được chọn
    ward: user?.address?.ward, // Mã phường/xã được chọn
  });

  // Lấy danh sách tỉnh, quận và phường dựa trên trạng thái
  const cities = addressVietNam;
  const districts =
    address.city &&
    cities.find((city) => city.name === address.city)?.districts;

  const wards =
    address.district &&
    districts?.find((district) => district.name === address.district)?.wards;

  // Xử lý khi chọn tỉnh
  const handleCityChange = (value) => {
    setAddress({
      city: value,
      district: null, // Reset quận/huyện khi đổi tỉnh
      ward: null, // Reset phường/xã khi đổi tỉnh
    });
  };

  // Xử lý khi chọn quận
  const handleDistrictChange = (value) => {
    setAddress((prev) => {
      return {
        ...prev,
        district: value,
        ward: null,
      };
    })
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = (value) => {
    setAddress((prev) => {
      return {
        ...prev,
        ward: value,
      };
    });
  };

  //Xử lý thay ảnh avatar
  const avatarUploadMutation = useMutation({
    mutationFn: (file) => {
      const accessToken = handleGetAccessToken();
      return userService.updateAvatar(accessToken, file);
    },
    onSuccess: (data) => {
      dispatch(changeAvatar({ avatarUrl: data.avatarUrl }));
      message.success("Cập nhật ảnh đại diện thành công!", 3);
    },
    onError: (error) => {
      message.error("Cập nhật ảnh đại diện thất bại!", 3);
    },
    
  });

  const handleOnChangeAvatar = ({ fileList }) => {
    const file = fileList[0];
    
    if (file && file.originFileObj && (file.status !== "uploading")) {
      avatarUploadMutation.mutate(fileList[0].originFileObj);
    }
  };

  //Xử lý thay đổi thông tin người dùng
  const mutationUpdateProfile = useMutation({
    mutationFn: (profile) => {
      const accessToken = handleGetAccessToken();
      return userService.updateProfile(accessToken, profile);
    },
    onSuccess: (data) => {
      message.success("Cập nhật thông tin thành công!", 3);
      dispatch(
        updateUserProfile({
          name: data.user.name,
          phoneNumber: data.user.phoneNumber,
          address: data.user.address,
        })
      );
    },
    onError: (error) => {
      message.error("Cập nhật thông tin thất bại!", 3);
    }
  })
  
  const onFinishUpdateProfile = (values) => {
    const profile = {
      name: values.name,
      phoneNumber: values.phoneNumber,
      address: {
        city: values.city,
        district: values.district,
        ward: values.ward,
        detailedAddress: values.detailedAddress,
      }
    }
    mutationUpdateProfile.mutate(profile);
  }

  //Yêu cầu đăng nhập khi chưa có accessToken
  useEffect(() => {
    if (!accessToken) {
      navigate("/sign-in");
    }
  }, [accessToken, navigate])

  return (
    <div className="bg-primary w-full flex justify-center py-20">
      <div className="flex flex-col gap-14 rounded-3xl border-slate-300  justify-center pl-24 py-10 bg-white text-black">
      <div className="font-bold text-2xl text-center">Thông tin tài khoản</div>
      <div className="flex gap-32 ">
        <div className="flex justify-center h-full w-2/5">
          <div className="flex flex-col gap-8 items-center">
            <span className="text-xl rounded-2xl p-3 bg-slate-950 text-white">Ảnh đại diện</span>
            <Loading isLoading={avatarUploadMutation.isPending}>
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<UserOutlined color="primary"/>}
                src={user?.avatarUrl}
              />
            </Loading>
            <Upload onChange={handleOnChangeAvatar} maxCount={1} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </div>
        </div>

        <div className="flex w-full pl-10 ">
          <Loading isLoading={mutationUpdateProfile.isPending}>
            <Form
            size="large"
              ref={formRef}
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              style={{
                width: 600,
              }}
              onFinish={onFinishUpdateProfile}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="email"
              >
                <Input defaultValue={user?.email} readOnly style={{cursor: 'default'}}/>
              </Form.Item>

              <Form.Item label="Họ và tên" name="name">
                <Input placeholder="Nhập họ và tên" defaultValue={user?.name}/>
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    pattern: /^0[0-9]{9,10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" defaultValue={user?.phoneNumber} />
              </Form.Item>

              <Form.Item label="Tỉnh/Thành phố" name="city">
                <Select
                  options={cities.map((city) => ({
                    value: city.name,
                    label: <span>{city.name}</span>,
                  }))}
                  placeholder="Chọn Tỉnh/Thành phố"
                  onChange={handleCityChange}
                  defaultValue={address.city}
                />
              </Form.Item>

              <Form.Item label="Quận/Huyện" name="district">
                <Select
                  options={districts?.map((district) => ({
                    value: district.name,
                    label: <span>{district.name}</span>,
                  }))}
                  placeholder="Chọn Quận/Huyện"
                  onChange={handleDistrictChange}
                  defaultValue={address.district}
                />
              </Form.Item>

              <Form.Item label="Phường/Xã" name="ward">
                <Select
                  options={wards?.map((ward) => ({
                    value: ward.name,
                    label: <span>{ward.name}</span>,
                  }))}
                  placeholder="Chọn Phường/Xã"
                  onChange={handleWardChange}
                  defaultValue={address.ward}
                />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="detailedAddress" style={{ backgroundColor: "white" }}>
                <Input.TextArea
                  placeholder="Nhập địa chỉ"
                  style={{ minHeight: "100px" }}
                  defaultValue={user?.address?.detailedAddress}
                />
              </Form.Item>

              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <Button type="primary" htmlType="submit">
                  Lưu thông tin
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </div>
      </div>
      </div>
    </div>
  );
}

export default UserProfile;
