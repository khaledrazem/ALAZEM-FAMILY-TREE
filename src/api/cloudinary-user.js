class CloudinaryUserAPI {
  constructor() {
    this.isConfigured = false;
  }

  setupClient() {
    if (this.isConfigured) return;

    // Use server-side environment variables instead of NEXT_PUBLIC_*
    this.cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const cloudinaryApiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    

    if (!this.cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      throw new Error('Missing Cloudinary environment variables. Please check your .env configuration.');
    }

    this.isConfigured = true;
  }

  async uploadImage(file) {
    if (!this.isConfigured) {
      this.setupClient()
    }
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/upload`;
    const fd = new FormData();
    fd.append('upload_preset', "image-upload-ui");
    fd.append('tags', 'browser_upload'); // Optional - add tags for image admin in Cloudinary
    fd.append('file', file);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: fd,
      });
      const data = await response.json();
      console.log(data);
      // File uploaded successfully
      const img_url = data.url;
      console.log(img_url);
      return img_url;
    } catch (error) {
      console.error('Error uploading the file:', error);
      throw error;
    }
  }
}

export default CloudinaryUserAPI