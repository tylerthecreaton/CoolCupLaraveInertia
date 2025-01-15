import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import "@/../../resources/css/client-page.css";
import "/resources/css/styles.css";

import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

export default function MainContent() {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty("--progress", 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2069",
            title: "ชากาแฟที่ถูกใจคุณ",
            subtitle: "ลิ่มรสชาติโปรดของคนรักชาและกาแฟที่แท้ทรู"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=2071",
            title: "จิบความสุขในแบบของคุณ",
            subtitle: "ไม่ว่าจะชาใสหรือกาแฟเข้ม เรามีเครื่องดื่มที่ใช่สำหรับทุกคน"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1536227661368-deef57acf708?q=80&w=2070",
            title: "เติมพลังง่ายๆ ด้วยกาแฟแก้วโปรด",
            subtitle: "กาแฟที่ตอบโจทย์ทุกอารมณ์และไลฟ์สไตล์ของคุณ"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1510586909270-7b3ba37fd565?q=80&w=2070",
            title: "หอม เข้ม กลมกล่อม ในทุกแก้ว",
            subtitle: "จากเมล็ดกาแฟและใบชาคัดสรร สู่แก้วโปรดของคุณ"

        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1558416165-5fb04b79b0e7?q=80&w=2071",
            title: "ความสุขที่ชงมาเพื่อคุณ",
            subtitle: "ชาหรือกาแฟ ทุกแก้วถูกชงด้วยความตั้งใจเพื่อรอยยิ้มของคุณ"

        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1421622548261-c45bfe178854?q=80&w=2069",
            title: "สดชื่นในทุกจังหวะชีวิต",
            subtitle: "จากชาใสถึงกาแฟเข้ม เรามีครบทุกความสดชื่นที่คุณต้องการ"

        },
    ];

    return (
        <div className="swiper-container h-[600px] relative overflow-hidden">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                effect={"fade"}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper h-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full slide-content">
                            <img 
                                src={slide.image} 
                                alt={slide.title} 
                                className="object-cover w-full h-full brightness-75"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center slide-overlay bg-black/30">
                                <h2 className="px-4 mb-4 text-4xl font-bold text-white transition-all duration-500 ease-in-out transform md:text-5xl hover:scale-105">
                                    {slide.title}
                                </h2>
                                <p className="px-4 text-lg text-white/90 md:text-xl slide-subtitle max-w-2xl">
                                    {slide.subtitle}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="absolute bottom-4 right-4 z-10 autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle} className="w-12 h-12">
                        <circle cx="24" cy="24" r="20" className="stroke-white/50 fill-none"></circle>
                    </svg>
                    <span ref={progressContent} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"></span>
                </div>
            </Swiper>
        </div>
    );
}
