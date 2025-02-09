import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated Sun */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-30 animate-pulse">
                    {/* Sun Rays */}
                    <div className="absolute inset-0 animate-spin-slow">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-48 h-1 bg-yellow-300/30"
                                style={{ transform: `rotate(${i * 30}deg) translateX(8rem)` }}
                            ></div>
                        ))}
                    </div>
                </div>
                
                {/* Animated Palm Trees */}
                <div className="absolute -bottom-4 -left-4 w-48 h-48">
                    <div className="relative w-full h-full animate-sway">
                        {/* Palm Tree Trunk */}
                        <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-gradient-to-b from-orange-800 to-orange-900 transform -translate-x-1/2 rounded-t-full"></div>
                        {/* Palm Leaves */}
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bottom-28 left-1/2 w-24 h-16 origin-bottom"
                                style={{
                                    transform: `rotate(${-60 + i * 30}deg) translateX(${i % 2 ? -1 : 1}rem)`,
                                }}
                            >
                                <div className="w-full h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transform skew-x-12 animate-palm-wave"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute -bottom-4 -right-4 w-48 h-48">
                    <div className="relative w-full h-full animate-sway-reverse">
                        {/* Palm Tree Trunk */}
                        <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-gradient-to-b from-orange-800 to-orange-900 transform -translate-x-1/2 rounded-t-full"></div>
                        {/* Palm Leaves */}
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bottom-28 left-1/2 w-24 h-16 origin-bottom"
                                style={{
                                    transform: `rotate(${-120 + i * 30}deg) translateX(${i % 2 ? 1 : -1}rem)`,
                                }}
                            >
                                <div className="w-full h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transform -skew-x-12 animate-palm-wave-reverse"></div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Floating Clouds */}
                <div className="absolute top-10 left-10 w-32 h-12 bg-white rounded-full opacity-40 animate-float-slow"></div>
                <div className="absolute top-20 right-32 w-40 h-14 bg-white rounded-full opacity-30 animate-float-slower"></div>
                <div className="absolute bottom-40 left-20 w-36 h-12 bg-white rounded-full opacity-20 animate-float-slowest"></div>

                {/* Beach Waves */}
                <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-24 animate-wave">
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-300/20 via-blue-400/20 to-blue-300/20 transform -skew-x-12"></div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 h-24 animate-wave-slow">
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-300/10 via-blue-400/10 to-blue-300/10 transform skew-x-12"></div>
                    </div>
                </div>

                {/* Flying Birds */}
                <div className="absolute top-32 left-1/4 animate-bird-flight">
                    <div className="relative">
                        <span className="absolute w-3 h-1 bg-gray-800/40 rounded-full transform rotate-[30deg] animate-wing"></span>
                        <span className="absolute w-3 h-1 bg-gray-800/40 rounded-full transform -rotate-[30deg] animate-wing-reverse"></span>
                    </div>
                </div>
                <div className="absolute top-24 left-1/3 animate-bird-flight-slow">
                    <div className="relative">
                        <span className="absolute w-3 h-1 bg-gray-800/40 rounded-full transform rotate-[30deg] animate-wing-slow"></span>
                        <span className="absolute w-3 h-1 bg-gray-800/40 rounded-full transform -rotate-[30deg] animate-wing-reverse-slow"></span>
                    </div>
                </div>
            </div>

            <div className="flex min-h-screen flex-col items-center justify-center p-4 relative z-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center transform transition-all duration-700 hover:scale-105">
                        <Link href="/" className="inline-block transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                            <ApplicationLogo className="h-24 w-24 fill-current text-orange-500" />
                        </Link>
                        <h1 className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent animate-gradient">
                            CoolCup
                        </h1>
                        <p className="mt-2 text-sm text-orange-700 animate-fade-in">
                            ระบบจัดการร้านเครื่องดื่มชากาแฟออนไลน์
                        </p>
                    </div>

                    <div className="transform transition-all duration-700 hover:scale-[1.02]">
                        <div className="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md shadow-xl ring-1 ring-orange-100/30 animate-fade-in-up">
                            <div className="relative p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-orange-50/40 backdrop-blur-sm -z-10"></div>
                                {children}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-orange-700/70 animate-fade-in">
                        {new Date().getFullYear()} CoolCup. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
