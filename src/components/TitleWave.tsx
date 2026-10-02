type TitleWaveProps = {
  className?: string
  width?: number
}

/** Petite vague décorative sous les titres (comme sur les maquettes). */
export function TitleWave({ className = 'title-wave', width = 200 }: TitleWaveProps) {
  return (
    <svg className={className} viewBox="0 0 220 12" width={width} aria-hidden>
      <path
        d="M2 8 C 35 2, 65 11, 100 7 S 165 2, 218 8"
        fill="none"
        stroke="#b7d4bc"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
