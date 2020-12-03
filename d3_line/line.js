//setting dimensions and margins
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//appending the svg object to the body of the page
var svg = d3.select("#line_chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

//setting background color (ggplot2 styling)
     svg
     .append("rect")
     .attr("x",0)
     .attr("y",0)
     .attr("height", height)
     .attr("width", width + 10)
     .style("fill", "#EBEBEB")
     .style("opacity",1)

//reading the data (.json)
d3.json("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/data.json", function(data) {

//formating the data (time series ONLY)
data.forEach(function (d) {
  parseDate = d3.timeParse("%Y");
  d.x = parseDate(d.x);
  d.y = +d.y;
});

//sorting data by x var
data.sort(function (a, b) {
    return a.x - b.x;
});

//defining time scale for x axis
var x = d3.scaleTime().range([0, width]);

//defining linear scale for y axis
var y = d3.scaleLinear().range([height, 0]);

//providing domain values to x & y scales
x.domain(d3.extent(data, function (d) {
    return d.x;
}));
y.domain([0, d3.max(data, function (d) {
    return d.y;
})]);

//appending x axis to svg
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSize(-height*1.3).ticks(8))
  .select('.domain').remove();

//appending y axis to svg
svg.append("g")
  .call(d3.axisLeft(y).tickSize(-width*1.3).ticks(6))
  .select('.domain').remove();

//customizing plot background (ggplot2 styling)
svg.selectAll('.tick line').attr('stroke','white')

//defining the line
var valueline = d3.line()
    .x(function (d) {
        return x(d.x);
    })
    .y(function (d) {
        return y(d.y);
    });

//adding trend line
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)
    .attr("stroke", "#2095f4")
    .attr("stroke-width", 2.5)
    .attr("fill","#EBEBEB");

//defining tooltip
var Tooltip = d3.select("#line_chart")
.append('div')
.style("opacity", 0.9)
.attr("class", "tooltip")
.style("background-color", '#EBEBEB')
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "2px")
.style("padding", "2px")
.style("position", "absolute")

//defining mouseover, mousemove and mouseleave functions
var mouseover = function(d,i) {
  Tooltip.
  style("opacity",1)
  d3.select(this)
  .attr("r", 7.5)
  .attr("stroke", "#414453")
  .style("fill", "#414453")
  }

var mousemove = function(d) {
    Tooltip
    .html(d.y)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
  }

  var mouseout = function(d,i) {
    Tooltip.
    style("opacity",0)
    d3.select(this)
    .attr("r", 5)
    .attr("stroke", "#2095f4")
    .style("fill", "#2095f4")
    }

//adding dots
var path = svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function (d) { return x(d.x);})
    .attr("cy", function (d) { return y(d.y);})
    .attr("stroke", "#2095f4")
    .attr("stroke-width", 1.5)
    .attr("fill", "#2095f4")
    .on('mouseover',mouseover) //listener for mouseover event
    .on('mousemove',mousemove) //listener for mousemove event
    .on('mouseout', mouseout) //listener for mouseout event
  })
