// src/components/ProtocolDistribution.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAlerts } from '../utils/api';

interface Alert {
  proto: string;
}

const ProtocolDistribution: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drawChart = async () => {
      const data: Alert[] = await fetchAlerts();

      const counts = data.reduce((acc: Record<string, number>, alert: Alert) => {
        acc[alert.proto] = (acc[alert.proto] || 0) + 1;
        return acc;
      }, {});

      const barData = Object.entries(counts).map(([key, value]) => ({
        key,
        value,
      }));

      const container = d3.select(containerRef.current);
      const svg = d3.select(chartRef.current);

      const margin = { top: 30, right: 30, bottom: 40, left: 40 };

      const resize = () => {
        const width = container.node()?.clientWidth || 800;
        const height = 500;

        svg.attr('width', width).attr('height', height);

        const x = d3
          .scaleBand()
          .domain(barData.map((d) => d.key))
          .range([margin.left, width - margin.right])
          .padding(0.5);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(barData, (d) => d.value)!])
          .nice()
          .range([height - margin.bottom, margin.top]);

        svg.selectAll('*').remove();

        svg
          .append('g')
          .attr('fill', 'steelblue')
          .selectAll('rect')
          .data(barData)
          .join('rect')
          .attr('x', (d) => x(d.key)!)
          .attr('y', (d) => y(d.value))
          .attr('height', (d) => y(0) - y(d.value))
          .attr('width', x.bandwidth());          

        svg
          .append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x).tickSizeOuter(0))
          .selectAll('path')
    .style('stroke', 'white');

        svg
          .append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .append('text')
              .attr('x', -margin.left)
              .attr('y', 10)
              .attr('fill', 'white')
              .attr('text-anchor', 'start')
              .text('↑ Count')
              .selectAll('path')
    .style('stroke', 'white')
          );

        svg.selectAll('.tick text')
        .style('fill', 'white');
        svg.selectAll('.tick line')
        .style('stroke', 'white');
      };

      resize();
      window.addEventListener('resize', resize);

      return () => window.removeEventListener('resize', resize);
    };

    drawChart();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
      <h2 className="text-xl font-bold mb-4">Protocol Distribution</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default ProtocolDistribution;
