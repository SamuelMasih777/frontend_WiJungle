// src/components/CategoryPieChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAlerts } from '../utils/api';
import './CategoryPieChart.css';  // Import the CSS file

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

const CategoryPieChart: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const drawChart = async () => {
      const data: Alert[] = await fetchAlerts();

      const filteredData = data.filter(d => d.alert && d.alert.category);
      const categories = d3.rollup(filteredData, v => v.length, d => d.alert!.category);
      const pieData = Array.from(categories, ([key, value]) => ({ key, value }));

      const container = d3.select(chartRef.current).node()?.parentNode as HTMLElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const radius = Math.min(width, height) / 2;      

      d3.select(chartRef.current).selectAll("*").remove();

      const svg = d3.select(chartRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie<{ key: string, value: number }>()
        .value(d => d.value)
        .sort(null);

      const arc = d3.arc<d3.PieArcDatum<{ key: string, value: number }>>()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

      const arcOver = d3.arc<d3.PieArcDatum<{ key: string, value: number }>>()
        .innerRadius(radius * 0.5)
        .outerRadius(radius + 10);

      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const arcs = svg.selectAll('.arc')
        .data(pie(pieData))
        .enter().append('g')
        .attr('class', 'arc')
        .on('mouseover', function(event, d) {
          d3.select(this).select('path').transition()
            .duration(200)
            .attr('d', arcOver as any); // Cast to any to avoid type errors

          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`Category: ${d.data.key}<br>Count: ${d.data.value}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', function() {
          d3.select(this).select('path').transition()
            .duration(200)
            .attr('d', arc as any); // Cast to any to avoid type errors

          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.key))
        .transition()
        .ease(d3.easeBounce)
        .duration(1000)
        .attrTween("d", function(d) {
          const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
          return function(t) {
            return arc(i(t)) as any; // Cast to any to avoid type errors
          };
        });

      arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'white')
        .text(d => d.data.key)
        .style("pointer-events", "none"); // To prevent text from interfering with hover events
    };

    drawChart();
  }, []);

  return (
    <div className="w-full h-96 max-w-md mx-auto">      
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default CategoryPieChart;
