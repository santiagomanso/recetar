"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    const success = login(username, password)
    
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Credenciales incorrectas. Usa: basura / cocacola")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Usuario
        </Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          className="h-12 transition-all duration-300 focus:scale-[1.02]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Contrasena
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contrasena"
            className="h-12 pr-12 transition-all duration-300 focus:scale-[1.02]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Ingresando...
          </>
        ) : (
          "Iniciar sesion"
        )}
      </Button>

      <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4">
        <p className="text-center text-xs text-muted-foreground">
          <span className="font-medium">Credenciales de prueba:</span>
          <br />
          Usuario: <code className="rounded bg-background px-1.5 py-0.5 font-mono">basura</code>
          <br />
          Contrasena: <code className="rounded bg-background px-1.5 py-0.5 font-mono">cocacola</code>
        </p>
      </div>
    </form>
  )
}
