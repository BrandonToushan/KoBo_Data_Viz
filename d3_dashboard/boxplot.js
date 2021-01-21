//setting dimensions and margins
var margin_boxplot = {top: 10, right: 30, bottom: 30, left: 60},
    width_boxplot = 500 - margin_boxplot.left - margin_boxplot.right,
    height_boxplot = 300 - margin_boxplot.top - margin_boxplot.bottom;

//appending the svg object to the body of the page
var svg_boxplot = d3.select("#boxplot_chart")
  .append("svg")
    .attr("width", width_boxplot + margin_boxplot.left + margin_boxplot.right)
    .attr("height", height_boxplot + margin_boxplot.top + margin_boxplot.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_boxplot.left + "," + margin_boxplot.top + ")");

//setting background color (ggplot2 styling)
      svg_boxplot
      .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("height", height_boxplot)
      .attr("width", width_boxplot + 10)
      .style("fill", "#EBEBEB")

// Read the data and compute summary statistics for each specie
d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/covid_data_updated.csv", function(data) {

  //extracting groups
  var groups = d3.map(data, function(d) { return(d.Continent) }).keys()

  //defining color palette (KoBo default)
  //var colors = ["#5e88d3","#fd6f96","#fbdd83","#8eeb55","#73d6ff","#fecb72","#7197f6","#56ecc7"]

  //defining alternate color palette (re Ignacio)
  var colors = ['#479FF6', '#6BCAD6', '#F86678', '#4B4E5E','#7B7F97','#ACAFC5','#D3D5E2','#EBEDF4']

  //defining color scale
  var color = d3.scaleOrdinal()
    .domain(groups)
    .range(colors)

  //computing quartiles, median and inter quantile range min/max
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Continent; })
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.Hospital_beds_per_1000_people; }).sort(d3.ascending),.25) //1st quartile
      median = d3.quantile(d.map(function(g) { return g.Hospital_beds_per_1000_people; }).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.Hospital_beds_per_1000_people; }).sort(d3.ascending),.75) //3rd quartile
      interQuantileRange = q3 - q1
      min = q1 - 1 * interQuantileRange
      max = q3 + 1 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data)

  //defining discrete band scale for x axis
  var xScale = d3.scaleBand().range([ 0, width_boxplot ])
    .paddingInner(1)
    .paddingOuter(.5)

  //defining linear scale for y axis
  var yScale = d3.scaleLinear().range([height_boxplot, 0])

  //providing domain values to x & y scales
  xScale.domain(groups)

  yScale.domain(d3.extent(data, function (d) {
      return d.Hospital_beds_per_1000_people;
  }));

  //appending x axis to svg
  svg_boxplot.append("g")
    .attr("transform", "translate(0," + height_boxplot + ")")
    .call(d3.axisBottom(xScale).tickSize(-height_boxplot*1.3).ticks(8))
    .select('.domain').remove();

  //appending y axis to svg
  svg_boxplot.append("g")
  .call(d3.axisLeft(yScale).tickSize(-width_boxplot*1.3).ticks(6))
  .select('.domain').remove();

  //customizing plot background (ggplot2 styling)
  svg_boxplot.selectAll('.tick line').attr('stroke','white')

  //appending main vertical line
  svg_boxplot
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d) { return xScale(d.key); })
      .attr("x2", function(d) { return xScale(d.key); })
      .attr("y1", function(d) { return yScale(d.value.min); })
      .attr("y2", function(d) { return yScale(d.value.max); })
      .attr("stroke", "black")
      .style("width", 40)

  //appending main boxes
  var boxWidth = 50
  svg_boxplot
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){ return xScale(d.key)-boxWidth/2; })
        .attr("y", function(d){ return yScale(d.value.q3); })
        .attr("height", function(d){ return yScale(d.value.q1)-yScale(d.value.q3); })
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", function (d) { return color(d.key); })

  //appending medians
  svg_boxplot
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){ return xScale(d.key)-boxWidth/2; })
      .attr("x2", function(d){ return xScale(d.key)+boxWidth/2; })
      .attr("y1", function(d){ return yScale(d.value.median); })
      .attr("y2", function(d){ return yScale(d.value.median); })
      .attr("stroke", "black")
      .style("width", 80)

  //adding individual points
  //var jitterWidth = 2.5
  //svg
  //.selectAll("indPoints")
  //.data(data)
  //.enter()
  //.append("circle")
    //.attr("cx", function(d){ return xScale(d.Continent) - jitterWidth/2 + Math.random()*jitterWidth; })
    //.attr("cy", function(d){ return yScale(d.Hospital_beds_per_1000_people); })
    //.attr("r", 4)
    //.style("fill", function (d) { return color(d.Continent) } )
    //.attr("stroke", "black")
  })
