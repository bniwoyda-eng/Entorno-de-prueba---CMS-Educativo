import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTopAssessmentsByAttempts } from '../hooks/assessments.hooks';
import { LoadingComponent } from '../../../components';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartData {
  name: string;
  attempts: number;
  fullTitle: string;
}

export const AssessmentAttemptsChart = () => {
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const { data: assessments, isLoading } = useTopAssessmentsByAttempts(order, 10);

  // Prepare data for the chart
  const chartData: ChartData[] = assessments?.map(assessment => ({
    name: assessment.title.length > 12 ? assessment.title.substring(0, 12) + '...' : assessment.title,
    attempts: assessment.attempts,
    fullTitle: assessment.title
  })) || [];

  const handleOrderChange = (newOrder: 'ASC' | 'DESC') => {
    setOrder(newOrder);
  };

  if (isLoading) {
    return (
      <div className="card h-full">
        <div className="flex items-center justify-center h-full">
          <LoadingComponent />
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 flex-shrink-0">
        <h2 className="card-title">Assessment Attempts</h2>
        <div className="flex items-center gap-2">
          <select
            value={order}
            onChange={(e) => handleOrderChange(e.target.value as 'ASC' | 'DESC')}
            className="form-control py-1 px-2 text-sm"
          >
            <option value="DESC">Most Attempted</option>
            <option value="ASC">Least Attempted</option>
          </select>
          {order === 'DESC' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-blue-500" />
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No assessment data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={11}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value, 'Attempts']}
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.name === label);
                  return item?.fullTitle || label;
                }}
              />
              <Bar 
                dataKey="attempts" 
                fill={order === 'DESC' ? '#10b981' : '#3b82f6'}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500 text-center flex-shrink-0">
        Showing top 10 assessments by {order === 'DESC' ? 'most' : 'least'} attempts
      </div>
    </div>
  );
}; 