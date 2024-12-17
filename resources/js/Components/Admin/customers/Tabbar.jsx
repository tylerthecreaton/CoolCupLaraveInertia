import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Tabbar() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการสมาชิก
                </h2>
            }
        >
            <Head title="จัดการสมาชิก" />

        </AuthenticatedLayout>
    );
}
