import React from "react";

function ProjectEssentialEditorSkeleton() {
  return (
    <div className="flex-1 flex justify-center items-center bg-gray-100 py-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        {/* Header */}
        <div className="bg-blue-900 text-white py-6 px-8 rounded-t-lg">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Row 1 */}
            <div className="col-span-1 h-5 bg-gray-200 rounded"></div>
            <div className="col-span-2 h-10 bg-gray-200 rounded"></div>

            {/* Row 2 */}
            <div className="col-span-1 h-5 bg-gray-200 rounded"></div>
            <div className="col-span-2 h-20 bg-gray-200 rounded"></div>

            {/* Dynamic Rows */}
            {[...Array(4)].map((_, index) => (
              <React.Fragment key={index}>
                <div className="col-span-1 h-5 bg-gray-200 rounded"></div>
                <div className="col-span-2 h-10 bg-gray-200 rounded"></div>
              </React.Fragment>
            ))}

            {/* Team Info */}
            <div className="col-span-1 h-5 bg-gray-200 rounded"></div>
            <div className="col-span-2 h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-1 justify-end px-8 mb-8">
          <div className="h-10 bg-red-200 rounded w-40"></div>
        </div>

        <div className="bg-blue-900 text-white p-8"></div>
      </div>
    </div>
  );
}

export default ProjectEssentialEditorSkeleton;
