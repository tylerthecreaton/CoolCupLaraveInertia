import React, { useState } from "react";
import { Button } from "flowbite-react";
import AddMenuModal from "./AddMenuModal";
export default function CategorySection({ categories }) {
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);

    return (
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li className="me-2">
                    <a
                        href="#"
                        className="inline-flex justify-center items-center p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                    >
                        <svg
                            className="w-4 h-4 text-gray-400 me-2 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                        </svg>
                        สินค้าขายดี
                    </a>
                </li>
                {categories.map((category) => (
                    <li className="me-2" key={category.id}>
                        <a
                            href="#"
                            className="inline-flex justify-center items-center p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                        >
                            <svg
                                className="w-4 h-4 text-gray-400 me-2 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            {category.name}
                        </a>
                    </li>
                ))}
            </ul>
            <Button
                type="button"
                color="primary"
                onClick={() => setShowAddMenuModal(true)}
            >
                <div className="mr-5">เพิ่มเมนู</div>
            </Button>
            <AddMenuModal
                categories={categories}
                show={showAddMenuModal}
                onClose={() => setShowAddMenuModal(false)}
            />
        </div>
    );
}
