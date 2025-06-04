import { useState, useEffect } from "react"
import { ChanceMePost } from '@/types'
import { supabase } from "@/supabase";
import CMPost from '@/components/ui/CMPost'

interface gridProps {
  onPostClick: (postData: ChanceMePost) => void;
}

export default function CMPostGrid({onPostClick}: gridProps) {
    const [posts, setPosts] = useState<ChanceMePost[]>([])

    const fetchPosts = async () => {
        const { data, error } = await supabase
          .from('chanceme-test')
          .select('*')
          .order('created_at', {ascending: false})
        if (error) {
          console.error("Error:", error);
        } else {
          setPosts(data);
          console.log(data)
        }
    
    }

    useEffect(() => {
        fetchPosts()
  
        const subscription = supabase
        .channel('realtime-posts')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chanceme-test'
          },
          (payload) => {
            console.log("new post inserted", payload.new)
            fetchPosts()
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'chanceme-test'
          },
          (payload) => {
            console.log('Post deleted:', payload.old)
            fetchPosts()
          }
        )
        .subscribe()
  
        return () => {
          supabase.removeChannel(subscription);
        };
      }, [])

    return(
        <div className="grid grid-cols-5 gap-12">
            {posts.map((post) => (
                <CMPost 
                id={post.id}
                created_at={post.created_at}
                title={post.title}
                body={post.body}
                user_id={post.user_id}
            
                onPostClick={onPostClick}
                />
         // add props with post.title, post.content etc.
            ))}
        </div>
    )
}