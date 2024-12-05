import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const brandService = {
  getAllBrands: async () => {
    const respond = await axios.get(`${apiUrl}/brand/get-all`);
    return respond.data;
  },

  getBrandByName: async (brandName) => {
    const res = await axios.get(`${apiUrl}/brand/brand-by-name/${brandName}`);
    return res.data;
  },
};

export default brandService;
