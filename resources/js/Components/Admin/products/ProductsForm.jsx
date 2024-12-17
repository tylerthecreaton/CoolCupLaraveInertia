import { useForm } from "@inertiajs/react";
import { Button, FileInput, Label, TextInput } from "flowbite-react";
export default function ProductsForm({ product, categories }) {
    const isEditing = !!product;
    const { data, setData, post, processing, errors } = useForm({
        name: isEditing ? product.name : "",
        image: null,
        description: isEditing ? product.description : "",
        cost_price: isEditing ? product.cost_price : "",
        sale_price: isEditing ? product.sale_price : "",
        category: isEditing ? product.category : "",
    });

    const handleFileChange = (e) => {
        setData("image", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            isEditing
                ? route("admin.products.update", product.id)
                : route("admin.products.store"),
            data,
            {
                forceFormData: true,
            }
        );
    };
    return (
        <div className="container px-4 py-8 mx-auto mt-5 bg-white rounded-md sm:px-8">
            <form
                className="flex flex-col gap-4 mx-auto max-w-md"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="name" value="ชื่อสินค้า" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="กรุณากรอกชื่อสินค้า"
                        required
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="category" value="หมวดหมู่" />
                    </div>
                    <select
                        id="category"
                        className="block px-4 py-2 w-full text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                        value={data.category}
                        onChange={(e) => setData("category", e.target.value)}
                    >
                        <option value="" disabled hidden>
                            กรุณาเลือกหมวดหมู่
                        </option>
                        <option value="tea">ชา</option>
                        <option value="cofee">กาแฟ</option>
                        <option value="topping">ท็อปปิ้ง</option>
                    </select>
                </div>
                <div>
                    <div>
                        <Label htmlFor="image" value="อัพโหลดรูปภาพ" />
                    </div>
                    <FileInput
                        id="image"
                        helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <div>
                        <Label htmlFor="cost_price" value="ราคาต้นทุน" />
                    </div>
                    <TextInput
                        id="cost_price"
                        type="text"
                        placeholder="กรุณากรอกราคาต้นทุน"
                        required
                        value={data.cost_price}
                        onChange={(e) => setData("cost_price", e.target.value)}
                    />
                    <div>
                        <Label htmlFor="sale_price" value="ราคาขาย" />
                    </div>
                    <TextInput
                        id="sale_price"
                        type="text"
                        placeholder="กรุณากรอกราคาขาย"
                        required
                        value={data.sale_price}
                        onChange={(e) => setData("sale_price", e.target.value)}
                    />
                </div>
                <div>
                    <div className="block mb-2">
                        <Label
                            htmlFor="description"
                            value="คําอธิบายหมวดหมู่"
                        />
                    </div>
                    <TextInput
                        id="description"
                        type="text"
                        placeholder="กรุณากรอกคำอธิบายหมวดหมู่"
                        required
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
