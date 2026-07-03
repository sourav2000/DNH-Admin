import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ReorderableListActions } from '@/components/cms/ReorderableListActions'
import { moveItem } from '@/utils/cms'

interface StringListProps {
  title: string
  description: string
  items: string[]
  onChange: (items: string[]) => void
  addLabel: string
  itemLabel?: string
  placeholder?: string
}

export function StringList({
  title,
  description,
  items,
  onChange,
  addLabel,
  itemLabel = 'Item',
  placeholder = 'Enter value',
}: StringListProps) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No items configured.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {itemLabel} {index + 1}
                </span>
                <ReorderableListActions
                  index={index}
                  total={items.length}
                  onMoveUp={() => onChange(moveItem(items, index, 'up'))}
                  onMoveDown={() => onChange(moveItem(items, index, 'down'))}
                  onRemove={() => onChange(items.filter((_, i) => i !== index))}
                />
              </div>
              <Input
                label="Value"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={placeholder}
              />
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="secondary" onClick={() => onChange([...items, ''])}>
        {addLabel}
      </Button>
    </div>
  )
}
