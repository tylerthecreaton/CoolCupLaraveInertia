import { Link } from '@inertiajs/react';
import { BsCloudSun, BsUmbrella, BsStars } from 'react-icons/bs';
import { FaRegCompass, FaFish, FaUmbrella, FaWater, FaStar, FaCircle } from 'react-icons/fa';
import { RiSailboatLine, RiLeafLine } from 'react-icons/ri';
import { IoLeaf } from 'react-icons/io5';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-beach-sky via-beach-water-light to-beach-sand-light bg-beach-pattern">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated Sun */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-tropical-fruit to-summer-500 rounded-full opacity-60 animate-pulse-soft shadow-summer-lg">
                    {/* Sun Rays */}
                    <div className="absolute inset-0 animate-spin-slow">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-48 h-1 bg-tropical-fruit-light/60"
                                style={{ transform: `rotate(${i * 30}deg) translateX(8rem)` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Beach Sand with Pattern */}
                <div className="absolute bottom-0 left-0 right-0 h-40">
                    <div className="absolute inset-0 bg-gradient-to-t from-beach-sand via-beach-sand-light to-transparent"></div>
                    <div className="absolute inset-0 bg-wave-pattern opacity-10"></div>
                </div>

                {/* Sparkles */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-sparkle"
                        style={{
                            top: `${Math.random() * 60 + 20}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        <BsStars className="text-beach-coral-light text-sm" />
                    </div>
                ))}

                {/* Animated Palm Trees */}
                <div className="absolute -bottom-4 -left-4 w-48 h-48">
                    <div className="relative w-full h-full animate-sway">
                        <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-gradient-to-b from-summer-700 to-summer-900 transform -translate-x-1/2 rounded-t-full shadow-md">
                            {/* Coconuts */}
                            <div className="absolute -right-2 top-3/4 text-summer-800">
                                <FaCircle className="text-lg animate-float-gentle" />
                            </div>
                        </div>
                        {/* Palm Leaves */}
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bottom-28 left-1/2 w-24 h-16 origin-bottom"
                                style={{
                                    transform: `rotate(${-60 + i * 30}deg) translateX(${i % 2 ? -1 : 1}rem)`,
                                }}
                            >
                                <div className="w-full h-full bg-gradient-to-r from-tropical-leaf to-tropical-leaf-light rounded-full transform skew-x-12 animate-palm-wave shadow-lg flex items-center justify-center">
                                    <IoLeaf className="text-tropical-leaf-dark transform -rotate-45" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute -bottom-4 -right-4 w-48 h-48">
                    <div className="relative w-full h-full animate-sway-reverse">
                        <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-gradient-to-b from-summer-700 to-summer-900 transform -translate-x-1/2 rounded-t-full shadow-md">
                            {/* Coconuts */}
                            <div className="absolute -left-2 top-2/3 text-summer-800">
                                <FaCircle className="text-lg animate-float-gentle" />
                            </div>
                        </div>
                        {/* Palm Leaves */}
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bottom-28 left-1/2 w-24 h-16 origin-bottom"
                                style={{
                                    transform: `rotate(${-120 + i * 30}deg) translateX(${i % 2 ? 1 : -1}rem)`,
                                }}
                            >
                                <div className="w-full h-full bg-gradient-to-r from-tropical-leaf to-tropical-leaf-light rounded-full transform -skew-x-12 animate-palm-wave-reverse shadow-lg flex items-center justify-center">
                                    <IoLeaf className="text-tropical-leaf-dark transform rotate-45" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Beach Decorations */}
                <div className="absolute bottom-8 left-1/4 text-beach-coral text-2xl animate-float-slow">
                    <BsUmbrella className="transform -rotate-12 drop-shadow-lg" />
                </div>
                <div className="absolute bottom-12 right-1/3 text-beach-water text-2xl animate-float-slower">
                    <RiSailboatLine className="transform rotate-12 drop-shadow-lg" />
                </div>
                <div className="absolute bottom-16 left-2/3 text-beach-shell text-xl animate-float-slowest">
                    <FaRegCompass className="animate-spin-slow drop-shadow-lg" />
                </div>

                {/* Seashells and Starfish */}
                <div className="absolute bottom-6 left-1/3 text-beach-shell-light text-lg animate-bounce-gentle">
                    <FaCircle className="drop-shadow-lg" />
                </div>
                <div className="absolute bottom-4 right-1/4 text-beach-coral text-xl animate-float-gentle">
                    <FaStar className="drop-shadow-lg" />
                </div>
                <div className="absolute bottom-8 right-1/2 text-beach-shell text-lg animate-bounce-gentle">
                    <FaCircle className="drop-shadow-lg rotate-180" />
                </div>

                {/* Swimming Fish */}
                <div className="absolute bottom-20 left-0 text-beach-water-light text-sm animate-float-gentle">
                    <FaFish className="transform -scale-x-100" />
                </div>
                <div className="absolute bottom-24 right-1/4 text-beach-water text-xs animate-float-gentle" style={{ animationDelay: '1s' }}>
                    <FaFish />
                </div>

                {/* Floating Clouds */}
                <div className="absolute top-10 left-10 w-32 h-12">
                    <div className="absolute inset-0 bg-white rounded-full opacity-40 animate-float-slow shadow-glow-blue"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-sm"></div>
                </div>
                <div className="absolute top-20 right-32 w-40 h-14">
                    <div className="absolute inset-0 bg-white rounded-full opacity-30 animate-float-slower shadow-glow-blue"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-sm"></div>
                </div>
                <div className="absolute top-40 left-1/4 text-tropical-fruit text-3xl animate-float-slowest">
                    <BsCloudSun className="drop-shadow-lg" />
                </div>

                {/* Beach Waves */}
                <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-24 animate-wave">
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-beach-water/40 via-beach-water-light/50 to-beach-water/40 transform -skew-x-12"></div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 h-24 animate-wave-slow">
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-beach-water/30 via-beach-water-light/40 to-beach-water/30 transform skew-x-12"></div>
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
                        <Link
                            href="/"
                            className="inline-block transform transition-all duration-500 hover:scale-110 hover:rotate-3 relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-beach-coral-light via-beach-shell to-beach-water-light opacity-75 blur-lg animate-pulse-soft"></div>
                            <img
                                src="/images/CoolCup Dicut.png"
                                alt="CoolCup Logo"
                                className="relative h-24 w-auto object-contain drop-shadow-xl"
                            />
                        </Link>
                        <h1 className="mt-6 bg-gradient-to-r from-beach-coral via-beach-shell to-beach-water bg-clip-text text-3xl font-bold text-transparent animate-gradient text-shadow-lg">
                            CoolCup
                        </h1>
                        <p className="mt-2 text-sm text-summer-700 animate-fade-in font-medium text-shadow-sm">
                            ระบบจัดการร้านเครื่องดื่มชากาแฟออนไลน์
                        </p>
                    </div>

                    <div className="transform transition-all duration-700 hover:scale-[1.02] relative">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-beach-coral-light/50 to-beach-water-light/50 rounded-2xl blur"></div>
                        <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md shadow-summer-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-beach-sand-light/40"></div>
                            <div className="relative p-8">
                                {children}
                            </div>
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-beach-coral-light/20 to-beach-water-light/20 transform rotate-45 translate-x-12 -translate-y-12"></div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-summer-800/70 animate-fade-in font-medium text-shadow-sm">
                            {new Date().getFullYear()} CoolCup. All rights reserved.
                        </p>
                        <div className="mt-2 flex justify-center space-x-2 text-beach-coral-light/60">
                            <FaCircle className="animate-float-gentle" style={{ animationDelay: '0s' }} />
                            <FaStar className="animate-float-gentle" style={{ animationDelay: '0.3s' }} />
                            <FaCircle className="animate-float-gentle" style={{ animationDelay: '0.6s' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
