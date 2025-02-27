import HeaderPanel from "@/Components/Member/HeaderPanel";
import MainContent from "@/Components/Member/MainContent";
import SidebarMenu from "@/Components/home/SidebarMenu";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";

export default function Member({ customer }) {
    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="flex-1 relative">
                    <HeaderPanel />
                    <Head title="Member" />
                    <MainContent customer={customer} />
                </div>
            </main>
        </StorefrontLayout>
    );
}
