import CartComponent from "@/Components/home/CartComponent";
import HeaderPanel from "@/Components/promotion/HeaderPanel";
import MainContent from "@/Components/promotion/MainContent";
import SidebarMenu from "@/Components/home/SidebarMenu";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { useGlobalState } from "@/Store/state";
import { Transition } from "@headlessui/react";
import { Head } from "@inertiajs/react";

export default function Promotion({ promotions, types }) {
    const { state } = useGlobalState();
    const { isCartOpen } = state.app;

    return (
        <StorefrontLayout>
            <main className="flex">
                <SidebarMenu />
                <div className="flex-1 relative">
                    <HeaderPanel />
                    <Head title="โปรโมชั่น" />
                    <MainContent promotions={promotions} types={types} />
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
