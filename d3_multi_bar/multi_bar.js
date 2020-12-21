// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 60},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//appending svg object to body
var svg = d3.select("#bar_chart")
  .append("svg")
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

//reading the data (.csv)
d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/XYZ.csv", function(data) {

  //extracting subgroups
  var subgroups = data.columns.slice(1)

  //extracting groups
  var groups = d3.map(data, function(d){return(d.class)}).keys()

  //defining color palette (KoBo default)
  var colors = ['#479FF6', '#6BCAD6', '#F86678', '#4B4E5E','#7B7F97','#ACAFC5','#D3D5E2','#EBEDF4']
  
  //defining color scale
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(colors)

  //defining discrete band scale for x axis
  var x = d3.scaleBand().range([0, width]).padding([0.25])

  //defining linear scale for y axis
  var y = d3.scaleLinear().range([height, 0]);

  //providing domain values to x, y axis'
  x.domain(groups)
  y.domain([0, d3.max(data,function(d) { return d.value; })]);

  //defining a scale for subgroup positioning
  xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05])

  //adding x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height*1.3).ticks())
    .select('.domain').remove();

  //adding y axis
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(-width*1.3).ticks())
    .select('.domain').remove();

  //plotting background customization (ggplot2 styling)
  svg.selectAll('.tick line').attr('stroke','white')

  //defining tooltip
  var Tooltip = d3.select("#bar_chart")
  .append('div')
  .style("opacity", 0.9)
  .attr("class", "tooltip")
  .style("background-color", '#EBEBEB')
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "2px")
  .style("padding", "2px")
  .style("position", "absolute")

  //defining mouseover, mousemove and mouseout functions
    var mouseover = function(d) {
      Tooltip.
      style("opacity",1)
      d3.select(this)
        .style("fill", "#414453")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html(d.key + "</br>" + d.value)
        .style("left", (d3.mouse(this)[0]) + 100 + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseout = function(d) {
      Tooltip.
      style("opacity",0)
      d3.select(this)
        .style("fill", function(d) { return color(d.key); })
        .style("opacity", 1)
    }

  //adding the bars
  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.class) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .on('mouseover',mouseover) //listener for mouseover event
    .on("mousemove",mousemove) //listener for mousemove event
    .on('mouseout',mouseout) //listener for mouseout event
      .attr("height", function(d) { return height - y(d.value); })
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("fill", function(d) { return color(d.key); });
})
