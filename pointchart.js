// Define the dimensions of the chart
const margin2 = { top: 50, right: 50, bottom: 50, left: 50 };
const width2 = 800 - margin2.left - margin2.right;
const height2 = 600 - margin2.top - margin2.bottom;

// Define the SVG container for the chart
const svg2 = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// Load the data from the CSV file
d3.csv("owid-covid-data.csv").then(function (data) {
  // Format the date values
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  // Define the x and y scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width2]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.total_cases_per_million)])
    .range([height2, 0]);

  // Define the line generator
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.total_cases_per_million));

  // Create the line chart
  svg2
    .append("path")
    .datum(data.filter((d) => d.location === "World"))
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add the x-axis
  svg2
    .append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(d3.axisBottom(xScale));

  // Add the y-axis
  svg2.append("g").call(d3.axisLeft(yScale));

  // Add the chart title
  svg2
    .append("text")
    .attr("x", width2 / 2)
    .attr("y", 0 - margin2.top / 2)
    .attr("text-anchor", "middle")
    .text("COVID-19 Cases per Million People Worldwide");

  // Define a tooltip for displaying data points
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  
  // // Define a function for showing the tooltip
  const showTooltip = (event, d) => {
    tooltip
      .html(
        `<div>Country: ${d.location}</div><div>Date: ${d.date.toLocaleDateString()}</div><div>Total Cases per Million: ${d.total_cases_per_million}</div>`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px")
      .transition()
      .duration(200)
      .style("opacity", 0.9);
      
    // Add country name to tooltip
    tooltip
      .append("div")
      .style("font-size", "12px")
      .style("margin-top", "5px")
      .text("Country: " + d.location);
  };

  // Define a function for hiding the tooltip
  const hideTooltip = () => {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  // Add the data points as circles with tooltips
  svg2
    .selectAll("circle")
    .data(data.filter((d) => d.location === "World"))
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.total_cases_per_million))
    .attr("r", 3)
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      showTooltip(event, d, "World");
    })
    .on("mouseout", hideTooltip);
 

});