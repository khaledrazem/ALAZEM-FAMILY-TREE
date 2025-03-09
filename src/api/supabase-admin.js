import { createClient } from '@supabase/supabase-js';

class SupaBaseAdminAPI {
  constructor() {
    this.supabase = null;
  }

  setupClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env configuration.');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAllUsersBrief() {
    if (this.supabase == null) {
      this.setupClient();
    }

    const { data: user_details, error } = await this.supabase
      .from('user_details')
      .select('id,first_name,last_name,avatar,gender,dob');

      
      

    if (!error) {
      return user_details;
    } else {
      
      return [];
    }
  }

  async getAllUsers() {
    if (this.supabase == null) {
      this.setupClient();
    }

    const { data: user_details, error } = await this.supabase
      .from('user_details')
      .select('*');

      
      

    if (!error) {
      return user_details;
    } else {
      
      return [];
    }
  }


  async getUserDetails(userId) {
    if (!userId){
      return;
    }
    if (this.supabase == null) {
      this.setupClient();
    }

    const { data: user_details, error } = await this.supabase
      .from('user_details')
      .select('*')
      .eq('id', userId)
      .single();
      

    if (!error) {
      return user_details;
    } else {
      
      
      return null;
    }
  }

  async getUserRequests() {
    if (this.supabase == null) {
      this.setupClient();
    }
    
 
    let { data: user_requests, error } = await this.supabase
    .from('user_requests')
    .select('*')
        

    if (!error) {
      return user_requests;
    } else {
      
      return null;
    }
  }

  async getUserRequestById(requestId) {
    if (this.supabase == null) {
      this.setupClient();
    }
    
 
    let { data: user_requests, error } = await this.supabase
    .from('user_requests')
    .select("*")
    .eq('id', requestId)
    .single();
        

    if (!error) {
      return user_requests;
    } else {
      
      return null;
    }
  }


  async createUser(requestData) {
    if (this.supabase == null) {
      this.setupClient();
    }
    
    const { data, error } = await this.supabase
    .from('user_details')
    .insert([
      requestData
    ])
    .single()
    .select()
        
        

    if (!error) {
      return data;
    } else {
      
      
      throw Error
    }
  }

  async deleteRequest(userId) {
    if (this.supabase == null) {
      this.setupClient();
    }
    
    
    const { error } = await this.supabase
    .from('user_requests')
    .delete()
    .eq('id', userId)
      
    if (error){
      
      
    }
  }

  async deleteUser(userId) {
    if (this.supabase == null) {
      this.setupClient();
    }
    
    
    const { error } = await this.supabase
    .from('user_details')
    .delete()
    .eq('id', userId)
      
    if (error){
      
      
    }
  }

  async updateUser(userDetails) {
    if (this.supabase == null) {
      this.setupClient();
    }

    
    const { id, ...noIdDetails } = userDetails;

    const { data, error } = await this.supabase
    .from('user_details')
    .update(noIdDetails)
    .eq('id', id)
    .select()
            
    
    if (error){
      
      
    }
  }


    async getUserDetails(userId) {
      if (!userId){
        return;
      }
      if (this.supabase == null) {
        this.setupClient();
      }
  
      const { data: user_details, error } = await this.supabase
        .from('user_details')
        .select('*')
        .eq('id', userId)
        .single();
        
  
      if (!error) {
        return user_details;
      } else {
        
        
        return null;
      }
    }


}


  export default SupaBaseAdminAPI;
