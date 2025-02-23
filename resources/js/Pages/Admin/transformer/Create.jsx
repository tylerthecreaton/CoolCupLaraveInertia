import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from 'flowbite-react';
import TransformerForm from './Components/TransformerForm';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ auth, ingredients, consumables , errors}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    จัดการสูตรแปรรูป
                </h2>
            }
        >
            <Head title="เพิ่มสูตรแปรรูป" />

            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/transformers">
                        สูตรแปรรูปทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่มสูตรแปรรูป</Breadcrumb.Item>
                </Breadcrumb>

                <AdminLayout>
                    <TransformerForm
                        ingredients={ingredients}
                        consumables={consumables}
                        errors={errors}
                    />
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
