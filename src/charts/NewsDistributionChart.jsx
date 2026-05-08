import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

/**
 * News distribution pie chart
 * Shows article counts by category with interactive slices
 */
export default function NewsDistributionChart({ techCount, spaceCount, onSliceClick }) {
  const { theme } = useTheme();

  const data = [
    { name: 'Technology', value: techCount, category: 'technology' },
    { name: 'Space & Science', value: spaceCount, category: 'space' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-3 py-2 rounded-lg text-xs shadow-lg backdrop-blur-lg
          ${theme === 'dark'
            ? 'bg-space-800/90 border border-white/10 text-white'
            : 'bg-white/90 border border-gray-200 text-gray-800'
          }`}
        >
          <p className="font-semibold">{payload[0].name}</p>
          <p style={{ color: payload[0].payload.fill }}>
            {payload[0].value} articles
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = ({ name, percent }) => {
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          📊 News Distribution
        </h3>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {techCount + spaceCount} total articles
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              onClick={(entry) => onSliceClick && onSliceClick(entry.category)}
              style={{ cursor: 'pointer' }}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
