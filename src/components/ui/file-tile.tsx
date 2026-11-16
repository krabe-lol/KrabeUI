import * as React from "react"
import {
  Download,
  File,
  FileArchive,
  FileChartPie,
  FileImage,
  FileMusic,
  FilePlay,
  FileSpreadsheet,
  FileText,
  FileType,
} from "lucide-react"
import { cn } from "cn"

import { buttonVariants } from "@/components/ui/button"

// KrabeUI's own file tiles (shadcn has none): compact landscape cards for
// documents or other files, laid out side by side by `FileTileGrid`. Each tile
// shows a small icon for the file format (or an image preview) on the left,
// the name and an optional meta line in the middle (two lines of text in
// total) and a download button plus optional `actions` on the right. The whole
// tile opens `href`; the buttons stay clickable on their own.

type FileTileKind =
  | "pdf"
  | "image"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "video"
  | "audio"
  | "file"

const KIND_EXTENSIONS: Record<Exclude<FileTileKind, "file">, string[]> = {
  pdf: ["pdf"],
  image: ["png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp", "heic"],
  document: ["doc", "docx", "odt", "rtf", "txt", "md", "pages"],
  spreadsheet: ["xls", "xlsx", "ods", "csv", "numbers"],
  presentation: ["ppt", "pptx", "odp", "key"],
  archive: ["zip", "rar", "7z", "tar", "gz"],
  video: ["mp4", "mov", "webm", "mkv", "avi"],
  audio: ["mp3", "wav", "ogg", "m4a", "flac"],
}

/** Kind of a file by the extension of its name, `file` if it is unknown. */
function fileTileKind(name: string): FileTileKind {
  const extension = /\.([^./]+)$/.exec(name)?.[1]?.toLowerCase()
  if (!extension) return "file"
  for (const [kind, extensions] of Object.entries(KIND_EXTENSIONS)) {
    if (extensions.includes(extension)) return kind as FileTileKind
  }
  return "file"
}

const KIND_ICONS: Record<FileTileKind, React.ElementType> = {
  pdf: FileText,
  image: FileImage,
  document: FileType,
  spreadsheet: FileSpreadsheet,
  presentation: FileChartPie,
  archive: FileArchive,
  video: FilePlay,
  audio: FileMusic,
  file: File,
}

function FileTileGrid({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="file-tile-grid"
      className={cn("grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3", className)}
      {...props}
    />
  )
}

type FileTileProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** File name, shown on one line. Its extension picks the icon unless `kind` is set. */
  name: string
  /** Opens the file; the whole tile is the link. Without it the tile is not clickable and has no download button. */
  href?: string
  /** Link target, e.g. `"_blank"` (then `rel="noreferrer"` is set). */
  target?: React.HTMLAttributeAnchorTarget
  /** Second line below the name, e.g. type and size ("PDF · 1.2 MB"). */
  meta?: React.ReactNode
  /** Overrides the kind derived from the extension of `name`. */
  kind?: FileTileKind
  /** Image URL shown instead of the icon, e.g. for image files. */
  preview?: string
  /**
   * URL of the download button, defaults to `href`. Browsers only download
   * files from the page's own origin; for another domain, point this to a URL
   * that sends `Content-Disposition: attachment`.
   */
  downloadHref?: string
  /** Accessible label of the download button. */
  downloadLabel?: string
  /** Shown on the right after the download button, e.g. a `DropdownMenu` with "Rename" and "Delete". */
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
  downloadHref,
  downloadLabel = "Download",
  actions,
  ...props
}: FileTileProps) {
  const kind = kindProp ?? fileTileKind(name)
  const Icon = KIND_ICONS[kind]
  const nameId = React.useId()
  const downloadUrl = downloadHref ?? href

  return (
    <li
      data-slot="file-tile"
      data-kind={kind}
      className={cn(
        "relative flex min-w-0 items-center gap-3 rounded-lg bg-card p-2 text-sm text-card-foreground ring-1 ring-foreground/10 transition-colors has-[[data-slot=file-tile-name]:hover]:bg-muted/50 has-[[data-slot=file-tile-name]:focus-visible]:ring-3 has-[[data-slot=file-tile-name]:focus-visible]:ring-ring/50",
        className
      )}
      {...props}
    >
      <div
        data-slot="file-tile-preview"
        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground"
      >
        {preview ? (
          <img src={preview} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {href ? (
          <a
            id={nameId}
            data-slot="file-tile-name"
            href={href}
            target={target}
            rel={target === "_blank" ? "noreferrer" : undefined}
            title={name}
            className="truncate font-medium outline-none after:absolute after:inset-0 after:rounded-lg"
          >
            {name}
          </a>
        ) : (
          <span id={nameId} data-slot="file-tile-name" title={name} className="truncate font-medium">
            {name}
          </span>
        )}
        {meta && (
          <span data-slot="file-tile-meta" className="truncate text-xs text-muted-foreground">
            {meta}
          </span>
        )}
      </div>
      {(downloadUrl || actions) && (
        // Above the tile-wide link, so the buttons get their own clicks.
        <div data-slot="file-tile-actions" className="relative z-10 flex shrink-0 items-center gap-1">
          {downloadUrl && (
            <a
              data-slot="file-tile-download"
              href={downloadUrl}
              download
              aria-label={downloadLabel}
              aria-describedby={nameId}
              title={downloadLabel}
              className={buttonVariants({ variant: "ghost", icon: true })}
            >
              <Download aria-hidden="true" />
            </a>
          )}
          {actions}
        </div>
      )}
    </li>
  )
}

export { FileTile, FileTileGrid }
export type { FileTileKind, FileTileProps }
