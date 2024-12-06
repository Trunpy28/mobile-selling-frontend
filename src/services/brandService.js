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

  createBrand: async (brand, image) => {
    const URL_BACKEND = `${apiUrl}/brand/create`;

    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("description", brand.description);
    formData.append("logoUrl", image);

    const res = await axios.post(URL_BACKEND, formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }
};

export default brandService;
