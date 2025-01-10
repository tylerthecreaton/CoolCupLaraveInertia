import React from "react";
import MainContent from "@/Components/clientpage/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";

export default function ClientPage() {
    return (
        <StorefrontLayout>
            <Head title="ClientPage" />
            <div className="client-page">
                <MainContent />
                <section className="featured-section">
                    <div className="container px-4 py-12 mx-auto">
                        <h2 className="mb-8 text-3xl font-semibold text-center">ยินดีต้อนรับสู่ร้าน CoolCup</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="feature-card">
                                <h3 className="mb-2 text-xl font-semibold">ทุกแก้วคือความสดชื่น</h3>
                                <p className="text-gray-600">เติมเต็มทุกช่วงเวลา ด้วยชาแก้วโปรดของคุณ</p>
                            </div>
                            <div className="feature-card">
                                <h3 className="mb-2 text-xl font-semibold">ดื่มด่ำทุกหยดแห่งความสุข</h3>
                                <p className="text-gray-600">เพราะทุกแก้วคือความใส่ใจ ลองแล้วคุณจะหลงรัก</p>
                            </div>
                            <div className="feature-card">
                                <h3 className="mb-2 text-xl font-semibold">เปิดประสบการณ์ชาในแบบคุณ</h3>
                                <p className="text-gray-600">เพราะความสดชื่นไม่มีที่สิ้นสุด เมนูใหม่นี่แหละคือคำตอบ</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </StorefrontLayout>
    );
}
