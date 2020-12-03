//setting dimensions and margins
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2 - 20;

//appending svg object to body
var svg = d3.select('#donut')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

//setting background color ggplot2 styling
    svg
    .append("rect")
    .attr("x",-280)
    .attr("y",-150)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + 25)
    .style("fill", "#EBEBEB")

  //creating dummy data
  var data = {a: 9, b: 20, c:30, d:8, e:12}

  //defining color palette (KoBo default)
  var colors = ["#5e88d3","#fd6f96","#fbdd83","#8eeb55","#73d6ff","#fecb72","#7197f6","#56ecc7"]

  //defining color scale
  var color = d3.scaleOrdinal()
    .range(colors)

  //reading the data (.csv)
  var dataset = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/donut_data.csv",function(error,data){
    if (error) {
      throw error;
    }

  //defining tooltip
  var Tooltip = d3.select("#donut")
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
    Tooltip
    .style("opacity",1)
    d3.select(this)
    .style("fill", "#414453")
    .style("opacity",1)
  }
  var mousemove = function(d) {
    Tooltip
    .html(d.data.group + "</br>" + d.value)
    .style("left", (d3.mouse(this)[0] + 100) + "px")
    .style("top", (d3.mouse(this)[1] + 100) + "px")
  }
  var mouseout = function(d) {
    Tooltip.
    style("opacity",0)
    d3.select(this)
    .style("fill", function(d) { return color(d.data.group); })
    .style("opacity",1)
  }

  //defining position of each group on the pie
  var pie = d3.pie()
    .value(function(d) { return d.value; });

  //building donut
  var path = svg.selectAll('arc')
    .data(pie(data))
    .enter()
    .append('path')
    .on("mouseover", mouseover) //listener for mouseover event
    .on("mousemove", mousemove) //listener for mousemove event
    .on("mouseout", mouseout) //listener for mouseout event
    .attr('d', d3.arc()
      .innerRadius(50)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return color(d.data.group)
    });
  })
