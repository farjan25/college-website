import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { useState} from 'react'
import { PlusIcon } from "@heroicons/react/24/solid"
import { Plus, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider';
import { Hooksdropdown } from '@/components/ui/hooksdropdown'
import { Input } from "@/components/ui/input"
import { Majorsdropdown } from '@/components/ui/majorsdropdown'
import { Collegesdropdown } from '@/components/ui/collegesdropdown'
import ResultPost from '@/components/resultPost'
import PostGrid from '@/components/postGrid'
import ShowResultPost from '@/components/showResultPost'
import { PostType } from '@/types'

export default function () {
    const [isOpen, setIsOpen] = useState(false);

    function openFilters() {
        handleUpdate()
        setIsOpen(!isOpen)
    }

    const [ newNoteOpen, setNewNoteOpen] = useState(false);
    const [ showNewPost, setShowNewPost] = useState<PostType | null>(null);

    function createNew() {
        const newPost: PostType = {
            postType: 0
        }
        setShowNewPost(newPost)
    }

    function handlePostClick(post: PostType) {
        setShowNewPost(post)
    }

    const [gpa, setGpa] = useState([2.0, 4.0]);

    const [sat, setSAT] = useState([800, 1600]);

    const [act, setACT] = useState([0, 36]);

    const [majors, setMajors] = useState<{ id: number; value: string | null }[]>([]);

    const handleMajorSelect = (index: number, value: string) => {
        setMajors((prev) =>
            prev.map((major, i) => (i === index ? { ...major, value } : major))
        );
    }
    const removeMajor = (index: number) => {
        setMajors((prev) => prev.filter((_, i) => i !== index))
    }

    const [colleges, setColleges] = useState<{ id: number; value: string | null }[]>([]);

    const handleCollegesSelect = (index: number, value: string) => {
        setColleges((prev) =>
            prev.map((college, i) => (i === index ? { ...college, value } : college))
        );
    }
    const removeCollege = (index: number) => {
        setColleges((prev) => prev.filter((_, i) => i !== index))
    }
    
    const [hooks, setHooks] = useState<{ id: number; value: string | null }[]>([]);

    const handleHooksselect = (index: number, value: string) => {
        setHooks((prev) =>
            prev.map((hook, i) => (i === index ? { ...hook, value } : hook))
        );
    }
    const removeHook = (index: number) => {
        setHooks((prev) => prev.filter((_, i) => i !== index))
    }

    //const filteredHooks = hooks.filter(hook => hook.value !== null);
    //console.log(filteredHooks);

    //const filteredMajors = majors.filter(major => major.value !== null);
    //console.log(filteredMajors);

    //const filteredColleges = colleges.filter(college => college.value !== null);
    //console.log(filteredColleges);

    const filters = {
        colleges,
        majors,
        gpa,
        sat,
        act,
        hooks,
    }

    const [updateCount, setUpdateCount] = useState(0)
    const handleUpdate = () => {
        setUpdateCount(prev => prev + 1)
    }

    return (
        <>
        
        <div>
            <Header />
        </div>

        <div className = "flex-1 p-4 overflow-y-auto h-screen pt-26 ">
            <PostGrid onPostClick={handlePostClick} filters={filters} update={updateCount}/>
        </div>


        <div className = "fixed bottom-4 left-4">
            <button onClick={createNew} className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center hover:bg-yellow-400 transition">
                <PlusIcon className='w-7 h-7 text-white' />
            </button>
        </div>
        {
            showNewPost && (

                showNewPost.postType === 0 ? (
                    <ResultPost closePost={() => setShowNewPost(null)} />
                ) : (
                    <ShowResultPost postData={showNewPost} onClose={() => setShowNewPost(null)} />
                )
            )
        }

        <div className="fixed top-25 right-4">
            <Button onClick={openFilters}variant='outline' className='sticky'>
                filters
            </Button>
        </div>

        <div className={`space-y-8 leading-loose text-lg fixed top-0 left-0 h-full w-100 bg-gray-50 p-6 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <h1 className='pb-4 text-2xl font-bold text-center'>
                Filters
            </h1>

            <div >
                <span>Major(s)</span>
                <div className="flex flex-wrap gap-2">
                    {majors.map((major, index) =>
                        <Majorsdropdown 
                        key={major.id} 
                        selectedValue={major.value}
                        onSelect={(value) => handleMajorSelect(index, value)}
                        onRemove={() => removeMajor(index)} />
                    )}
                    
                    <button
                    onClick={() => {
                        setMajors([...majors, { id: majors.length, value: null }]);
                    }}
                    className="bg-white rounded-full p-2 hover:bg-gray-200 w-8"
                    >
                        <Plus size={16}></Plus>
                    </button>
                    
                </div>
            </div>

            <div>
                <span>GPA</span>
                <Slider 
                min={0.0}
                max={4.0}
                step={0.1}
                value={gpa}
                onValueChange={(value) => setGpa(value)}
                className = 'w-64'
                />

                <div className="flex space-x-4">
                    <Input 
                    type="text"
                    placeholder='Min GPA'
                    disabled
                    value={gpa[0]}
                    className='bg-white w-12 mt-4'>
                    </Input>
                    <span className="mt-4">
                        to
                    </span>
                    <Input 
                    type="text"
                    placeholder='Max GPA'
                    disabled
                    value={gpa[1]}
                    className='bg-white w-12 mt-4'>
                    </Input>
                </div>
            </div>

            <span>Colleges</span>
            <div className="flex flex-wrap gap-2">
                {colleges.map((college, index) =>
                    <Collegesdropdown 
                    key={college.id} 
                    selectedValue={college.value}
                    onSelect={(value) => handleCollegesSelect(index, value)}
                    onRemove={() => removeCollege(index)} />
                )}
                    
                <button
                    onClick={() => {
                        setColleges([...colleges, { id: colleges.length, value: null }]);
                    }}
                    className="bg-white rounded-full p-2 hover:bg-gray-200 w-8"
                >
                    <Plus size={16}></Plus>
                </button>
            </div>

            <div>
                <span>SAT</span>
                <Slider 
                min={0}
                max={1600}
                step={10}
                value={sat}
                onValueChange={(value) => setSAT(value)}
                className = 'w-64'
                />

                <div className="flex space-x-4">
                    <Input 
                    type="text"
                    placeholder='Min SAT'
                    disabled
                    value={sat[0]}
                    className='bg-white w-16 mt-4'>
                    </Input>
                    <span className="mt-4">
                        to
                    </span>
                    <Input 
                    type="text"
                    placeholder='Max SAT'
                    disabled
                    value={sat[1]}
                    className='bg-white w-16 mt-4'>
                    </Input>
                </div>
            </div>
            
            <div>
                <span>ACT</span>
                <Slider 
                min={0.0}
                max={36}
                step={1}
                value={act}
                onValueChange={(value) => setACT(value)}
                className = 'w-64'
                />

                <div className="flex space-x-4">
                    <Input 
                    type="text"
                    placeholder='Min ACT'
                    disabled
                    value={act[0]}
                    className='bg-white w-12 mt-4'>
                    </Input>
                    <span className="mt-4">
                        to
                    </span>
                    <Input 
                    type="text"
                    placeholder='Max ACT'
                    disabled
                    value={act[1]}
                    className='bg-white w-12 mt-4'>
                    </Input>
                </div>
            </div>
            
            <span>Hooks</span>
            <div className="flex flex-wrap gap-2">
                {hooks.map((hook, index) =>
                    <Hooksdropdown 
                    key={hook.id} 
                    selectedValue={hook.value}
                    onSelect={(value) => handleHooksselect(index, value)}
                    onRemove={() => removeHook(index)} />
                )}
                {hooks.length < 3 && (
                    <button
                    onClick={() => {
                        if (hooks.length < 3) {
                        setHooks([...hooks, { id: hooks.length, value: null }]);
                        }
                    }}
                    className="bg-white rounded-full p-2 hover:bg-gray-200 w-8"
                    >
                        <Plus size={16}></Plus>
                    </button>
                )}

                
                
            </div>

            <div>
                <Button onClick={openFilters}>
                    Apply Filters
                </Button>
            </div>
        </div>

                

        <script src=""></script>
        </>
    )
}
