

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-700">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
    );
}