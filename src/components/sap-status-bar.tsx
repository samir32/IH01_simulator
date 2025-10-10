export function SapStatusBar() {
  return (
    <div className="border-t border-gray-300 bg-gray-50 px-4 py-1 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center gap-4">
        <span>System: PRD</span>
        <span>Client: 100</span>
        <span>User: ADMIN</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Transaction: IH01</span>
        <span>Response Time: 0.234s</span>
        <span className="text-green-600">●</span>
      </div>
    </div>
  );
}