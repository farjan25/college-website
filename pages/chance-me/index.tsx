import Header from '@/components/header'
import { Slider } from '@/components/ui/slider'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react';
import { ChanceMePost } from '@/types';
import CMResultPost from '@/components/CMResultPost'
import CMShowResultPost from '@/components/CMShowResultPost'
import CMPostGrid from '@/components/CMPostGrid';

export default function () {

    const [ showNewPost, setShowNewPost] = useState<ChanceMePost | null>(null);

    function createNew() {
      const newPost: ChanceMePost = {
                postType: 0
            }
        setShowNewPost(newPost)
    }

    function handlePostClick(post: ChanceMePost) {
        setShowNewPost(post)
    }
    
    return (
        <>
        <div className="flex justify-center items-center h-screen">
            <Header />
            
            <div className = "flex-1 p-4 overflow-y-auto h-screen pt-26 ">
                <CMPostGrid onPostClick={handlePostClick} />
            </div>


            <div className = "fixed bottom-4 left-4">
                <button onClick={createNew} className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center hover:bg-yellow-400 transition">
                    <PlusIcon className='w-7 h-7 text-white' />
                </button>
            </div>
            {
                showNewPost && (
                    showNewPost.postType === 0 ? (
                        <CMResultPost closePost={() => setShowNewPost(null)} />
                    ) : (
                        <CMShowResultPost postData={showNewPost} onClose={() => setShowNewPost(null)} />
                    )
                )
            }
        </div>      
        </>
    )
}