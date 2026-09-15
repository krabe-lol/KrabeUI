import type { ReactNode } from "react"

function StoryPage({
  title,
  description,
  importCode,
  children,
}: {
  title: string
  description: string
  importCode: string
  children?: ReactNode
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Import</h2>
        <pre className="rounded-md bg-muted p-4 text-sm">
          <code>{importCode}</code>
        </pre>
      </div>
      {children}
    </div>
  )
}

export { StoryPage }
