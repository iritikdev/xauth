'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MobileSidebar from './mobile-sidebar'
import Image from 'next/image'
import CurrentDateTime from './current-datetime'
import Link from 'next/link'


export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (<div className='container mx-auto'>
        <header className="flex  items-center justify-between px-4 bg-white">
            <div className="flex items-center gap-4">
                <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-6 w-6" />
                </button>
                <Image src="/aalogoc.png" alt={"Logo"} width={80} height={50} className='object-contain w-16 h-16  sm:h-24 sm:w-24' />
            </div>

            <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
                <Input placeholder="Search..." className="max-w-md " />
            </div>
            <CurrentDateTime />
            <div className="hidden md:flex items-center gap-2 ml-3">

                <Link href="/sign-in"> <Button variant="outline">Login</Button></Link>
                <Link href="/sign-up"> <Button>Sign Up</Button></Link>
            </div>

            <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </header>
    </div>
    )
}