import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 dark:bg-violet-900/60 text-primary-800 dark:text-violet-100',
        secondary: 'bg-gray-100 dark:bg-[#232336] text-gray-800 dark:text-gray-200',
        success: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200',
        warning: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200',
        destructive: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
