interface MetricCardProps {
  title: string
  value: string
}

export function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#e6e6db]">
      <p className="text-[#181811] text-base font-medium leading-normal">{title}</p>
      <p className="text-[#181811] tracking-light text-2xl font-bold leading-tight">{value}</p>
    </div>
  )
}
