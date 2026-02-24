export default function Legend() {
  return (
    <div className="flex flex-wrap gap-4 px-4 pb-1 pt-4 md:px-8">
      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
        <div className="w-2.5 h-2.5 rounded-sm bg-soak-border" />
        Soak tonight (overnight)
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
        <div className="w-2.5 h-2.5 rounded-sm bg-stock-border" />
        Check stock / order ahead
      </div>
    </div>
  );
}
