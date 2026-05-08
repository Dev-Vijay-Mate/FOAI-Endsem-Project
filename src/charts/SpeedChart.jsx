import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

/**
 * ISS Speed line chart with gradient area fill
 * Shows last 30 speed measurements in real-time
 */
export default function SpeedChart({ speeds }) {
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-3 py-2 rounded-lg text-xs shadow-lg backdrop-blur-lg
          ${theme === 'dark'
            ? 'bg-space-800/90 border border-white/10 text-white'
            : 'bg-white/90 border border-gray-200 text-gray-800'
          }`}
        >
          <p className="font-mono text-gray-400 mb-1">{label}</p>
          <p className="font-semibold text-cosmic-400">
            ⚡ {payload[0].value.toLocaleString()} km/h
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          ⚡ ISS Speed Over Time
        </h3>
        <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          Last {speeds.length} readings
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={speeds} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: textColor }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: textColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#speedGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0f0a2e', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
