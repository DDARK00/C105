const ApiSpecTableSkeleton = ({ columnWidths, rows = 5 }) => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {Object.keys(columnWidths)?.map((column) => (
                <th
                  key={column}
                  className="p-2 bg-gray-200 animate-pulse"
                  style={{ width: columnWidths[column] }}
                >
                  &nbsp; {/* 빈 공간을 유지하기 위한 placeholder */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.keys(columnWidths).map((key) => (
                  <td
                    key={key}
                    className="p-2 bg-gray-100 animate-pulse"
                    style={{ width: columnWidths[key] }}
                  >
                    <div className="h-4 w-full rounded bg-gray-300"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiSpecTableSkeleton;
