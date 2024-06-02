// src/components/TopSourceIPs.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAlerts } from '../utils/api';

interface Alert {
  src_ip: string;
}

const TopSourceIPs: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drawChart = async () => {
      const data: Alert[] = await fetchAlerts();
      console.log({ data });
      const counts = data.reduce((acc: Record<string, number>, alert: Alert) => {
        acc[alert.src_ip] = (acc[alert.src_ip] || 0) + 1;
        return acc;
      }, {});

      const topSourceIPs = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key, value]) => ({
          key,
          value,
        }));

      const container = d3.select(containerRef.current);
      const svg = d3.select(chartRef.current);

      const margin = { top: 30, right: 30, bottom: 40, left: 100 };

      const resize = () => {
        const width = container.node()?.clientWidth || 800;
        const height = 500;

        svg.attr('width', width).attr('height', height);

        const x = d3
          .scaleLinear()
          .domain([0, d3.max(topSourceIPs, (d) => d.value)!])
          .nice()
          .range([margin.left, width - margin.right]);

        const y = d3
          .scaleBand()
          .domain(topSourceIPs.map((d) => d.key))
          .range([margin.top, height - margin.bottom])
          .padding(0.1);

        const color = d3
          .scaleOrdinal(d3.schemeCategory10)
          .domain(topSourceIPs.map((d) => d.key));

        svg.selectAll('*').remove();

        svg
          .append('g')
          .selectAll('rect')
          .data(topSourceIPs)
          .join('rect')
          .attr('x', x(0))
          .attr('y', (d) => y(d.key)!)
          .attr('width', (d) => x(d.value) - x(0))
          .attr('height', y.bandwidth())
          .attr('fill', (d) => color(d.key));

        svg
          .append('g')
          .attr('transform', `translate(0,${margin.top})`)
          .call(d3.axisTop(x).ticks(width / 100, 's'))
          .call((g) => g.selectAll('.domain').remove());
          

        svg
          .append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickSizeOuter(0))
          .call((g) => g.selectAll('.domain').remove());
        svg.selectAll('.tick text')
        .style('fill', 'white');
      };

      resize();
      window.addEventListener('resize', resize);

      return () => window.removeEventListener('resize', resize);
    };

    drawChart();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>      
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default TopSourceIPs;
