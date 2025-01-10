import React from "react";
import ReactDOM from "react-dom";
import MainContent from "@/Components/clientpage/MainContent";
import StorefrontLayout from "@/Layouts/StorefrontLayout";
import { Head } from "@inertiajs/react";

ReactDOM.render(<MainContent />, document.getElementById("app"));
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
