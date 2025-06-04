import {motion} from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { supabase } from '@/supabase'

export default function CMResultPost({ closePost }: { closePost: () => void }) {
    
    const [titleText, setTitleText] = useState("")
    const [debouncedTitleText, setDebouncedTitleText] = useState("")
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedTitleText(titleText); // Only update after 500ms of no typing
        }, 500);
        
        return () => clearTimeout(handler); // Cleanup previous timeout
    }, [titleText]);
    
    const [bodyText, setBodyText] = useState("");
    const [debouncedBodyText, setDebouncedBodyText] = useState("")

    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedBodyText(bodyText); // Only update after 500ms of no typing
        }, 500);
    
        return () => clearTimeout(handler); // Cleanup previous timeout
      }, [bodyText]);


    const postButton = async() => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.from("chanceme-test").insert([
        
            {
                title: debouncedTitleText,
                body: debouncedBodyText,
                user_id: user?.id
            },
        ]);

        if (error) {
          console.error("Error:", error);
        } else {
          console.log("Post Uploaded", data)
        }

        closePost()
    }

    return(
        <div>
            <motion.div 
            initial ={{ opacity:0, scale: 0.9}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-30 left-1/2 -translate-x-1/2 w-220 h-170 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 overflow-y-auto overflow-visible"
            >
                <div className="py-1">
                    <input 
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="Title"
                    className="border border-gray-300 rounded-md p-2 w-195"
                    />
                    <button onClick={closePost} className="ml-3 relative top-1 bg-white rounded-full p-2 hover:bg-gray-200">
                        <X size={20}></X>
                    </button>
                </div>

                <div className="py-3">
                    <textarea
                        value={bodyText}
                        onChange={(e) => setBodyText(e.target.value)}
                        placeholder='body'
                        className="w-210 h-140 border border-gray-300 rounded-lg p-4 resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={postButton}>Post</Button>
                </div>
                

            </motion.div>
        </div>
    )
}