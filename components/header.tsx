import { useRouter } from 'next/router';
import { Button } from './ui/button'

export default function header () {
    const router = useRouter();
    
    return (
    <div className="w-full flex justify-center bg-yellow-400 py-4 fixed top-0 left-0">
      <div className="flex space-x-2">
        <Button variant='default' className="h-12 px-6 text-base" onClick={() => router.push('/college-results')}> College Results </Button>
        <Button variant='default' className="h-12 px-6 text-base" onClick={() => router.push('/chance-me')}> Chance Me</Button>
      </div>
    </div>
    );
}
