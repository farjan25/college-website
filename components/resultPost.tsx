import { motion } from "framer-motion";
import { Plus, X } from 'lucide-react';
import { Button } from "./ui/button";
import { Collegesdropdown } from "./ui/collegesdropdown";
import { useState, useEffect } from "react";
import { Majorsdropdown } from "./ui/majorsdropdown";
import { Slider } from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { Hooksdropdown } from "./ui/hooksdropdown";
import { supabase } from '../supabase'

export default function ResultPost ( { closePost }: { closePost: () => void } ) {

    const [postColleges, setColleges] = useState<{ id: number; value: string | null }[]>([]);
    
        const handleCollegesSelect = (index: number, value: string) => {
            setColleges((prev) =>
                prev.map((college, i) => (i === index ? { ...college, value } : college))
            );
        }
        const removeCollege = (index: number) => {
            setColleges((prev) => prev.filter((_, i) => i !== index))
        }

    const [postMajors, setMajors] = useState<{ id: number; value: string | null }[]>([]);

        const handleMajorSelect = (index: number, value: string) => {
            setMajors((prev) =>
                prev.map((major, i) => (i === index ? { ...major, value } : major))
            );
        }
        const removeMajor = (index: number) => {
            setMajors((prev) => prev.filter((_, i) => i !== index))
        }

    const [useGPA, setUseGPA] = useState(false)
    const [gpaValue, setGPAValue] = useState("")

    const [useSat, setUseSat] = useState(false)
    const [satValue, setSatValue] = useState("")

    const [useAct, setUseAct] = useState(false)
    const [actValue, setActValue] = useState("")

    const [postHooks, setHooks] = useState<{ id: number; value: string | null }[]>([]);

    const handleHooksselect = (index: number, value: string) => {
        setHooks((prev) =>
            prev.map((hook, i) => (i === index ? { ...hook, value } : hook))
        );
    }
    const removeHook = (index: number) => {
        setHooks((prev) => prev.filter((_, i) => i !== index))
    }

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

    const postedHooks = postHooks.filter(hook => hook.value !== null);

    const postedMajors = postMajors.filter(major => major.value !== null);

    const postedColleges = postColleges.filter(college => college.value !== null);

    const postButton = async() => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.from("results-submissions-test").insert([

          {
            user_id: user?.id,
            title: debouncedTitleText,
            colleges: postedColleges,
            gpa: gpaValue,
            sat: satValue,
            act: actValue,
            major: postedMajors,
            body: debouncedBodyText,
            hooks: postedHooks
          },
          ]);

          if (error) {
            console.error("Error:", error);
          } else {
            console.log("Post Uploaded", data)
          }

        console.log("the button was clicked")
        closePost()
    }
    
    return (
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

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px] py-1">College(s):</span>
                    {postColleges.map((college, index) =>
                    <Collegesdropdown 
                    key={college.id} 
                    selectedValue={college.value}
                    onSelect={(value) => handleCollegesSelect(index, value)}
                    onRemove={() => removeCollege(index)} />
                    )}
                    
                <button
                    onClick={() => {
                        setColleges([...postColleges, { id: postColleges.length, value: null }]);
                    }}
                    className="bg-white rounded-full p-2 hover:bg-gray-200 w-8"
                >
                    <Plus size={16}></Plus>
                </button>
                </div>
                
                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">Major(s):</span>
                    {postMajors.map((major, index) =>
                        <Majorsdropdown 
                        key={major.id} 
                        selectedValue={major.value}
                        onSelect={(value) => handleMajorSelect(index, value)}
                        onRemove={() => removeMajor(index)} />
                    )}
                    
                    <button
                    onClick={() => {
                        setMajors([...postMajors, { id: postMajors.length, value: null }]);
                    }}
                    className="bg-white rounded-full p-2 hover:bg-gray-200 w-8"
                    >
                        <Plus size={16}></Plus>
                    </button>
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">GPA:</span>
                    {
                        useGPA ? 
                        <>
                        <Input 
                        type="number"
                        min="0"
                        max="4"
                        value={gpaValue}
                        onChange={(e) => setGPAValue(e.target.value)}
                        className="w-16"></Input>
                        <button onClick={() => setUseGPA(false)} className="bg-white rounded-full p-1 hover:bg-gray-200">
                            <X size={16}/>
                        </button>
                        </> 
                        :
                        <button onClick={() => setUseGPA(true)} className="bg-white rounded-full p-2 hover:bg-gray-200">
                            <Plus size={14} />
                        </button>
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px] py-1">SAT:</span>

                    {
                        useSat ? 
                        <>
                        <Input 
                        type="number"
                        min="0"
                        max="1600"
                        value={satValue}
                        onChange={(e) => setSatValue(e.target.value)}
                        className="w-19"></Input>
                        <button onClick={() => setUseSat(false)} className="bg-white rounded-full p-1 hover:bg-gray-200">
                            <X size={16}/>
                        </button>
                        </> 
                        :
                        <button onClick={() => setUseSat(true)} className="bg-white rounded-full p-2 hover:bg-gray-200">
                            <Plus size={14} />
                        </button>
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">ACT:</span>
                    {
                        useAct ? 
                        <>
                        <Input 
                        type="number"
                        min="0"
                        max="36"
                        value={actValue}
                        onChange={(e) => setActValue(e.target.value)}
                        className="w-15"></Input>
                        <button onClick={() => setUseAct(false)} className="bg-white rounded-full p-1 hover:bg-gray-200">
                            <X size={16}/>
                        </button>
                        </> 
                        :
                        <button onClick={() => setUseAct(true)} className="bg-white rounded-full p-2 hover:bg-gray-200">
                            <Plus size={14} />
                        </button>
                    }
                </div>

                <div className="py-2 space-x-1 flex flex-wrap gap-x-2 gap-y-2">
                    <span className="text-[18px]">Hooks:</span>
                    {postHooks.map((hook, index) =>
                        <Hooksdropdown 
                        key={hook.id} 
                        selectedValue={hook.value}
                        onSelect={(value) => handleHooksselect(index, value)}
                        onRemove={() => removeHook(index)} />
                    )}
                    {postHooks.length < 3 && (
                        <button
                        onClick={() => {
                            if (postHooks.length < 3) {
                            setHooks([...postHooks, { id: postHooks.length, value: null }]);
                            }
                        }}
                        className="bg-white rounded-full p-2 hover:bg-gray-200 w-8"
                        >
                            <Plus size={16}></Plus>
                        </button>
                    )}                
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