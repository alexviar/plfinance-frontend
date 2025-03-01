type ProgressBarProps = {
  value: number
  variant?: 'default' | 'error'
}

export const ProgressBar = ({ value, variant = 'default' }: ProgressBarProps) => (
  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
    <div
      className="h-full transition-all duration-500"
      style={{
        width: `${value}%`,
        background: variant === 'error'
          ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
          : 'linear-gradient(90deg, #171717 0%, #404040 100%)'
      }}
    />
  </div>
);