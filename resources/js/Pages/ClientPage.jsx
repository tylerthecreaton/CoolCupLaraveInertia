
import MainContent from "@/Components/clientpage/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";
import React from "react";

export default function ClientPage() {
    return (
        <StorefrontLayout>
            <main className="flex">
                <div className="relative flex-1">
                    <Head title="ClientPage" />
                    <MainContent />
                </div>
            </main>
        </StorefrontLayout>
    );
}
