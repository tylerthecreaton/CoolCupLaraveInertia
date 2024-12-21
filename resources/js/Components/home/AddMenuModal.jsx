import { useForm } from "@inertiajs/react";
import { Button, Modal, Label, TextInput, Select, FileInput } from "flowbite-react";

export default function AddMenuModal({ categories, show, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        category_id: "",
        image: null,
        description: "",
        cost_price: "",
        sale_price: "",
    });

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            forceFormData: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <Modal.Header>เพิ่มเมนูใหม่</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="name" value="ชื่อสินค้า" />
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            placeholder="กรุณากรอกชื่อสินค้า"
                            required
                            color={errors.name ? "failure" : undefined}
                            value={data.name}
                            helperText={errors.name && <span>{errors.name}</span>}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="category" value="หมวดหมู่" />
                        </div>
                        <Select
                            id="category"
                            required
                            value={data.category_id}
                            onChange={(e) => setData("category_id", e.target.value)}
                        >
                            <option value="" disabled>กรุณาเลือกหมวดหมู่สินค้า</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                        {errors.category_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="image" value="อัพโหลดรูปภาพ" />
                        </div>
                        <FileInput
                            id="image"
                            helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="cost_price" value="ราคาต้นทุน" />
                        </div>
                        <TextInput
                            id="cost_price"
                            type="number"
                            placeholder="กรุณากรอกราคาต้นทุน"
                            required
                            value={data.cost_price}
                            color={errors.cost_price ? "failure" : undefined}
                            helperText={errors.cost_price && <span>{errors.cost_price}</span>}
                            onChange={(e) => setData("cost_price", e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="sale_price" value="ราคาขาย" />
                        </div>
                        <TextInput
                            id="sale_price"
                            type="number"
                            placeholder="กรุณากรอกราคาขาย"
                            required
                            value={data.sale_price}
                            color={errors.sale_price ? "failure" : undefined}
                            helperText={errors.sale_price && <span>{errors.sale_price}</span>}
                            onChange={(e) => setData("sale_price", e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="block mb-2">
                            <Label htmlFor="description" value="คําอธิบายสินค้า" />
                        </div>
                        <TextInput
                            id="description"
                            type="text"
                            placeholder="กรุณากรอกคำอธิบายสินค้า"
                            required
                            value={data.description}
                            color={errors.description ? "failure" : undefined}
                            helperText={errors.description && <span>{errors.description}</span>}
                            onChange={(e) => setData("description", e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}
