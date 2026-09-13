import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

function App() {
  const [dark, setDark] = useState(false)
  const [checked, setChecked] = useState(true)

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background p-10 text-foreground">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">KrabeUI playground</h1>
            <Button variant="outline" onClick={() => setDark((v) => !v)}>
              Toggle {dark ? "light" : "dark"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buttons &amp; badges</CardTitle>
              <CardDescription>Variant sweep</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="tos" checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
                <Label htmlFor="tos">Accept terms</Label>
              </div>
              <div className="grid gap-1.5">
                <Label>Framework</Label>
                <Select defaultValue="react">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Pick one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm</DialogTitle>
                    <DialogDescription>This is a KrabeUI dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter showCloseButton>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Button</TableCell>
                    <TableCell><Badge>Ready</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Table</TableCell>
                    <TableCell><Badge variant="secondary">Ready</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
