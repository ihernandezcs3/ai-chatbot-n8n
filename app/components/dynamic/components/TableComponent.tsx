"use client";

interface TableComponentProps {
  headers: string[];
  rows: string[][];
  className?: string;
}

export function TableComponent({
  headers,
  rows,
  className = "",
}: TableComponentProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, index) => (
              <th
                key={index}
                className="border border-gray-200 px-4 py-2 text-left text-sm font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-200 px-4 py-2 text-sm"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
