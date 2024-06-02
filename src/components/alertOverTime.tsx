// src/components/AlertsOverTime.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAlerts } from '../utils/api';

interface Alert {
  timestamp: string;
  flow_id: number;
  in_iface: string;
  event_type: string;
  src_ip: string;
  src_port: number;
  dest_ip: string;
  dest_port: number;
  proto: string;
  alert: {
    action: string;
    gid: number;
    signature_id: number;
    rev: number;
    signature: string;
    category: string;
    severity: number;
  } | null;
}

const AlertsOverTime: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const drawChart = async () => {
      const data: Alert[] = await fetchAlerts();

      const filteredData = data.filter(d => d.timestamp);
      const parsedData = filteredData.map(d => ({
        timestamp: new Date(d.timestamp),
        count: 1,
      }));

      const nestedData = d3.groups(parsedData, d => d3.timeHour(d.timestamp));
      const timeSeries = nestedData.map(([key, value]) => ({
        date: key,
        count: d3.sum(value, d => d.count),
      }));

      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(chartRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleTime()
        .domain(d3.extent(timeSeries, d => d.date) as [Date, Date])
        .range([0, width]);
        

      const y = d3.scaleLinear()
        .domain([0, d3.max(timeSeries, d => d.count) as number])
        .nice()
        .range([height, 0]);

      svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('path')
      .style('stroke', 'green'); 

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('path')
        .style('stroke','green');
    
        svg.selectAll('.tick text')
        .style('fill', 'white');

      svg.append('path')
        .datum(timeSeries)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.75)
        .attr('d', d3.line<{ date: Date, count: number }>()
          .x(d => x(d.date))
          .y(d => y(d.count)));
    };

    drawChart();
  }, []);

  return (
    <div className="">      
      <svg ref={chartRef}></svg>      
    </div>
  );
};

export default AlertsOverTime;
