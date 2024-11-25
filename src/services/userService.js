import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;

const userService = {
    signIn: async (email, password) => {
        const respond = await axios.post(`${apiUrl}/user/sign-in`, {
            email,
            password
        })

        return respond.data;
    },

    register: async (email, password, passwordConfirm) => {
        const URL_BACKEND = `${apiUrl}/user/register`;
        const data = {
            email,
            password,
            passwordConfirm
        }
        const res = await axios.post(URL_BACKEND, data);
        return res;
    }
}

export default userService;