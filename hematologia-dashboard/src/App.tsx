import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart
} from 'recharts';
import {
  Sun, Moon, Activity, Droplets, Heart, TrendingDown, TrendingUp,
  AlertTriangle, CheckCircle, BarChart3, LineChart as LineChartIcon,
  PieChart, Waves, Calendar, User, Stethoscope
} from 'lucide-react';
import { estudios, valoresNormales } from './data/hematologicos';
import type { MetricKey, Estudio } from './data/hematologicos';

type ChartType = 'line' | 'area' | 'bar' | 'composed' | 'radar';

const metricInfo: Record<string, { label: string; color: string; icon: React.ReactNode; category: 'roja' | 'blanca' | 'otros' }> = {
  eritrocitos: { label: 'Eritrocitos', color: '#ef4444', icon: <Droplets className="w-4 h-4" />, category: 'roja' },
  hemoglobina: { label: 'Hemoglobina', color: '#dc2626', icon: <Heart className="w-4 h-4" />, category: 'roja' },
  hematocrito: { label: 'Hematocrito', color: '#b91c1c', icon: <Activity className="w-4 h-4" />, category: 'roja' },
  vcm: { label: 'VCM', color: '#991b1b', icon: <Waves className="w-4 h-4" />, category: 'roja' },
  leucocitos: { label: 'Leucocitos', color: '#3b82f6', icon: <Activity className="w-4 h-4" />, category: 'blanca' },
  plaquetas: { label: 'Plaquetas', color: '#8b5cf6', icon: <Droplets className="w-4 h-4" />, category: 'otros' },
  eritrosedimentacion: { label: 'Eritrosedimentación', color: '#f59e0b', icon: <TrendingDown className="w-4 h-4" />, category: 'otros' },
  pmns: { label: 'PMNs (Neutrófilos)', color: '#06b6d4', icon: <Activity className="w-4 h-4" />, category: 'blanca' },
  linfocitos: { label: 'Linfocitos', color: '#10b981', icon: <Activity className="w-4 h-4" />, category: 'blanca' },
  monocitos: { label: 'Monocitos', color: '#f97316', icon: <Activity className="w-4 h-4" />, category: 'blanca' },
};

const chartTypes: { type: ChartType; label: string; icon: React.ReactNode }[] = [
  { type: 'area', label: 'Área', icon: <Waves className="w-4 h-4" /> },
  { type: 'line', label: 'Líneas', icon: <LineChartIcon className="w-4 h-4" /> },
  { type: 'bar', label: 'Barras', icon: <BarChart3 className="w-4 h-4" /> },
  { type: 'composed', label: 'Combinado', icon: <PieChart className="w-4 h-4" /> },
  { type: 'radar', label: 'Radar', icon: <Activity className="w-4 h-4" /> },
];

function getMetricValue(estudio: Estudio, metric: MetricKey): number | null {
  if (metric in estudio.serie_roja) {
    return estudio.serie_roja[metric as keyof typeof estudio.serie_roja];
  }
  if (metric in estudio.serie_blanca) {
    return estudio.serie_blanca[metric as keyof typeof estudio.serie_blanca];
  }
  if (metric === 'plaquetas') return estudio.plaquetas;
  if (metric === 'eritrosedimentacion') return estudio.eritrosedimentacion;
  return null;
}

function getStatus(value: number | null, metric: MetricKey): 'normal' | 'high' | 'low' | 'unknown' {
  if (value === null) return 'unknown';
  const range = valoresNormales[metric];
  if (!range) return 'unknown';
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'normal';
}

const StatusBadge = ({ status }: { status: 'normal' | 'high' | 'low' | 'unknown' }) => {
  const styles = {
    normal: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    low: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  const labels = { normal: 'Normal', high: 'Alto', low: 'Bajo', unknown: 'N/A' };
  const icons = {
    normal: <CheckCircle className="w-3 h-3" />,
    high: <TrendingUp className="w-3 h-3" />,
    low: <TrendingDown className="w-3 h-3" />,
    unknown: <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
      {icons[status]} {labels[status]}
    </span>
  );
};

const CustomTooltip = ({ active, payload, darkMode }: any) => {
  if (!active || !payload?.length) return null;

  const fecha = payload[0]?.payload?.fecha;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border shadow-2xl ${
        darkMode
          ? 'bg-gray-900/95 border-gray-700 text-white'
          : 'bg-white/95 border-gray-200 text-gray-900'
      }`}
    >
      <p className="font-semibold mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Sin fecha'}
      </p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono font-bold">{entry.value?.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MetricCard = ({ metric, darkMode }: { metric: MetricKey; darkMode: boolean }) => {
  const info = metricInfo[metric];
  const range = valoresNormales[metric];
  const latestValue = getMetricValue(estudios[estudios.length - 1], metric);
  const previousValue = getMetricValue(estudios[estudios.length - 2], metric);
  const status = getStatus(latestValue, metric);

  const change = latestValue && previousValue
    ? ((latestValue - previousValue) / previousValue * 100).toFixed(1)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative p-5 rounded-2xl border overflow-hidden transition-all duration-300 ${
        darkMode
          ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
           style={{ background: `radial-gradient(circle, ${info?.color} 0%, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${info?.color}20` }}>
            <span style={{ color: info?.color }}>{info?.icon}</span>
          </div>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {info?.label}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {latestValue?.toFixed(2) ?? 'N/A'}
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Rango: {range?.min} - {range?.max} {range?.unidad}
          </p>
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${
            parseFloat(change) > 0 ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {parseFloat(change) > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(parseFloat(change))}%
          </div>
        )}
      </div>
    </motion.div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('area');
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['hemoglobina', 'hematocrito']);
  const [activeCategory, setActiveCategory] = useState<'all' | 'roja' | 'blanca' | 'otros'>('all');

  const chartData = useMemo(() => {
    return estudios.map(estudio => ({
      fecha: estudio.fecha,
      fechaDisplay: new Date(estudio.fecha).toLocaleDateString('es-AR', { month: 'short', year: '2-digit' }),
      eritrocitos: estudio.serie_roja.eritrocitos,
      hemoglobina: estudio.serie_roja.hemoglobina,
      hematocrito: estudio.serie_roja.hematocrito,
      vcm: estudio.serie_roja.vcm,
      leucocitos: estudio.serie_blanca.leucocitos,
      pmns: estudio.serie_blanca.pmns,
      linfocitos: estudio.serie_blanca.linfocitos,
      monocitos: estudio.serie_blanca.monocitos,
      plaquetas: estudio.plaquetas,
      eritrosedimentacion: estudio.eritrosedimentacion,
    }));
  }, []);

  const radarData = useMemo(() => {
    const latest = estudios[estudios.length - 1];
    return [
      { metric: 'Eritrocitos', value: ((latest.serie_roja.eritrocitos || 0) / 7) * 100, fullMark: 100 },
      { metric: 'Hemoglobina', value: ((latest.serie_roja.hemoglobina || 0) / 20) * 100, fullMark: 100 },
      { metric: 'Hematocrito', value: latest.serie_roja.hematocrito || 0, fullMark: 100 },
      { metric: 'Leucocitos', value: ((latest.serie_blanca.leucocitos || 0) / 35) * 100, fullMark: 100 },
      { metric: 'Plaquetas', value: ((latest.plaquetas || 0) / 700) * 100, fullMark: 100 },
    ];
  }, []);

  const toggleMetric = (metric: MetricKey) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const filteredMetrics = Object.entries(metricInfo).filter(([_, info]) =>
    activeCategory === 'all' || info.category === activeCategory
  );

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    const gradientDefs = (
      <defs>
        {selectedMetrics.map(metric => (
          <linearGradient key={metric} id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={metricInfo[metric]?.color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={metricInfo[metric]?.color} stopOpacity={0.1}/>
          </linearGradient>
        ))}
      </defs>
    );

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {gradientDefs}
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="fechaDisplay" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Legend />
            {selectedMetrics.map(metric => (
              <Area
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metricInfo[metric]?.label}
                stroke={metricInfo[metric]?.color}
                fill={`url(#gradient-${metric})`}
                strokeWidth={3}
                dot={{ fill: metricInfo[metric]?.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="fechaDisplay" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Legend />
            {selectedMetrics.map(metric => {
              const range = valoresNormales[metric];
              return [
                <ReferenceLine key={`${metric}-min`} y={range?.min} stroke={metricInfo[metric]?.color} strokeDasharray="5 5" strokeOpacity={0.5} />,
                <ReferenceLine key={`${metric}-max`} y={range?.max} stroke={metricInfo[metric]?.color} strokeDasharray="5 5" strokeOpacity={0.5} />,
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={metricInfo[metric]?.label}
                  stroke={metricInfo[metric]?.color}
                  strokeWidth={3}
                  dot={{ fill: metricInfo[metric]?.color, strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, strokeWidth: 2, fill: metricInfo[metric]?.color }}
                />
              ];
            })}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="fechaDisplay" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Legend />
            {selectedMetrics.map(metric => (
              <Bar
                key={metric}
                dataKey={metric}
                name={metricInfo[metric]?.label}
                fill={metricInfo[metric]?.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {gradientDefs}
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="fechaDisplay" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Legend />
            {selectedMetrics.map((metric, index) =>
              index % 2 === 0 ? (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={metricInfo[metric]?.label}
                  fill={`url(#gradient-${metric})`}
                  stroke={metricInfo[metric]?.color}
                />
              ) : (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={metricInfo[metric]?.label}
                  stroke={metricInfo[metric]?.color}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              )
            )}
          </ComposedChart>
        );

      case 'radar':
        return (
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <PolarAngleAxis dataKey="metric" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <PolarRadiusAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
            <Radar
              name="Último Estudio"
              dataKey="value"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.5}
            />
            <Legend />
          </RadarChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-red-500' : 'bg-red-300'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse delay-1000 ${
          darkMode ? 'bg-blue-500' : 'bg-blue-300'
        }`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Hematología</span>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}> Dashboard</span>
            </h1>
            <div className={`flex items-center gap-4 mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {estudios[0].paciente}
              </span>
              <span className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                {estudios.length} estudios
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl transition-all ${
              darkMode
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                : 'bg-white hover:bg-gray-100 text-gray-700 shadow-lg'
            }`}
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </motion.button>
        </motion.header>

        {/* Metric Cards */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Último Estudio - {new Date(estudios[estudios.length - 1].fecha).toLocaleDateString('es-AR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['hemoglobina', 'hematocrito', 'leucocitos', 'plaquetas'].map((metric, index) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <MetricCard metric={metric as MetricKey} darkMode={darkMode} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Chart Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-3xl p-6 border ${
            darkMode
              ? 'bg-gray-800/50 border-gray-700/50'
              : 'bg-white border-gray-200 shadow-xl'
          }`}
        >
          {/* Chart Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Evolución Temporal
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Visualiza la evolución de tus valores hematológicos
              </p>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center gap-2">
              {chartTypes.map(({ type, label, icon }) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setChartType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    chartType === type
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Metric Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Categorías:
              </span>
              {(['all', 'roja', 'blanca', 'otros'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? cat === 'roja' ? 'bg-red-500 text-white'
                        : cat === 'blanca' ? 'bg-blue-500 text-white'
                        : cat === 'otros' ? 'bg-purple-500 text-white'
                        : 'bg-gray-500 text-white'
                      : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat === 'roja' ? 'Serie Roja' : cat === 'blanca' ? 'Serie Blanca' : 'Otros'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {filteredMetrics.map(([metric, info]) => (
                <motion.button
                  key={metric}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMetric(metric as MetricKey)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selectedMetrics.includes(metric as MetricKey)
                      ? 'border-transparent text-white shadow-lg'
                      : darkMode
                        ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                  style={selectedMetrics.includes(metric as MetricKey) ? { backgroundColor: info.color } : {}}
                >
                  {info.icon}
                  {info.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <AnimatePresence mode="wait">
            <motion.div
              key={chartType}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-[400px] md:h-[500px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Historial de Estudios
          </h2>
          <div className="relative">
            <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
            <div className="space-y-4">
              {[...estudios].reverse().map((estudio, index) => (
                <motion.div
                  key={estudio.protocolo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative pl-10 ${
                    index === 0 ? '' : ''
                  }`}
                >
                  <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                    index === 0
                      ? 'bg-red-500 border-red-400'
                      : darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'
                  }`} />
                  <div className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                    darkMode
                      ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'
                      : 'bg-white border-gray-200 shadow hover:shadow-lg'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(estudio.fecha).toLocaleDateString('es-AR', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Protocolo: {estudio.protocolo} • {estudio.medico_solicitante}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-500" />
                          Hb: {estudio.serie_roja.hemoglobina}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-blue-500" />
                          Leuc: {estudio.serie_blanca.leucocitos}
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplets className="w-4 h-4 text-purple-500" />
                          Plaq: {estudio.plaquetas}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`mt-12 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
        >
          <p>Dashboard de seguimiento hematológico</p>
          <p className="mt-1">Los valores de referencia son orientativos. Consulte siempre a su médico.</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
