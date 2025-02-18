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
    console.log(supabaseKey);
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAllUsersBrief() {
    if (this.supabase == null) {
      this.setupClient();
    }

    const { data: user_details, error } = await this.supabase
      .from('user_details')
      .select('id,first_name,last_name,avatar,gender,dob');

      console.log(user_details);
      console.log(error);

    if (!error) {
      return user_details;
    } else {
      console.log("Could not fetch user details");
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

      console.log(user_details);
      console.log(error);

    if (!error) {
      return user_details;
    } else {
      console.log("Could not fetch users details");
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
      console.log(user_details)

    if (!error) {
      return user_details;
    } else {
      console.log("Could not fetch user details");
      console.log(error)
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
      console.log("Could not fetch user requests");
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
      console.log("Could not fetch user request by ID");
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
      console.log("Could not create user");
      console.log(error)
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
      console.log("Could not delete user request");
      console.log(error)
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
      console.log("Could not delete user ");
      console.log(error)
    }
  }

  async updateUser(userDetails) {
    if (this.supabase == null) {
      this.setupClient();
    }

    console.log(userDetails)
    const { id, ...noIdDetails } = userDetails;

    const { data, error } = await this.supabase
    .from('user_details')
    .update(noIdDetails)
    .eq('id', id)
    .select()
            
    
    if (error){
      console.log(error)
      console.log("Could not update user");
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
        console.log(user_details)
  
      if (!error) {
        return user_details;
      } else {
        console.log("Could not fetch user details");
        console.log(error)
        return null;
      }
    }


}


  export default SupaBaseAdminAPI;
