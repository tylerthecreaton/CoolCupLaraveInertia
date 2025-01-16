import React, { useState, useEffect } from "react";
import { useGlobalState } from "@/Store/state";
import { usePage } from "@inertiajs/react";

export default function HeaderPanel() {
    const { state, dispatch } = useGlobalState();
    const { totalItems } = state.cart;
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const user = usePage().props.auth.user;
    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <div className="flex justify-between bg-green-200 min-h-24">
            <div className="py-10 text-4xl font-bold text-black ms-8">
                สมาชิก
            </div>
            <div className="flex items-center py-10 mr-8 space-x-6">
                <div className="text-black">
                    <ul>
                        <li>ผู้ใช้ : {user.name}</li>
                        <li id="current-time">
                            เวลา : <span id="time">{time}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
