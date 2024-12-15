export default function StorefrontLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="px-2 my-2 w-full">{children}</div>
        </div>
    );
}
