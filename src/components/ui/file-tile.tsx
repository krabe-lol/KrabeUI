import * as React from "react"
import { File, FileImage, FileText } from "lucide-react"
import { cn } from "cn"

// KrabeUI's own file tiles (shadcn has none): small cards for documents or
// other files, laid out side by side by `FileTileGrid`. Each tile shows an
// icon (or an image preview), the file name and an optional meta line; the
// whole tile opens `href`. `actions` sit in the top-right corner and stay
// clickable on their own.

type FileTileKind = "pdf" | "image" | "file"

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp", "heic"]

/** Kind of a file by the extension of its name: `pdf`, `image` or `file`. */
function fileTileKind(name: string): FileTileKind {
  const extension = /\.([^./]+)$/.exec(name)?.[1]?.toLowerCase()
  if (extension === "pdf") return "pdf"
  if (extension && IMAGE_EXTENSIONS.includes(extension)) return "image"
  return "file"
}

const KIND_ICONS: Record<FileTileKind, React.ElementType> = {
  pdf: FileText,
  image: FileImage,
  file: File,
}

function FileTileGrid({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="file-tile-grid"
      className={cn("grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-3", className)}
      {...props}
    />
  )
}

type FileTileProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** File name, shown on up to two lines. Its extension picks the icon unless `kind` is set. */
  name: string
  /** Opens the file; the whole tile is the link. Without it the tile is not clickable. */
  href?: string
  /** Link target, e.g. `"_blank"` (then `rel="noreferrer"` is set). */
  target?: React.HTMLAttributeAnchorTarget
  /** Second line below the name, e.g. type and size ("PDF · 1.2 MB"). */
  meta?: React.ReactNode
  /** Overrides the kind derived from the extension of `name`. */
  kind?: FileTileKind
  /** Image URL shown instead of the icon, e.g. for image files. */
  preview?: string
  /** Shown in the top-right corner, e.g. a `DropdownMenu` with "Rename" and "Delete". */
  actions?: React.ReactNode
}

function FileTile({
  className,
  name,
  href,
  target,
  meta,
  kind: kindProp,
  preview,
  actions,
  ...props
}: FileTileProps) {
  const kind = kindProp ?? fileTileKind(name)
  const Icon = KIND_ICONS[kind]

  return (
    <li
      data-slot="file-tile"
      data-kind={kind}
      className={cn(
        "relative flex min-w-0 flex-col gap-2 rounded-lg bg-card p-2 text-sm text-card-foreground ring-1 ring-foreground/10 transition-colors has-[a:hover]:bg-muted/50 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50",
        className
      )}
      {...props}
    >
      <div
        data-slot="file-tile-preview"
        className="flex h-20 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground"
      >
        {preview ? (
          <img src={preview} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 px-1 pb-0.5">
        {href ? (
          <a
            data-slot="file-tile-name"
            href={href}
            target={target}
            rel={target === "_blank" ? "noreferrer" : undefined}
            title={name}
            className="line-clamp-2 font-medium wrap-break-word outline-none after:absolute after:inset-0 after:rounded-lg"
          >
            {name}
          </a>
        ) : (
          <span data-slot="file-tile-name" title={name} className="line-clamp-2 font-medium wrap-break-word">
            {name}
          </span>
        )}
        {meta && (
          <span data-slot="file-tile-meta" className="truncate text-xs text-muted-foreground">
            {meta}
          </span>
        )}
      </div>
      {actions && (
        <div data-slot="file-tile-actions" className="absolute top-3 right-3 z-10 flex gap-1">
          {actions}
        </div>
      )}
    </li>
  )
}

export { FileTile, FileTileGrid }
export type { FileTileKind, FileTileProps }
