import { Button, Tabs } from "flowbite-react";
import { useState } from "react";
import { HiUserCircle, HiPlus } from "react-icons/hi";
import PromotionListing from "./PromotionListing";

const typeNameMapping = {
    CATEGORY_DISCOUNT: "ส่วนลดตามหมวดหมู่",
    PERCENTAGE: "ส่วนลดเปอร์เซ็นต์",
    BUY_X_GET_Y: "ซื้อ X แถม Y",
    FIXED: "ส่วนลดแบบตายตัว"
};

export default function CategorySection({ promotions, types, onTypeChange }) {
    const [currentTab, setCurrentTab] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        onTypeChange(tab === 0 ? null : Object.keys(types[tab - 1])[0]);
    };

    const filterPromotionsByType = (typeId) => {
        if (!typeId) return promotions;
        return promotions.filter((promo) => promo.type === typeId);
    };

    return (
        <>
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div className="relative w-full">
                    <Tabs aria-label="Default tabs" variant="default">
                        <Tabs.Item
                            active={currentTab === 0}
                            title="โปรโมชั่นทั้งหมด"
                            icon={HiUserCircle}
                        >
                            <div className="bg-gray-50/50">
                                <PromotionListing
                                    promotions={filterPromotionsByType(null)}
                                />
                            </div>
                        </Tabs.Item>
                        {types?.map((type, index) => {
                            const typeKey = Object.keys(type)[0];
                            const typeValue = typeNameMapping[typeKey] || type[typeKey];
                            return (
                                <Tabs.Item
                                    key={`type-${typeKey}`}
                                    active={currentTab === index + 1}
                                    title={typeValue}
                                    icon={HiUserCircle}
                                    onClick={() => handleTabChange(index + 1)}
                                >
                                    <div className="bg-gray-50/50">
                                        <PromotionListing
                                            promotions={filterPromotionsByType(typeKey)}
                                        />
                                    </div>
                                </Tabs.Item>
                            );
                        })}
                    </Tabs>
                    {/* <Button
                        type="button"
                        className="absolute top-2 right-4"
                        onClick={() => setShowAddModal(true)}
                    >
                        <HiPlus className="mr-2 w-4 h-4" />
                        เพิ่มโปรโมชั่น
                    </Button> */}
                </div>
            </div>
        </>
    );
}
