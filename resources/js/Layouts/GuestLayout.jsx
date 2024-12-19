import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50">
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-block transform transition-transform hover:scale-110">
                            <ApplicationLogo className="h-24 w-24 fill-current text-cyan-600" />
                        </Link>
                        <h1 className="mt-6 bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
                            CoolCup
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            ระบบจัดการร้านเครื่องดื่มชากาแฟออนไลน์
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-black/5">
                        <div className="p-8">
                            {children}
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        {new Date().getFullYear()} CoolCup. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
