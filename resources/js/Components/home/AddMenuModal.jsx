import React from "react";
import { Button, Modal } from "flowbite-react";
export default function AddMenuModal({ categories, show, onClose }) {
    const [state, setState] = React.useState({
        name: "",
        category: "",
        image: "",
        cost_price: 0,
        sale_price: 0,
        image: null,
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setState({
            ...state,
            image: e.target.files[0],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(state);
    };

    return (
        <Modal id="crud-modal" show={show} onClose={onClose}>
            <Modal.Header>เพิ่มเมนูใหม่</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                ชื่อสินค้า
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={state.name}
                                onChange={handleChange}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="กรอกชื่อสินค้า"
                                required
                            />
                        </div>
                        {/* Category */}
                        <div className="col-span-2">
                            <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                หมวดหมู่
                            </label>
                            <select
                                value={state.category}
                                onChange={handleChange}
                                name="category"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                            >
                                <option selected>เลือกหมวดหมู่</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Image Upload */}
                        <div className="col-span-2">
                            <label
                                htmlFor="image"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                รูปภาพ
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                name="image"
                                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                ราคาต้นทุน
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={state.cost_price}
                                onChange={handleChange}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="กรอกราคาต้นทุน"
                                required
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                ราคาขาย
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={state.sale_price}
                                onChange={handleChange}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
                                placeholder="กรอกราคาขาย"
                                required
                            />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button color="failure" onClick={() => console.log("close")}>
                    ปิด
                </Button>
                <Button type="submit" color="success">
                    บันทึก
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
