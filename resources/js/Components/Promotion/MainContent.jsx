
export default function MainContent() {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      
      <div className="border rounded-lg shadow-md w-64 h-40 flex flex-col justify-center items-center bg-white">
        <h3 className="text-lg font-bold">ฟรี 1 แก้ว</h3>
        <p className="text-sm text-gray-600">ทางร้านเป็นคนบอกว่าฟรีเมนูไหนได้บ้าง</p>
      </div>
      
      <div className="border rounded-lg shadow-md w-64 h-40 flex flex-col justify-center items-center bg-white">
        <h3 className="text-lg font-bold">ลด 25%</h3>
        <p className="text-sm text-gray-600">ทางร้านเป็นคนบอกว่าลดเมนูไหนได้บ้าง</p>
      </div>
      <div className="p-6">
      {/* ปุ่มเพิ่มโปรโมชั่น */}
      <div className="flex justify-end mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          เพิ่มโปรโมชั่น
        </button>
      </div>
    </div>
    </div>



  );
}
