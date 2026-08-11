import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-[#161b22] border-[#30363d]',
  primary: 'bg-[#161b22] border-[#30363d]',
  success: 'bg-[#161b22] border-[#30363d]',
  warning: 'bg-[#161b22] border-[#30363d]',
  danger: 'bg-[#161b22] border-[#30363d]',
};

const iconStyles = {
  default: 'text-gray-400 bg-[#21262d]',
  primary: 'text-blue-400 bg-[#21262d]',
  success: 'text-emerald-400 bg-[#21262d]',
  warning: 'text-amber-400 bg-[#21262d]',
  danger: 'text-rose-400 bg-[#21262d]',
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className = '' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          
          {trend && (
            <div className="flex items-center space-x-1.5 pt-1 text-xs">
              <span className={`font-semibold ${trend.value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}