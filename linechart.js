// set the dimensions and margins of the graph
const margin1 = {top: 50, right: 20, bottom: 30, left: 200},
width1 = 600 - margin1.left - margin1.right,
height1 = 400 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
const svg1 = d3.select("#my_dataviz1")
.append("svg")
.attr("width", width1 + margin1.left + margin1.right)
.attr("height", height1 + margin1.top + margin1.bottom)
.append("g")
.attr("transform", `translate(${margin1.left}, ${margin1.top})`);

//Read the data
d3.csv("owid-covid-data.csv").then( function(data) {

const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(function (d) {
    d.date = parseDate(d.date);
});

// List of groups (here I have one group per column)
const allGroup = new Set(data.map(d => d.location))

// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
     .data(allGroup)
  .enter()
    .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button

// A color scale: one color for each group
const myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

// Add X axis --> it is a date format
const x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.date; }))
  .range([ 0, width1 ]);
svg1.append("g")
  .attr("transform", `translate(0, ${height1})`)
  .call(d3.axisBottom(x).ticks(7));


// Add Y axis
const y = d3.scaleLinear()
  .range([ height1, 0 ]);

svg1.append("g")
  .attr("class", "y axis")
  .attr("transform", `translate(0, 0)`)
  .call(d3.axisLeft(y));

  //title
svg1
.append("text")
.attr("x", 100)
.attr("y", 40)
.attr("text-anchor", "middle")
.text("COVID-19 Cases per Million People Country");


// Initialize line with first group of the list
const line = svg1
  .append('g')
  .append("path")
    .datum(data.filter(function(d){return d.location=="China"}))
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(+d.new_cases) })
    )
    .attr("stroke", function(d){ return myColor("valueA") })
    .style("stroke-width", 1)
    .style("fill", "none")

function update(selectedGroup) {

  // Create new data with the selection?
  const dataFilter = data.filter(function(d){return d.location==selectedGroup})

  // Update Y axis domain with selected country's maximum new_cases value
  const maxY = d3.max(dataFilter, function(d) { return +d.new_cases; });
  y.domain([0, maxY]);

  // Update Y axis and transition
  svg1.select(".y.axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));

  // Give these new data to update line
  line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(+d.new_cases) })
      )
      .attr("stroke", function(d){ return myColor(selectedGroup) })
  }


// When the button is changed, run the updateChart function
d3.select("#selectButton").on("change", function(event,d) {
    // recover the option that has been chosen
    const selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
})

})
