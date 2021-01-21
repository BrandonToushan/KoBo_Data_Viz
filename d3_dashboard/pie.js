//setting dimensions and margins
var margin_pie = {top: 10, right: 30, bottom: 30, left: 60},
    width_pie = 500 - margin_pie.left - margin_pie.right,
    height_pie = 300 - margin_pie.top - margin_pie.bottom,
    radius_pie = Math.min(width_pie, height_pie) / 2 - 20;

//appending svg object to body
var svg_pie = d3.select('#pie_chart')
    .append('svg')
    .attr('width', width_pie + margin_pie.left + margin_pie.right)
    .attr('height', height_pie + margin_pie.top + margin_pie.bottom)
    .append('g')
    .attr('transform', 'translate(' + (width_pie / 2) +
        ',' + (height_pie / 2) + ')');

//setting background color ggplot2 styling
    svg_pie
    .append("rect")
    .attr("x",-280)
    .attr("y",-150)
    .attr('width', width_pie + margin_pie.left + margin_pie.right)
    .attr('height', height_pie + 25)
    .style("fill", "#EBEBEB")


  //defining color palette (KoBo default)
  var colors = ['#479FF6', '#6BCAD6', '#F86678', '#4B4E5E','#7B7F97','#ACAFC5','#D3D5E2','#EBEDF4']

  //defining color scale
  var color = d3.scaleOrdinal()
    .range(colors)

  //reading the data (.csv)
  var dataset_pie = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/donut_data.csv",function(error,data){
    if (error) {
      throw error;
    }

  //defining tooltip
  var Tooltip = d3.select("#pie_chart")
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
  var path = svg_pie.selectAll('arc')
    .data(pie(data))
    .enter()
    .append('path')
    .on("mouseover", mouseover) //listener for mouseover event
    .on("mousemove", mousemove) //listener for mousemove event
    .on("mouseout", mouseout) //listener for mouseout event
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius_pie)
    )
    .attr('fill', function(d){ return color(d.data.group)
    });
  })
