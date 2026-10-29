import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

const press =
  'border-2 border-border shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0'

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-base text-sm font-bold ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: `bg-main text-main-foreground ${press}`,
        neutral: `bg-secondary-background text-foreground ${press}`,
        lime: `bg-lime text-foreground ${press}`,
        blue: `bg-blue text-white ${press}`,
        noShadow: 'border-2 border-border bg-main text-main-foreground',
        reverse:
          'border-2 border-border bg-main text-main-foreground transition-all hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-shadow motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-8 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5',
        sm: 'h-9 px-3',
        lg: 'h-12 px-8 text-base',
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
