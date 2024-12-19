import HeaderPanel from "@/Components/RegisterMember/HeaderPanel";
import MainContent from "@/Components/RegisterMember/MainContent";
import SidebarMenu from "@/Components/home/SidebarMenu";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";
import React from "react";
export default function RegisterMember() {
    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="flex-1 relative">
                    <HeaderPanel />
                    <Head title="Register Member" />
                    <MainContent />
                </div>
            </main>
        </StorefrontLayout>
    );
}
