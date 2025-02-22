import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import ExpenseForm from "./ExpenseForm";

export default function Create({ expenseCategories, errors }) {
    return (
        <AuthenticatedLayout>
            <Head title="Create Expense" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item href="/admin/dashboard" icon={HiHome}>
                            หน้าแรก
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/admin/expenses">
                            ค่าใช้จ่าย
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>เพิ่มค่าใช้จ่าย</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-semibold mb-4">
                                เพิ่มค่าใช้จ่าย
                            </h1>
                            <ExpenseForm
                                expenseCategories={expenseCategories}
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
