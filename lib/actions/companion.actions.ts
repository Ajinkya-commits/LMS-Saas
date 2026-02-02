'use server'

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase";
import { create } from "domain";

export const createCompanion = async (formData: CreateCompanion) => {
  
   const {userId : author} = await auth();
   const supabase = createSupabaseClient();

   const {data, error} = await supabase
    .from('companions')
    .insert({
      ...formData,
      author
    })
    .select()
   
    if(error || !data){
      throw new Error(error.message);
    }

    return data;
}


export const getAllCompanions = async ({limit = 10, page = 1, subject, topic} : GetAllCompanions) => { 
  const supabase = createSupabaseClient();
  let query = supabase.from('companions').select();

  if(subject && topic){
    query = query.ilike('subject', `%${subject}%`).or(`topic.ilike.%${topic}%, name.like.%${topic}%`);
  }
  else if(subject){
    query = query.ilike('subject', `%${subject}%`);
  }
  else if(topic){
    query = query.or(`topic.ilike.%${topic}%, name.like.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const {data : companions, error} = await query;

  if(error){
    throw new Error(error.message);
  }

  return companions;
}


export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null; 
  }

  return data; 
};
