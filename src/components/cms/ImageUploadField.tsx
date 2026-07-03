import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { IMAGE_ACCEPT } from '@/utils/cms'

interface ImageUploadFieldProps {
  label?: string
  imageUrl: string | null
  altText: string
  onAltChange: (value: string) => void
  onFileSelect: (file: File) => void
  previewClassName?: string
  altPlaceholder?: string
}

export function ImageUploadField({
  label = 'Image',
  imageUrl,
  altText,
  onAltChange,
  onFileSelect,
  previewClassName = 'h-32',
  altPlaceholder = 'Describe the image for accessibility',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
          e.target.value = ''
        }}
      />
      <div className="flex w-48 shrink-0 flex-col gap-2">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <div
          className={`flex w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 ${previewClassName}`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || label}
              className="max-h-full max-w-full object-contain p-2"
            />
          ) : (
            <span className="text-sm text-slate-400">No image available</span>
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          Change Image
        </Button>
      </div>
      <div className="flex-1">
        <Input
          label="Alt text"
          value={altText}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder={altPlaceholder}
        />
      </div>
    </div>
  )
}
