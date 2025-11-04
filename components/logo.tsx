import { Layers } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">
        <Layers className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold">TaskFlow</span>
    </div>
  )
}
