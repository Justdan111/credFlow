'use client';


import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const collectionData = [
  { month: 'Jan', target: 1000000, actual: 850000 },
  { month: 'Feb', target: 1000000, actual: 920000 },
  { month: 'Mar', target: 1200000, actual: 1050000 },
  { month: 'Apr', target: 1200000, actual: 1180000 },
  { month: 'May', target: 1200000, actual: 1100000 },
  { month: 'Jun', target: 1300000, actual: 1250000 },
];

const riskTrendData = [
  { month: 'Jan', low: 45, medium: 40, high: 15 },
  { month: 'Feb', low: 48, medium: 38, high: 14 },
  { month: 'Mar', low: 52, medium: 35, high: 13 },
  { month: 'Apr', low: 55, medium: 33, high: 12 },
  { month: 'May', low: 53, medium: 34, high: 13 },
  { month: 'Jun', low: 58, medium: 31, high: 11 },
];

const customerValueData = [
  { range: '0-100K', count: 120 },
  { range: '100K-500K', count: 450 },
  { range: '500K-1M', count: 380 },
  { range: '1M+', count: 284 },
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const insights = [
    { title: 'Collection Rate', value: '92.5%', change: '+3.2%', trend: 'up' },
    { title: 'Avg Days to Collect', value: '18.3', change: '-2.1', trend: 'down' },
    { title: 'Customer Retention', value: '94.8%', change: '+1.5%', trend: 'up' },
    { title: 'Bad Debt Ratio', value: '2.3%', change: '-0.8%', trend: 'down' },
  ];

  return (
      <div className="space-y-8">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-foreground/70 mt-2">Deep insights into your debt and collection performance.</p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => (
            <Card
              key={index}
              className={`p-6 border border-border/50 hover:border-purple-300 transition-all ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-sm text-foreground/70 mb-2">{insight.title}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${insight.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                  {insight.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {insight.change}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Performance */}
          <Card className={`p-6 border border-border/50 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Collection Performance</h3>
              <p className="text-sm text-foreground/70 mt-1">Target vs Actual Collections</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  formatter={(value) => `₦${(value / 1000000).toFixed(1)}M`}
                />
                <Legend />
                <Bar dataKey="target" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Risk Trend */}
          <Card className={`p-6 border border-border/50 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Risk Distribution Trend</h3>
              <p className="text-sm text-foreground/70 mt-1">Customer segmentation over time</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="low" stackId="1" fill="#22c55e" />
                <Area type="monotone" dataKey="medium" stackId="1" fill="#f59e0b" />
                <Area type="monotone" dataKey="high" stackId="1" fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Customer Value Distribution */}
        <Card className={`p-6 border border-border/50 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Customer Value Distribution</h3>
            <p className="text-sm text-foreground/70 mt-1">Total debt amount by customer segment</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerValueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis dataKey="range" type="category" stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Insights Section */}
        <Card className={`p-6 border border-border/50 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-foreground/80">Your collection rate of 92.5% is excellent, indicating strong customer payment discipline.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-foreground/80">June saw the highest collections (₦1.25M), primarily driven by improved risk management.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-foreground/80">Your average collection time has improved by 2.1 days in the last month—keep up the momentum!</p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-foreground/80">Focus on the 11% high-risk customers to further reduce the bad debt ratio.</p>
            </div>
          </div>
        </Card>
      </div>
  );
}
