type Props = {
  data: number[];
  width?: number;
  height?: number;
};

export function AreaChart({ data, width = 700, height = 220 }: Props) {
  const max = Math.max(...data) * 1.15;
  const min = 0;
  const stepX = width / (data.length - 1);
  const points = data.map<[number, number]>((v, i) => [
    i * stepX,
    height - ((v - min) / (max - min)) * (height - 30) - 10,
  ]);
  const path = points
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");
  const area = path + ` L${width},${height} L0,${height} Z`;
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  const avgY = height - ((avg - min) / (max - min)) * (height - 30) - 10;

  return (
    <svg
      className="area-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#002444" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#002444" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1="0"
        y1={avgY}
        x2={width}
        y2={avgY}
        stroke="#73777f"
        strokeDasharray="3 4"
        strokeWidth="1"
        opacity="0.5"
      />
      <path d={area} fill="url(#areaGrad)" />
      <path
        d={path}
        fill="none"
        stroke="#002444"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points
        .filter((_, i) => i % 5 === 0)
        .map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#002444" />
        ))}
    </svg>
  );
}
