import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import "/resources/css/styles.css";

// import required modules
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

export default function App() {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty("--progress", 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000",
            title: "Coffee Experience",
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1000",
            title: "Fresh Beans",
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?q=80&w=1000",
            title: "Perfect Brew",
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000",
            title: "Coffee Shop",
        },
    ];

    return (
        <div className="swiper-container">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                effect={"fade"}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="slide-content">
                            <img src={slide.image} alt={slide.title} />
                            <div className="slide-overlay">
                                <h2>{slide.title}</h2>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                <div className="autoplay-progress" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>
        </div>
    );
}
