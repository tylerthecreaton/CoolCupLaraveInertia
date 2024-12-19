import React, { useState, useEffect } from "react";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { Button } from "flowbite-react";
import { ShoppingCart } from "lucide-react";

export default function HeaderPanel() {
    const { state, dispatch } = useGlobalState();
    const { totalItems } = state.cart;
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <div className="flex justify-between bg-blue-300 min-h-24">
            <div className="py-10 text-4xl font-bold text-black ms-8">
                สมัครสมาชิก
            </div>
            <div className="flex items-center space-x-6 py-10 mr-8">
                <div className="text-black">
                    <ul>
                        <li>ผู้ใช้ : </li>
                        <li id="current-time">
                            เวลา : <span id="time">{time}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
