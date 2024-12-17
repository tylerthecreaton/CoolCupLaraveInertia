import { Button, Tabs } from "flowbite-react";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import AddMenuModal from "./AddMenuModal";
import ProductListing from "./ProductListing";
export default function CategorySection({ products, categories }) {
    const [showAddMenuModal, setShowAddMenuModal] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabClick = (index) => {
        setCurrentTab(index);
    };

    return (
        <>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 ">
                <div className="relative w-full">
                    <Tabs aria-label="Default tabs" variant="default">
                        <Tabs.Item
                            active={currentTab === 0}
                            title="สินค้าขายดี"
                            icon={HiUserCircle}
                        >
                            <ProductListing products={products} />
                        </Tabs.Item>
                        {categories.map((category) => (
                            <Tabs.Item
                                key={category.id}
                                active={currentTab === category.id}
                                title={category.name}
                                icon={HiUserCircle}
                                onClick={() => handleTabClick(category.id)}
                            >
                                <ProductListing
                                    products={category.products}
                                    setShowSaleModal={setShowAddMenuModal}
                                />
                            </Tabs.Item>
                        ))}
                    </Tabs>
                    <Button
                        type="button"
                        className="absolute top-2 right-0"
                        onClick={() => setShowAddMenuModal(true)}
                    >
                        เพิ่มเมนู
                    </Button>
                </div>
            </div>
            <AddMenuModal
                categories={categories}
                show={showAddMenuModal}
                onClose={() => setShowAddMenuModal(false)}
            />
        </>
    );
}
