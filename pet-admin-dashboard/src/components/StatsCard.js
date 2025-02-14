import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function StatsCard({ title, value, trend, icon, color }) {
  return (
    <motion.div 
      className={`bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/50 hover:border-zinc-700/50 ${color}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </span>
        <span className="text-zinc-500 text-sm ml-2">vs last period</span>
      </div>
    </motion.div>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
};

