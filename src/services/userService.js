import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;

const userService = {
    signIn: async (email, password) => {
        console.log(apiUrl);
        const respond = await axios.post(`${apiUrl}/users/sign-in`, {
            email,
            password
        })

        return respond.data;
    }
}

export default userService;