"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type AnimationDirection = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur"

interface RevealAnimationProps {
  children: ReactNode
  direction?: AnimationDirection
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function RevealAnimation({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className,
  once = true,
}: RevealAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: once })

  const getTransform = () => {
    switch (direction) {
      case "up":
        return "translateY(60px)"
      case "down":
        return "translateY(-60px)"
      case "left":
        return "translateX(60px)"
      case "right":
        return "translateX(-60px)"
      case "scale":
        return "scale(0.9)"
      case "blur":
      case "fade":
      default:
        return "none"
    }
  }

  const getFilter = () => {
    if (direction === "blur") {
      return "blur(10px)"
    }
    return "none"
  }

  return (
    <div
      ref={ref}
      className={cn("transition-all", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getTransform(),
        filter: isVisible ? "none" : getFilter(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  baseDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
}: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation({ triggerOnce: true })

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className="transition-all"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : "translateY(40px)",
                transitionDuration: "600ms",
                transitionDelay: `${baseDelay + index * staggerDelay}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}
