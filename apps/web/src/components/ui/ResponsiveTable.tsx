import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  render: (item: any) => ReactNode;
  hideOnMobile?: boolean;
}

interface Props {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

export default function ResponsiveTable({ columns, data, emptyMessage = 'No data' }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-secondary-200 text-secondary-500">
        {emptyMessage}
      </div>
    );
  }

  // Pick first visible column as card title on mobile
  const titleColumn = columns.find(c => !c.hideOnMobile) || columns[0];

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-secondary-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-100">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-secondary-50 hover:bg-secondary-50/50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-sm text-secondary-900">
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-secondary-100 overflow-hidden shadow-sm">
            {/* Card title (first non-hidden column) */}
            <div className="px-4 py-3 bg-secondary-50/50 border-b border-secondary-100">
              <div className="text-sm font-semibold text-secondary-900">
                {titleColumn.render(item)}
              </div>
            </div>

            {/* Remaining columns (except title and hidden) */}
            <div className="px-4 py-2 divide-y divide-secondary-50">
              {columns
                .filter(c => !c.hideOnMobile && c.key !== titleColumn.key)
                .map(col => (
                  <div key={col.key} className="flex items-center justify-between py-2.5">
                    <span className="text-xs font-medium text-secondary-400 uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="text-sm text-secondary-900 text-right ml-3">
                      {col.render(item)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}