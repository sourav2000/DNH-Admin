interface ReorderableListActionsProps {
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export function ReorderableListActions({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
}: ReorderableListActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Move down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  )
}
