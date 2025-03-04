import HeaderPanel from "@/Components/RegisterMember/HeaderPanel";
import MainContent from "@/Components/RegisterMember/MainContent";
import SidebarMenu from "@/Components/home/SidebarMenu";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

export default function RegisterMember() {
    const { errors } = usePage().props;
    
    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="relative flex-1">
                    <HeaderPanel />
                    <Head title="Register Member" />
                    <MainContent errors={errors} />
                </div>
            </main>
        </StorefrontLayout>
    );
}
