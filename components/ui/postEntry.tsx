interface postProps {
    data: string | null | undefined
    size: "small" | "medium" | "large"
}

export default function PostEntry({data, size} : postProps) {

    const sizeClasses = {
        small: "w-15",
        medium: "w-20",
        large: "w-25"
    }


    return (
        <div className={`${sizeClasses[size]} flex items-center justify-center h-8 rounded-3xl bg-gray-200 border border-input text-sm font-normal shadow-sm`}>
            <span>{data}</span>
        </div>
        
    )
}