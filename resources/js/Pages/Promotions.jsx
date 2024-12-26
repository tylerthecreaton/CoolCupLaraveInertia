import SidebarMenu from "@/Components/home/SidebarMenu";
import HeaderPanel from "@/Components/Promotion/HeaderPanel";
import MainContent from "@/Components/Promotion/MainContent";
import { Head } from "@inertiajs/react";
import StorefrontLayout from "../Layouts/StorefrontLayout";

export default function index() {
    return (
        <StorefrontLayout>
            <main>
                <div className="flex">
                    <SidebarMenu />
                    <div className="relative flex-1">
                        <HeaderPanel />
                        <Head title="Promotions" />
                        <div className="p-6">
              <MainContent />
              </div>
                    </div>
                </div>
            </main>
        </StorefrontLayout>
    );
}




