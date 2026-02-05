// src/services/uploadService.js
import API from './api';

export const uploadService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // IMPORTANT: Change Content-Type for file upload
      const { data } = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return data.imageUrl; // Return the Cloudinary URL
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
};

export default uploadService;