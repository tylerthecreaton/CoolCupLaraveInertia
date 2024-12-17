import { Button, FileInput, Label, TextInput } from "flowbite-react";
export default function CategoriesForm() {
    return (
        <div className="container px-4 py-8 mx-auto mt-5 bg-white rounded-md sm:px-8">
            <form className="flex flex-col gap-4 mx-auto max-w-md">
                <div>
                    <div className="block mb-2">
                        <Label htmlFor="name" value="ชื่อหมวดหมู่" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        placeholder="กรุณากรอกชื่อหมวดหมู่"
                        required
                    />
                </div>
                <div>
                    <div>
                        <Label
                            htmlFor="image"
                            value="อัพโหลดรูปภาพ"
                        />
                    </div>
                    <FileInput
                        id="image"
                        helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
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
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}
