import { ChanceMePost } from "@/types"

interface PostProps{
    id?: string
    created_at?: string
    title?: string
    body?: string
    user_id?: string
    
    postType?: number
    onPostClick: (postData: ChanceMePost) => void
}

export default function CMPost({id, created_at, title, body, user_id, postType, onPostClick}: PostProps) {

    const newPost: ChanceMePost = {
        id: id,
        created_at: created_at,
        title: title,
        body: body,
        user_id: user_id,

        postType: 1
    }

    return (
        <div onClick={() => onPostClick(newPost)} className="w-85 h-120 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 cursor-pointer">
          <h2 className="font-bold">{title}</h2>
          <p>{body}</p>
        </div>
    )
}