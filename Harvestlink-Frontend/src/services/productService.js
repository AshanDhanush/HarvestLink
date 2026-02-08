import axios from 'axios';

const API_URL = 'http://localhost:8082/api/product';

const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

const createProduct = async (productData, imageFile) => {
  const formData = new FormData();
  // productData should be a JSON string or object. 
  // Backend expects @RequestPart("product") ProductRequest and @RequestPart("image") MultipartFile

  // We need to append 'product' as a Blob with application/json type to ensure it's treated as a part properly
  const productBlob = new Blob([JSON.stringify(productData)], {
    type: 'application/json'
  });

  formData.append('product', productBlob);
  formData.append('image', imageFile);

  try {
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product", error);
    throw error;
  }
};

const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/update/by/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error);
    throw error;
  }
};

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
