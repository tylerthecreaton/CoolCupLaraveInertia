import HeaderPanel from "@/Components/home/HeaderPanel";
import MainContent from "@/Components/home/MainContent";
import SidebarMenu from "@/Components/home/SidebarMenu";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";

export default function Home({ categories, products }) {
    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="w-full">
                    <HeaderPanel />
                    <Head title="หน้าขาย" />
                    <MainContent products={products} categories={categories} />
                </div>
            </main>
        </StorefrontLayout>
    );
}
