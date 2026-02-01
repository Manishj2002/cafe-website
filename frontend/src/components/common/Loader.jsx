// src/components/common/Loader.jsx - Tailwind Styled
const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-50">
        <div className="spinner"></div>
        <p className="mt-4 text-primary text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-8">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;