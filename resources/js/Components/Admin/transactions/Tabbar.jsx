import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Tabbar() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    ประวัติการเคลื่อนไหวของวัตถุดิบ
                </h2>
            }
        >
            <Head title="ประวัติการเคลื่อนไหวของวัตถุดิบ" />

        </AuthenticatedLayout>
    );
}
