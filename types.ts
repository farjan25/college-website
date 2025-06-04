export type comment = {
    id: string | null
    text: string
}

export type PostType = {
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
    // 0 means Create Post and 1 means Show Post
};

export type ChanceMePost = {
    id?: string
    created_at?: string
    title?: string
    body?: string
    user_id?: string

    postType?: number
    // 0 means Create Post and 1 means Show Post
}