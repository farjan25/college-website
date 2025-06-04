import { motion } from "framer-motion";
import { X } from "lucide-react";
import PostEntry from "./ui/postEntry";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { comment } from '@/types'

interface postProps {
    postData: {
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
      }
      onClose: () => void
  }

export default function ShowResultPost({postData, onClose}: postProps) 
{

    type College = {
        id: number;
        value: string | null
    }
    type Major = {
        id: number;
        value: string | null
    }
    type Hook = {
        id: number;
        value: string | null
    }

    const colleges: College[] = Array.isArray(postData.colleges)
    ? postData.colleges as College[]
    : [];

    const majors: Major[] = Array.isArray(postData.major)
    ? postData.major as Major[]
    : [];

    const hooks: Hook[] = Array.isArray(postData.hooks)
    ? postData.hooks as Hook[]
    : [];

    const collegeValues = colleges.map(college => college.value)
    const majorValues = majors.map(major => major.value)
    const hookValues = hooks.map(hook => hook.value)

    const filteredCollegeValues = [...new Set(collegeValues)]
    const filteredMajorValues = [...new Set(majorValues)]
    const filteredHookValues = [...new Set(hookValues)]

    const [currentUser, setUser] = useState<string | null>("")
    
    useEffect(() => {
        (async () => {
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user?.id || null)
        })()
      }, [])

      const updateComments = async () => {
        setCommentText("")
      }

      useEffect(() => {
            updateComments()
      
            const subscription = supabase
            .channel('realtime-posts')
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'results-submissions-test'
              },
              (payload) => {
                console.log("comment update", payload.new)
                updateComments()
              }
            )
      
            return () => {
              supabase.removeChannel(subscription);
            };

          }, [])

      async function deletePost() {
        const { error } = await supabase
        .from('results-submissions-test')
        .delete()
        .eq('id', postData.id)

        if ( error ) {
            console.error("Error:", error)
        } else {
             onClose()
            console.log('successful deletion')
        }
      }

      const [commentText, setCommentText] = useState("");

      async function postComment() {
        setCommentText("")
        const newComment: comment = {
            id: currentUser,
            text: commentText
        }

        if (postData.comments == undefined) {
            postData.comments = []
        }

        if (postData.comments) {
            postData.comments.push(newComment)  
        }

        console.log(postData.comments)
        
        const { data, error } = await supabase
        .from("results-submissions-test")
        .update({ comments: postData.comments })
        .eq('id', postData.id)

        console.log(error)

        console.log(postData.id)
      }
        
      const bodyThreshold = 100

    return(
        <motion.div 
            initial ={{ opacity:0, scale: 0.9}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="top-30 left-1/2 -translate-x-1/2 w-220 h-170 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 absolute overflow-y-auto overflow-visible"
        >

            <div className="py-1">
                    <span className='text-[24px]'>{postData.title}</span>
                    <button onClick={onClose} className="ml-3 absolute top-5 right-5 bg-white rounded-full p-2 hover:bg-gray-200">
                        <X size={20}></X>
                    </button>
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px] py-1">College(s):</span>
                    {filteredCollegeValues.length === 0 && <PostEntry size="large" data="No Colleges"/>}

                    {
                        filteredCollegeValues.length >= 1 && (
                            filteredCollegeValues.map((college) => 
                                <PostEntry size="medium" data={college}/>
                            )
                        )                       
                    }
                </div>
                
                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">Major(s):</span>
                    {filteredMajorValues.length === 0 && <PostEntry size="large" data="No Majors"/>}
                    
                    {
                        filteredMajorValues.length >= 1 && (
                            filteredMajorValues.map((major) => 
                                <PostEntry size="medium" data={major}/>
                            )
                        )
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">GPA:</span>
                    {
                        postData.gpa && (
                            <PostEntry size='small' data={postData.gpa} />
                        )
                    }
                    {
                        postData.gpa === "" && (
                            <PostEntry size='small' data="N/A" />
                        )
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px] py-1">SAT:</span>
                    {
                        postData.sat && (
                            <PostEntry size='small' data={postData.sat} />
                        )
                    }
                    {
                        postData.sat === "" && (
                            <PostEntry size='small' data="N/A" />
                        )
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">ACT:</span>
                    {
                        postData.act && (
                            <PostEntry size='small' data={postData.act} />
                        )
                    }
                    {
                        postData.act === "" && (
                            <PostEntry size='small' data="N/A" />
                        )
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">Hooks:</span>
                    {filteredHookValues.length === 0 && <PostEntry size="large" data="No Hooks"/>}
                    
                    {
                        filteredHookValues.length >= 1 && (
                            filteredHookValues.map((hook) => 
                                <PostEntry size="medium" data={hook}/>
                            )
                        )
                    }
                </div>

                <div className="py-3">
                    <span className='text-[20px]'>{postData.body}</span>
                </div>
                
                <div className="pt-20">
                {
                    !postData.comments || postData.comments.length === 0 ? (
                        <div>
                            No Comments yet
                        </div>
                    ) : (
                    postData.comments.map((comment) => (
                        <div>
                            <p>{comment.id}</p>
                            <p>{comment.text}</p>
                        </div>
                    )
                    )
                    )
                }
                
                <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="border border-gray-300 rounded-md h-15 p-4 w-195"
                    />
                </div>

                <div className="flex">
                {
                    postData.body && postData.body.length < bodyThreshold ? (
                        <div className="mt-10"> 
                            <Button onClick={postComment}>Post Comment</Button>
                        </div>
                    ) : (
                        <div className="mt-10"> 
                            <Button onClick={postComment}>Post Comment</Button>
                        </div>
                    )
                }

                {
                    (currentUser === postData.user_id) && (postData.body) && (postData.body.length < bodyThreshold ) && (
                    <div className="ml-160 mt-10">
                        <Button onClick={deletePost} variant="red">Delete</Button>
                    </div>
                    )
                }

                {
                    (currentUser === postData.user_id) && (postData.body) && (postData.body.length > bodyThreshold ) && (
                        <div className="flex mt-10 ml-160">
                            <Button onClick={deletePost} variant="red">Delete</Button>
                        </div>
                    )
                }
                </div>

        </motion.div>
    )
}