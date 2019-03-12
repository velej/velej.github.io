/*
Simple Comments
*/


pre = "standardize"
c = "1.0"

url = "http://127.0.0.1:5000/" + pre + "/" + c

var width =500;
var height = 500;
var margin = {
  top : 50,
  left: 50,
  right: 50,
  bottom: 50
};

var xScale =  d3.scaleLinear()
				.domain([0,1])
				.range([margin.left,width-margin.right]);

var yScale =  d3.scaleLinear()
				.domain([0,1])
				.range([height-margin.bottom,margin.top]);

var valueline =   d3.line()
						.x(function(d) { return xScale(d.fpr); })
						.y(function(d) { return yScale(d.tpr); })
						

var svg = d3.select("body")
			.append("svg")
			.attr("width",width)
			.attr("height",height);

var xAxis = svg.append("g")
				.attr("transform",`translate(0,${height-margin.bottom})`)
				.call(d3.axisBottom().scale(xScale))
var yAxis = svg.append("g")
				.attr("transform",`translate(${margin.left},0)`)
				.call(d3.axisLeft().scale(yScale))
var yLabel= svg.append("text")
				.attr("text-anchor","middle")
				.attr("transform", "translate("+ (margin.left/2 - 10) +","+(height/2)+")rotate(-90)")
                .text("Sensitivity (True Positive Rate)") 
                .style('font-size','15px')
                  
var xLabel= svg.append("text")
				.attr("text-anchor","middle")
				.attr("transform", "translate("+ (width/2) +","+(height*.98)+")")
				.text("1 - Specificity (False Positive Rate) ")
				.style('font-size','15px')

d3.json(url, function(data) {

	console.log(data[0]);

	var data_2 =[{x:0, y:0},
				{x:1, y:1}]

	var valueline_2 =   d3.line()
						.x(function(d) { return xScale(d.x); })
						.y(function(d) { return yScale(d.y); })
						

	var line =  svg.append("path")
				    .data([data])
				    .attr("class", "line")
				    .attr("d", valueline);

	var line_2 =  svg.append("path")
				    .data([data_2])
				    .attr("class", "line")
				    .style("stroke", "red")
				    .attr("d", valueline_2);
});

// ** Update data section (Called from the onclick)

function updateData() {

	var c = document.getElementById("CValue").value;
	var pre = document.getElementById("preprocessing").value
	
	console.log(pre);
	console.log(c);

	url = "http://127.0.0.1:5000/" + pre + "/" + c
    // Get the data again
    d3.json(url, function(data) {
       	
    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
        svg.select(".line")   // change the line
            .duration(750)
            .attr("d", valueline(data));

    });
}