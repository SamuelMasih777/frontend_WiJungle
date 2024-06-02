// src/components/AlertsBySeverity.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAlerts } from '../utils/api';

interface Alert {
  severity: number;
}

const AlertsBySeverity: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const drawChart = async () => {
      const data: Alert[] = await fetchAlerts();

      const counts = data.reduce((acc: Record<number, number>, alert: Alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      }, {});

      const pieData = Object.entries(counts).map(([key, value]) => ({
        key: Number(key),
        value
      }));

      const width = 400;
      const height = 300;

      const svg = d3.select(chartRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie<{ key: number, value: number }>()
        .value(d => d.value);

      const arc = d3.arc<d3.PieArcDatum<{ key: number, value: number }>>()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2);

      const arcs = svg.selectAll('.arc')
        .data(pie(pieData))
        .enter().append('g')
        .attr('class', 'arc');

      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.key.toString()));

      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .text(d => d.data.key.toString());
    };

    drawChart();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Alerts by Severity</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default AlertsBySeverity;
