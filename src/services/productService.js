import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const productService = {
  getAllProducts: async (queries) => {
    const URL_BACKEND = `${apiUrl}/product/get-all`;
    const res = await axios.get(URL_BACKEND, {
      params: queries,
    });
    return res.data;
  },

  getProductById: async (productId) => {
    const URL_BACKEND = `${apiUrl}/product/product-details/${productId}`;
    console.log(URL_BACKEND);

    const res = await axios.get(URL_BACKEND);
    return res.data;
  },

  getProductBySlug: async (slug) => {
    const URL_BACKEND = `${apiUrl}/product/${slug}`;
    const res = await axios.get(URL_BACKEND);
    return res.data;
  },

  getProductsByBrand: async (brandName, limit) => {
    const URL_BACKEND = `${apiUrl}/product/products-of-brand`;
    const respond = await axios.get(
      URL_BACKEND,
      {
        params: {
          brandName,
          limit,
        },
      }
    );
    return respond.data;
  },

  createProduct: async (product, images) => {
    const URL_BACKEND = `${apiUrl}/product/create`;
    const formData = new FormData();

    formData.append('brand', product.brand);
    formData.append('name', product.name);
    formData.append('color', product.color);
    formData.append('originalPrice', product.originalPrice);
    formData.append('price', product.price);
    formData.append('countInStock', product.countInStock);
    formData.append('description', product.description);
    images.forEach((image) => {
      formData.append('imageUrl', image.originFileObj);
    });

    const res = await axios.post(URL_BACKEND, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};

export default productService;
