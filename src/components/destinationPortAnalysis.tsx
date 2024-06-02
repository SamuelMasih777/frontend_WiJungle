import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { fetchAlerts } from '../utils/api';

interface Alert {
  dest_port: number;
}

const DestinationPortAnalysis: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const drawChart = async () => {
      const data: Alert[] = await fetchAlerts();

      const counts = data.reduce((acc: Record<number, number>, alert: Alert) => {
        acc[alert.dest_port] = (acc[alert.dest_port] || 0) + 1;
        return acc;
      }, {});

      // Convert counts to an array and sort by value in descending order
      let barData = Object.entries(counts).map(([key, value]) => ({
        key: Number(key),
        value
      }));

      // Sort the barData by value in descending order and take the top 5
      barData = barData.sort((a, b) => b.value - a.value).slice(0, 5);

      const width = 600;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 45, left: 40 };

      // Clear any existing content inside the SVG container
      const svgContainer = d3.select(chartRef.current);
      svgContainer.selectAll('*').remove();

      // Create the SVG container.
      const svg = svgContainer
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      const x = d3.scaleBand<string>()
        .domain(barData.map(d => d.key.toString()))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear<number>()
        .domain([0, d3.max(barData, d => d.value)!]).nice()
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal<string, string>(d3.schemeCategory10);

      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
  .attr("transform", `translate(0,${height- margin.bottom})`)
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .selectAll("text")
  .attr("y", 10)  // move text down
  .attr("x", 0)
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .style("fill", "white") // Set x-axis text color to white
  .style("transform", "rotate(-0deg)")
  .style("text-align", "right");


      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Count"));

      svg.append("g")
        .selectAll<SVGRectElement, { key: number; value: number }>("rect")
        .data(barData)
        .enter().append("rect")
        .attr("x", d => x(d.key.toString())!)
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .attr("fill", d => color(d.key.toString()));

      svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis)
        .selectAll('path')
        .style('stroke', 'white'); // Set x-axis line color to white

      svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll('path')
        .style('stroke', 'white'); // Set y-axis line color to white

      svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
        .attr("y", height - 10) // position just above the bottom edge
        .attr("fill", "white")
        .text("Destination Ports");
        
      svg.selectAll('.tick text')
        .style('fill', 'white');
    };

    drawChart();
  }, []);

  return (
    <div className="">    
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default DestinationPortAnalysis;
