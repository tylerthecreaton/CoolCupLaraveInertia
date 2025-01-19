import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import ExpenseForm from "./ExpenseForm";

export default function Create({ expenseCategories }) {
    return (
        <AuthenticatedLayout>
            <Head title="Create Expense" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item href="/admin/dashboard" icon={HiHome}>
                            Dashboard
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/admin/expenses">
                            Expenses
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Create</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-semibold mb-4">
                                Create Expense
                            </h1>
                            <ExpenseForm
                                expenseCategories={expenseCategories}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
