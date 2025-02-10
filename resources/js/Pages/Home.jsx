import { useEffect } from "react";
import CartComponent from "@/Components/home/CartComponent";
import HeaderPanel from "@/Components/home/HeaderPanel";
import MainContent from "@/Components/home/MainContent";
import SidebarMenu from "@/Components/home/SidebarMenu";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { Transition } from "@headlessui/react";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Home({ categories, products }) {
    const { state, dispatch } = useGlobalState();
    const { isCartOpen } = state.app;



    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await axios.get("/api/settings");
                dispatch(appActions.setGlobalSettings(response.data));
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        }
        fetchSettings();
    }, []);

    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="flex-1 relative">
                    <HeaderPanel />
                    <Head title="หน้าขาย" />
                    <MainContent products={products} categories={categories} />
                    <Transition
                        show={isCartOpen}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-full"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-300"
                        leaveFrom="opacity-100 translate-x-0"
                        leaveTo="opacity-0 translate-x-full"
                    >
                        <div>
                            <CartComponent />
                        </div>
                    </Transition>
                </div>
            </main>
        </StorefrontLayout>
    );
}
