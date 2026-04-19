"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/app/(auth)/login/_hooks/use-login-form";

interface LoginFormProps {
  authHint?: "credentials" | "google";
  urlError?: string;
}

function GoogleIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
        fill='#FBBC05'
      />
      <path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
    </svg>
  );
}

export function LoginForm({ authHint, urlError }: LoginFormProps) {
  const { form, onSubmit, isSubmitting, errors, serverError } =
    useLoginForm(urlError);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const popupRef = useRef<Window | null>(null);

  const handleGoogleSignIn = () => {
    const url = "/auth/google-start";
    const popup = window.open(
      url,
      "google-signin",
      "width=500,height=600,left=" +
        (window.screenX + (window.outerWidth - 500) / 2) +
        ",top=" +
        (window.screenY + (window.outerHeight - 600) / 2)
    );
    popupRef.current = popup;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
        window.removeEventListener("message", handleMessage);
        router.push("/dashboard");
        router.refresh();
      } else if (event.data?.type === "GOOGLE_AUTH_ERROR") {
        window.removeEventListener("message", handleMessage);
        toast.error(
          "Este correo está vinculado a una cuenta con contraseña. Iniciá sesión con tu correo y contraseña.",
          { duration: 6000 }
        );
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup if popup is closed without sending a message
    const interval = setInterval(() => {
      if (popup?.closed) {
        clearInterval(interval);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  };

  return (
    <div className='space-y-3'>
      {serverError && (
        <div className='flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2 duration-300'>
          <AlertCircle className='h-4 w-4 shrink-0' />
          <span>{serverError}</span>
        </div>
      )}

      {/* Credentials form */}
      <form onSubmit={form.handleSubmit(onSubmit)} method="post" className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='email' className='text-sm font-medium'>
              Correo electrónico
            </Label>
            {authHint === "credentials" && (
              <span className='rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground'>
                Último usado
              </span>
            )}
          </div>
          <Input
            id='email'
            type='email'
            placeholder='doctor@hospital.com'
            className='h-12'
            aria-invalid={!!errors.email}
            {...form.register("email")}
          />
          {errors.email && (
            <p className='text-xs text-destructive'>{errors.email.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password' className='text-sm font-medium'>
            Contraseña
          </Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              placeholder='Tu contraseña'
              className='h-12 pr-12'
              aria-invalid={!!errors.password}
              {...form.register("password")}
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground'
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff className='h-5 w-5' />
              ) : (
                <Eye className='h-5 w-5' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-xs text-destructive'>
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type='submit'
          className='h-12 w-full text-sm font-medium'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              Ingresando...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      {/* Google OAuth button */}
      <div className='relative'>
        {authHint === "google" && (
          <span className='absolute -top-2.5 right-2 z-10 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground'>
            Último usado
          </span>
        )}
        <button
          type='button'
          onClick={handleGoogleSignIn}
          className='flex h-12 w-full items-center justify-center gap-3 rounded-md border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted'
        >
          <GoogleIcon />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}
