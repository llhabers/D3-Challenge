// @TODO: YOUR CODE HERE!
// 16.3 - 09
// 16.3 - 11 & 12

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(function(data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.abbr = data.abbr;
        data.income = +data.income;
        console.log(data);
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(stateData, d => d.poverty)])
      .range([0, width])
      .nice();

    var yLinearScale = d3.scaleLinear()
      .domain([3.5, d3.max(stateData, d => d.healthcare)])
      .range([height, 0])
      .nice();

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".6")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

    chartGroup.select("g")
    .selectAll("circle")
    .data(stateData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy",-395)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");

    console.log(stateData);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .select('body')
    .append('div')
    .attr('class', "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - ((margin.left / 2) + 2))
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "16px")
    //   .attr("fill", "black")
    //   .style("font-weight", "bold")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 13})`)
      .attr("class", "axisText")
    //   .attr("text-anchor", "middle")
    //   .attr("font-size", "16px")
    //   .attr("fill", "black")
    //   .style("font-weight", "bold")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
