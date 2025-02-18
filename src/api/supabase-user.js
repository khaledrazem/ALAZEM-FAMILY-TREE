import { createClient } from '@supabase/supabase-js';

class SupaBaseUserAPI {
  constructor() {
    this.supabase = null;
  }

  setupClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    
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


  async createUserRequest(requestData) {
    if (this.supabase == null) {
      this.setupClient();
    }

    console.log(requestData);
    const {
      first_name,
      last_name,
      gender,
      dob,
      marital_status,
      avatar,
      gallery_photos,
      id_documents,
      email,
      public_email,
      father,
      mother,
      siblings,
      children,
      is_editing,
      existing_id,
    } = requestData;

    const { data, error } = await this.supabase
      .from('user_requests')
      .insert([
        { 
          "first_name": first_name ? first_name : null,
          "last_name": last_name ? last_name : null,
          "gender": gender ? gender : null,
          "dob": dob ? dob : null,
          "marital_status": marital_status ? marital_status : null,
          "avatar": avatar ? avatar : null,
          "gallery_photos": gallery_photos ? gallery_photos : null,
          "id_documents": id_documents ? id_documents : null,
          "email": email ? email : null,
          "public_email": public_email ? public_email : null,
          "father": father ? father : null,
          "mother": mother ? mother : null,
          "siblings": siblings ? siblings : null,
          "children": children ? children : null,
          "is_editing": is_editing ? is_editing : null,
          "existing_id": existing_id ? existing_id : null,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      console.log("Could not create user request");
      return null;
    }

    return data;
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

  async getUserRelations(userId) {
    if (this.supabase == null) {
      this.setupClient();
    }
    
    const { data: relationships, error } = await this.supabase
      .from('relationships')
      .select('*')
      .eq('base_person', userId);

    if (!error) {
      return relationships;
    } else {
      console.log("Could not fetch user relationships");
      return null;
    }
  }
}

export default SupaBaseUserAPI;
