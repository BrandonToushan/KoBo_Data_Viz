// set the dimensions and margins of the graph
var margin_horizontal_multi_bar = {top: 10, right: 30, bottom: 20, left: 60},
    width_horizontal_multi_bar = 500 - margin_horizontal_multi_bar.left - margin_horizontal_multi_bar.right,
    height_horizontal_multi_bar = 300 - margin_horizontal_multi_bar.top - margin_horizontal_multi_bar.bottom;

//appending svg object to body
var svg_horizontal_multi_bar = d3.select("#horizontal_multi_bar_chart")
  .append("svg")
    .attr("width", width_horizontal_multi_bar + margin_horizontal_multi_bar.left + margin_horizontal_multi_bar.right)
    .attr("height", height_horizontal_multi_bar + margin_horizontal_multi_bar.top + margin_horizontal_multi_bar.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_horizontal_multi_bar.left + "," + margin_horizontal_multi_bar.top + ")");

//setting background color (ggplot2 styling)
svg_horizontal_multi_bar
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height_horizontal_multi_bar)
.attr("width", width_horizontal_multi_bar + 10)
.style("fill", "#EBEBEB")

//reading the data (.csv)
var dataset_horizontal_multi_bar = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/XYZ.csv", function(error,data) {
  if (error) {
    throw error;
  }

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
  var x = d3.scaleLinear().range([0, width_horizontal_multi_bar])

  //defining linear scale for y axis
  var y = d3.scaleBand().range([height_horizontal_multi_bar, 0]).padding([0.25]);

  //providing domain values to x, y axis'
  x.domain([0, d3.max(data,function(d) { return d.value; })]);
  y.domain(groups);

  //defining a scale for subgroup positioning
  ySubgroup = d3.scaleBand().domain(subgroups).range([0, y.bandwidth()]).padding([0.05])

  //adding x axis
  svg_horizontal_multi_bar.append("g")
    .attr("transform", "translate(0," + height_horizontal_multi_bar + ")")
    .call(d3.axisBottom(x).tickSize(-height_horizontal_multi_bar*1.3).ticks())
    .select('.domain').remove();

  //adding y axis
  svg_horizontal_multi_bar.append("g")
    .call(d3.axisLeft(y).tickSize(-width_horizontal_multi_bar*1.3).ticks())
    .select('.domain').remove();

  //plotting background customization (ggplot2 styling)
  svg_horizontal_multi_bar.selectAll('.tick line').attr('stroke','white')

  //defining tooltip
  var Tooltip = d3.select("#horizontal_multi_bar_chart")
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
        .style("left", (d3.mouse(this)[0]) + "px")
        .style("top", (d3.mouse(this)[1]+100) + "px")
    }
    var mouseout = function(d) {
      Tooltip.
      style("opacity",0)
      d3.select(this)
        .style("fill", function(d) { return color(d.key); })
        .style("opacity", 1)
    }

  //adding the bars
  svg_horizontal_multi_bar.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d) { return "translate(0," + y(d.class) + ")"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .on('mouseover',mouseover) //listener for mouseover event
    .on("mousemove",mousemove) //listener for mousemove event
    .on('mouseout',mouseout) //listener for mouseout event
      .attr("height", ySubgroup.bandwidth())
      .attr("x", 0)
      .attr("y", function(d) { return ySubgroup(d.key); })
      .attr("width", function(d) { return x(d.value); })
      .attr("fill", function(d) { return color(d.key); });
})