// David Kloepper
// Data Visualization Bootcamp, Cohort 3
// June 21st, 2019


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

// Create an SVG wrapper at the div with id scatter, append an SVG group that will hold the chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params for the selections on the X axis and Y axis
var chosenXAxis = "healthcare";
var chosenYAxis = "age"


// Functions for updating the chart based on x-axis selections
// Function used for updating x-scale var upon click on x axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// Function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// Functions for updating the chart based on x-axis selections
// Function used for updating y-scale var upon click on y axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// Function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// Function used for updating state abbreviation label group with a transition to new locations
// Uses same transition duration as circle function
function renderAbbr(abbrGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  abbrGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis])-5)
    .attr("dy", d => newYScale(d[chosenYAxis])+5);

  return abbrGroup;
}

// Function used for updating circles group with new tooltip based on axis selection
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  // Switch statement to set x-axis label based on selection
  switch(chosenXAxis){
      case "healthcare":
        var labelX = "Lacks Healthcare:";
        break;
      case "obesity":
        var labelX = "Obesity:";
        break;
      case "smokes":
        var labelX = "Smoking:";
        break;
    }
    //Append a default % sign since all x-axis values for improved tooltip lable
    var suffixX = "%";

    // Switch statement to set y-axis label based on selection
    // Set prefix/suffix for the labels based on the data type
    switch(chosenYAxis){
      case "age":
        var labelY = "Median Age:";
        var suffixY = "";
        var prefixY = "";
        break;
      case "income":
        var labelY = "Median Income:";
        var suffixY = "";
        var prefixY = "$";
        break;
      case "poverty":
        var labelY = "In Poverty:";
        var suffixY = "%";
        var prefixY = "";
        break;
    }

    // Build the tooltip and populate it with the labels created from the switch statements above
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([0, 0])
      .html(function(d) {
        return (`<b>${d.state}</b><br>${labelX} ${d[chosenXAxis]}${suffixX}<br>${labelY} ${prefixY}${d[chosenYAxis]}${suffixY}`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this).style("opacity", .7);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData) {

  // Parse data and cast the necessary values as numbers
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // Set xLinearScale from function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  // Set yLinearScale from function above csv import
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial x and y axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  // Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .classed("stateCircle", true);

  // Append state abbreviation labels
  var abbrGroup =  chartGroup.selectAll('#stateAbbr')
    .data(censusData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis])-5)
    .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
    .attr("font-size", "10px")
    .text(function(d){return d.abbr})
    .classed("stateAbbr", true);

  // Create group for the 3 x-axis labels
  var labelsXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  // Set each of the labels and append to the group for the x-axis
  var healthcareLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var obesityLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  var smokesLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  // Create group for 3 y-axis labels
  var labelsYGroup = chartGroup.append("g")
    .attr("transform", `translate(${margin.left}, ${height / 2})`)
    .attr("transform", "rotate(-90)");

  // Set each of the labels and append to the group for the y-axis
  var ageLabel = labelsYGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left +20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age (Median)");

  var incomeLabel = labelsYGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");

  var povertyLabel = labelsYGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 60)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("In Poverty (%)");

  // updateToolTip from function above csv import
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsXGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with newly selected value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles and state abbreviation labels with new values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // Changes classes to bold text ("active") when selected
        switch (chosenXAxis) {
          case "healthcare":
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            break;
        case "obesity":
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                break;
        case "smokes":
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                break;   
        }
      }
    });

    // y axis labels event listener
  labelsYGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with newly selected value
      chosenYAxis = value;

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(censusData, chosenYAxis);

      // updates x axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      switch (chosenYAxis) {
        case "age":
          ageLabel
              .classed("active", true)
              .classed("inactive", false);
          incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          break;
      case "income":
          ageLabel
              .classed("active", false)
              .classed("inactive", true);
          incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          break;
      case "poverty":
          ageLabel
              .classed("active", false)
              .classed("inactive", true);
          incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          break;   
      }
    }
  });

});
