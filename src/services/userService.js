import axios from "axios"
import axiosJWT from "./axiosJWT";
const apiUrl = import.meta.env.VITE_API_URL;
const userApiUrl = `${apiUrl}/user`;

const userService = {
    signIn: async (email, password) => {
        const respond = await axios.post(`${userApiUrl}/sign-in`, {
            email,
            password
        }, {
            withCredentials: true,
        })

        return respond.data;
    },

    register: async (email, password, passwordConfirm) => {
        const URL_BACKEND = `${userApiUrl}/register`;
        const data = {
            email,
            password,
            passwordConfirm
        }
        const res = await axios.post(URL_BACKEND, data);
        return res;
    },
    getUserInformation: async (accessToken) => {
        const respond = await axiosJWT.get(`${userApiUrl}/user-infomation`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return respond.data;
    },
    signOut: async () => {
        const response = await axios.post(`${apiUrl}/user/sign-out`);
        return response.data;
    },
    refreshAccessToken: async () => {
        const respond = await axios.post(`${userApiUrl}/refresh-access-token`,
            {}, 
            {
                withCredentials: true,     // Lấy cookies chứa refreshToken cho vào req
            }
        );
        return respond.data;
    },
    updateAvatar: async (accessToken, avatarFile) => {
        const formData = new FormData();
        formData.append('avatarImage', avatarFile);

        const response = await axiosJWT.patch(`${userApiUrl}/change-avatar`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
            }
        });

        return response.data;
    },
    updateProfile: async (accessToken, profile) => {
        const response = await axiosJWT.put(`${userApiUrl}/update-profile`, profile, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
        
}


export default userService;