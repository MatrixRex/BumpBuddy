import React from 'react'
import {
  Baby,
  CalendarHeart,
  Calculator,
  Hourglass,
  Scales,
  ClipboardText,
  Sparkles,
  Flower,
  BookOpen,
  MapPin,
  Info,
  CheckCircle,
  Confetti,
  Lock,
  Warning,
  Lightbulb
} from '@phosphor-icons/react'

const ICON_MAP = {
  baby: { component: Baby, defaultWeight: 'fill' },
  calendar: { component: CalendarHeart, defaultWeight: 'regular' },
  calculator: { component: Calculator, defaultWeight: 'regular' },
  hourglass: { component: Hourglass, defaultWeight: 'regular' },
  scale: { component: Scales, defaultWeight: 'regular' },
  clipboard: { component: ClipboardText, defaultWeight: 'regular' },
  sparkles: { component: Sparkles, defaultWeight: 'fill' },
  flower: { component: Flower, defaultWeight: 'fill' },
  book: { component: BookOpen, defaultWeight: 'regular' },
  mapPin: { component: MapPin, defaultWeight: 'regular' },
  info: { component: Info, defaultWeight: 'fill' },
  check: { component: CheckCircle, defaultWeight: 'fill' },
  confetti: { component: Confetti, defaultWeight: 'fill' },
  lock: { component: Lock, defaultWeight: 'fill' },
  warning: { component: Warning, defaultWeight: 'fill' },
  lightbulb: { component: Lightbulb, defaultWeight: 'fill' }
}

export default function Icon({ name, size = 20, weight, className = '', ...props }) {
  const iconConfig = ICON_MAP[name]
  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in Icon registry.`)
    return null
  }

  const IconComponent = iconConfig.component
  const resolvedWeight = weight || iconConfig.defaultWeight

  return (
    <IconComponent 
      size={size} 
      weight={resolvedWeight} 
      className={className} 
      {...props} 
    />
  )
}
