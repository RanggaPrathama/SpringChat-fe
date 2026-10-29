import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-base border-2 border-border px-2.5 py-0.5 text-xs font-bold text-foreground [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-main',
        neutral: 'bg-secondary-background',
        lime: 'bg-lime',
        blue: 'bg-blue text-white',
        danger: 'bg-danger text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
