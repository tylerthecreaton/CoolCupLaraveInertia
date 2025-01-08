import SidebarMenu from "@/Components/home/SidebarMenu";
import HeaderPanel from "@/Components/SalesDashboard/HeaderPanel";
import MainContent from "@/Components/SalesDashboard/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

export default function SaleDashboard() {
    const { topProducts, statistics } = usePage().props;

    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="flex-1 relative">
                    <HeaderPanel />
                    <Head title="Sale Dashboard" />
                    <MainContent topProducts={topProducts} statistics={statistics} />
                </div>
            </main>
        </StorefrontLayout>
    )
}
