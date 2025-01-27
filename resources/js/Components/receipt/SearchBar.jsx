import { TextInput } from 'flowbite-react';
import { Search } from "lucide-react";

export default function SearchBar({ searchTerm, onSearchChange }) {
    return (
        <div className="w-full md:w-1/2">
            <form className="flex items-center">
                <TextInput
                    type="text"
                    placeholder="ค้นหาจากเลขที่ใบเสร็จ, ชื่อลูกค้า, วิธีการชำระเงิน"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    icon={Search}
                    className="w-full"
                />
            </form>
        </div>
    );
}
