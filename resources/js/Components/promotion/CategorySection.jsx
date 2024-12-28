import { Button, Tabs } from "flowbite-react";
import { useState } from "react";
import { HiUserCircle, HiPlus } from "react-icons/hi";
import PromotionListing from "./PromotionListing";

export default function CategorySection({ promotions, types, onTypeChange }) {
    const [currentTab, setCurrentTab] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleTabClick = (index) => {
        setCurrentTab(index);
        onTypeChange(index === 0 ? null : Object.keys(types[index - 1])[0]);
    };

    const filterPromotionsByType = (typeId) => {
        console.log(typeId);
        console.log(promotions);

        if (!typeId) return promotions;
        return promotions.filter((promo) => promo.type === typeId);
    };

    return (
        <>
            <div className="flex justify-between items-center bg-white border-b border-gray-200 dark:border-gray-700">
                <div className="relative w-full">
                    <Tabs aria-label="Default tabs" variant="default">
                        <Tabs.Item
                            key="all-promotions"
                            active={currentTab === 0}
                            title="โปรโมชั่นทั้งหมด"
                            icon={HiUserCircle}
                            onClick={() => handleTabClick(0)}
                        >
                            <div key="all-promotions-content">
                                <PromotionListing
                                    promotions={filterPromotionsByType(null)}
                                />
                            </div>
                        </Tabs.Item>
                        {types?.map((type, index) => {
                            const typeKey = Object.keys(type)[0];
                            const typeValue = type[typeKey];
                            return (
                                <Tabs.Item
                                    key={`type-${typeKey}`}
                                    active={currentTab === index + 1}
                                    title={typeValue}
                                    icon={HiUserCircle}
                                    onClick={() => handleTabClick(index + 1)}
                                >
                                    <div key={`type-${typeKey}-content`}>
                                        <PromotionListing
                                            promotions={filterPromotionsByType(
                                                typeKey
                                            )}
                                        />
                                    </div>
                                </Tabs.Item>
                            );
                        })}
                    </Tabs>
                    <Button
                        type="button"
                        size="sm"
                        className="absolute top-2 right-4 bg-purple-600 hover:bg-purple-700"
                        onClick={() => setShowAddModal(true)}
                    >
                        <HiPlus className="mr-2 w-4 h-4" />
                        เพิ่มโปรโมชั่น
                    </Button>
                </div>
            </div>
        </>
    );
}
