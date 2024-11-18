function RequirementsTableSkeleton({ columnWidths, rows = 5 }) {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Object.keys(columnWidths)?.map((column) => (
              <th
                key={column}
                className="p-1 bg-gray-200 animate-pulse"
                style={{ width: columnWidths[column] }}
              >
                <div className="h-4 w-3/4 mx-auto rounded bg-gray-300"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Object.keys(columnWidths)?.map((key) => (
                <td
                  key={key}
                  className="p-2 bg-gray-100 animate-pulse"
                  style={{ width: columnWidths[key] }}
                >
                  <div className="h-4 w-3/4 mx-auto rounded bg-gray-300"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RequirementsTableSkeleton;
