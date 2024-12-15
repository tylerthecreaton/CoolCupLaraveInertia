import StorefrontLayout from "@/Layouts/StorefrontLayout";
import SidebarMenu from "@/Components/home/SidebarMenu";
import HeaderPanel from "@/Components/home/HeaderPanel";
import MainContent from "@/Components/home/MainContent";

export default function Home({ categories }) {
    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="w-full">
                    <HeaderPanel />
                    <MainContent categories={categories} />
                </div>
            </main>
        </StorefrontLayout>
    );
}
