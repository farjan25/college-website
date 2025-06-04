import Post from '@/components/ui/post' 
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import ShowResultPost from './showResultPost';
import { PostType } from '@/types'
import { getMaxListeners } from 'events';

type FilterItem = {
  id: number; 
  value: string | null 
};

type filterType = {
  colleges: FilterItem[],
  majors: FilterItem[],
  gpa: number[],
  sat: number[],
  act: number[],
  hooks: FilterItem[],
}

interface gridProps {
  onPostClick: (postData: PostType) => void;
  update: number
  filters: filterType
}

export default function PostGrid({onPostClick, update, filters}: gridProps) {

    const [posts, setPosts] = useState<PostType[]>([])
    const [shownPost, setShownPost] = useState<PostType | null>(null)
    const [newPost, setNewPost] = useState(false)


    const fetchPosts = async () => {
      const { data, error } = await supabase
      .from('results-submissions-test')
      .select('*')
      .order('created_at', {ascending: false})
      if (error) {
        console.error("Error:", error);
      } else {
        setPosts(applyFilters(data, filters));
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
          table: 'results-submissions-test'
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
          table: 'results-submissions-test'
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
    
    useEffect(() => {
      fetchPosts()
    }, [update])

    function applyFilters(data: any[], filters: filterType ) {
      console.log(filters)
      return data.filter(item => {

        const filterColleges = filters.colleges
          .map(item => item.value)
          .filter((value): value is string => value !== null)

        const filterMajors = filters.majors
          .map(item => item.value)
          .filter((value): value is string => value !== null)

        const filterHooks = filters.hooks
          .map(item => item.value)
          .filter((value): value is string => value !== null)

        const matchesCollege =
        filters.colleges.length === 0 ||
        item.colleges.some((college: { id: number; value: string | null}) => college.value !== null && filterColleges.includes(college.value));

        const matchesMajor =
        filters.majors.length === 0 ||
        item.major.some((major: { id: number; value: string | null}) => major.value !== null && filterMajors.includes(major.value));

        const matchesGpa =
          filters.gpa.length === 0 || 
          item.gpa === "" ||
          (item.gpa >= filters.gpa[0] && item.gpa <= filters.gpa[1])

        const matchesSat =
          filters.sat.length === 0 || 
          item.sat === "" ||
          (item.sat >= filters.sat[0] && item.sat <= filters.sat[1])

        const matchesAct =
          filters.act.length === 0 || 
          item.act === "" ||
          (item.act >= filters.act[0] && item.act <= filters.act[1])

        const matchesHooks =
        filters.hooks.length === 0 ||
        item.hooks.some((hook: { id: number; value: string | null}) => hook.value !== null && filterHooks.includes(hook.value));

        return (
          matchesCollege &&
          matchesMajor &&
          matchesGpa &&
          matchesSat &&
          matchesAct &&
          matchesHooks
        );
      }
      )
    }

    return (
      // there should be a key here
          <div className="grid grid-cols-5 gap-12"> 
          {posts.map((post) => (
              <Post 
              id={post.id}
              created_at={post.created_at}
              title={post.title}
              colleges={post.colleges}
              gpa={post.gpa}
              sat={post.sat}
              act={post.act}
              major={post.major}
              body={post.body}
              hooks={post.hooks}
              user_id={post.user_id}
              comments={post.comments}

              onPostClick={onPostClick}
              />
              // add props with post.title, post.content etc.
          ))}
      </div>
    )
}