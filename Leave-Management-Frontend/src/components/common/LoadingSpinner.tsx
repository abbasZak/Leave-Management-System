export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
};