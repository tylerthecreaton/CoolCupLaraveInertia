import React from "react";
import StorefrontLayout from "../Layouts/StorefrontLayout";
import HeaderPanel from "@/Components/Promotion/HeaderPanel";
import SidebarMenu from "@/Components/home/SidebarMenu";
import MainContent from "@/Components/RegisterMember/MainContent";
import { Head } from "@inertiajs/react";


export default function index() {
    return (
        <StorefrontLayout>
            <main>
                <div className="flex">
                    <SidebarMenu />
                    <div className="relative flex-1">
                        <HeaderPanel />
                        <Head title="Promotions" />
                    </div>
                </div>
            </main>
        </StorefrontLayout>
    );
}
