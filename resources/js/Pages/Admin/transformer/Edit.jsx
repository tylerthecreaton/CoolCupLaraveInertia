import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TransformerForm from './Components/TransformerForm';
import { Breadcrumb } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ auth, transformer, ingredients, consumables }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    แก้ไขสูตรแปรรูป {transformer.name}
                </h2>
            }
        >
            <Head title="แก้ไขสูตรแปรรูป" />

            <div className="container px-2 py-3 mx-auto mt-5 sm:px-8">
                <Breadcrumb aria-label="Default breadcrumb example">
                    <Breadcrumb.Item href="/dashboard" icon={HiHome}>
                        หน้าแรก
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/transformers">
                        สูตรแปรรูปทั้งหมด
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไขสูตรแปรรูป</Breadcrumb.Item>
                </Breadcrumb>

                <AdminLayout>
                    <TransformerForm
                        transformer={transformer}
                        ingredients={ingredients}
                        consumables={consumables}
                        isEditing={true}
                    />
                </AdminLayout>
            </div>
        </AuthenticatedLayout>
    );
}
