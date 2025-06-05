import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import  supabase  from '@/supabase'
import { User } from '@supabase/supabase-js'

interface postProps {
    postData: {
        id?: string
        created_at?: string
        title?: string
        body?: string
        user_id?: string
      }
      onClose: () => void
  }


export default function CMShowResultPost({postData, onClose}: postProps) {

    const [currentUser, setUser] = useState<string | null>("")

    useEffect(() => {
        (async () => {
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user?.id || null)
        })()
      }, [])

      async function deletePost() {
        const { error } = await supabase
        .from('chanceme-test')
        .delete()
        .eq('id', postData.id)

        if ( error ) {
            console.error("Error:", error)
        } else {
            onClose()
            console.log('successful deletion')
        }
      }
    
    return(
        <motion.div 
            initial ={{ opacity:0, scale: 0.9}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-30 left-1/2 -translate-x-1/2 w-220 h-170 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 overflow-y-auto overflow-visible"
        >

            <div className="py-1">
                    <span className='text-[24px]'>{postData.title}</span>
                    <button onClick={onClose} className="ml-3 absolute top-5 right-5 bg-white rounded-full p-2 hover:bg-gray-200">
                        <X size={20}></X>
                    </button>
                </div>

                <div className="py-3">
                    <span className='text-[20px]'>{postData.body}</span>
                </div>
                {
                    (currentUser === postData.user_id) && (
                    <div className="absolute bottom-0 left-0 p-5">
                        <Button onClick={deletePost} variant="red">Delete</Button>
                    </div>
                    )
                }
               
        </motion.div>
    )
}