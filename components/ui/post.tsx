import ShowResultPost from '@/components/showResultPost' 
import { PostType, comment } from '@/types'

interface postProps {
  id?: string
  created_at?: string
  title?: string
  colleges?: string | null
  gpa?: string | null
  sat?: string | null
  act?: string | null
  major?: string | null
  body?: string
  hooks?: string | null
  user_id?: string
  comments?: comment[]

  postType?: number
  onPostClick: (postData: PostType) => void
}


export default function Post({
  id, created_at, title, colleges, gpa, sat, act, major, body, hooks, user_id, comments, onPostClick}
  : postProps) 
  {
    
    const newPost: PostType = {
      id: id,
      created_at: created_at,
      title: title,
      colleges: colleges,
      gpa: gpa,
      sat: sat,
      act: act,
      major: major,
      body: body,
      hooks: hooks,
      user_id: user_id,
      comments: comments,

      postType: 1
    }

    return (
    <div onClick={() => onPostClick(newPost)} className="w-85 h-120 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 cursor-pointer">
      {
        title && title.length < 50 &&
        <h2 className="font-bold">{title}</h2>
      }
      {
        title && title.length > 29 &&
        <h2 className="font-bold">{title.slice(0,29)}...</h2>
      }

      <div className="py-3">
      {
        body && body.length < 100 && 
        <p>{body}</p>
      }
      {
        body && body.length > 600 &&
        <p>{body.slice(0, 600)}...</p>
      }
      </div>

    </div>
    )
}