class CloudinaryUserAPI {
  constructor() {
    this.isConfigured = false;
  }

  setupClient() {
    if (this.isConfigured) return;

    // Use server-side environment variables instead of NEXT_PUBLIC_*
    this.cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    this.cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    this.cloudinaryApiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
    

    if (!this.cloudinaryCloudName || !this.cloudinaryApiKey || !this.cloudinaryApiSecret) {
      throw new Error('Missing Cloudinary environment variables. Please check your .env configuration.');
    }

    this.isConfigured = true;
  }

  async deleteImage(fileName) {
    if (!this.isConfigured) {
      this.setupClient()
    }
    
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/image/destroy`;
    const fd = new FormData();
    fd.append('public_id', fileName);
    fd.append('api_key', this.cloudinaryApiKey); 
    // Generate signature
    const timestamp = Math.floor(Date.now() / 1000).toString();
    fd.append('timestamp', timestamp);
    const signature = this.generateCloudinarySignature(fd, this.cloudinaryApiSecret);
    fd.append('signature', signature);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: fd,
      });
      const data = await response.json();
      // File deleted successfully
     
    } catch (error) {
      console.error('Error uploading the file:', error);
      throw error;
    }
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
      
      // File uploaded successfully
      const img_url = data.url;
      
      return img_url;
    } catch (error) {
      console.error('Error uploading the file:', error);
      throw error;
    }
  }

  generateCloudinarySignature(params, apiSecret) {
    // Remove excluded keys
    const excludedKeys = ['file', 'cloud_name', 'resource_type', 'api_key', 'signature'];
    const filteredParams = {};
    for (let [key, value] of params.entries()) {
      if (!excludedKeys.includes(key)) {
        filteredParams[key] = value;
      }
    }

    // Sort parameters alphabetically and create the query string
    const sortedQuery = Object.keys(filteredParams)
      .sort()
      .map(key => `${key}=${filteredParams[key]}`)
      .join('&');

    // Append API secret
    const signatureBase = sortedQuery + apiSecret;

    // Generate SHA-1 hash
    return require('crypto').createHash('sha1').update(signatureBase).digest('hex');
  }
}

export default CloudinaryUserAPI