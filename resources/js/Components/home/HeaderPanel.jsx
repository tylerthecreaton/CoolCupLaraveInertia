import React, { useState, useEffect } from "react";

export default function HeaderPanel() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);
    return (
        <div className="flex justify-between bg-blue-300 min-h-24">
            <div className="py-10 text-4xl font-bold text-black ms-8">
                หน้าขาย
            </div>
            <div className="py-10 mr-8 text-black ms-5">
                <ul>
                    <li>ผู้ใช้ : </li>
                    <li id="current-time">
                        เวลา : <span id="time">{time}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
