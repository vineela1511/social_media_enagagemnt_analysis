function updateMinAge(value) {
    document.getElementById('min-age-value').textContent = value;
    updatePlot();
}

function updateMaxAge(value) {
    document.getElementById('max-age-value').textContent = value;
    updatePlot();
}

document.getElementById("min-age").addEventListener('change', function () {
    updateMinAge(document.getElementById("min-age").value);
})

document.getElementById("max-age").addEventListener('change', function () {
    updateMaxAge(document.getElementById("max-age").value);
})

function updatePlot() {
    fetchData(filename, function (data) {
        var minAge = Number(document.getElementById('min-age').value);
        var maxAge = Number(document.getElementById('max-age').value);

        var filteredData = data.filter(row => {
            var age = Number(row.age);
            return age >= minAge && age <= maxAge;
        });

        var ageTimeData = calculateAverageTimeSpentPerAge(filteredData);
        plotLineChart(ageTimeData.ageList, ageTimeData.averageTimeSpentList);
    })
}

function calculateAverageTimeSpentPerAge(data) {
    var ageToTimeMap = {};
    var ageToCountMap = {};

    data.forEach(function (row) {
        var age = Number(row.age);
        var timeSpent = Number(row.time_spent);

        if (!ageToTimeMap.hasOwnProperty(age)) {
            ageToTimeMap[age] = 0;
            ageToCountMap[age] = 0;
        }

        ageToTimeMap[age] += timeSpent;
        ageToCountMap[age]++;
    });

    var ageList = Object.keys(ageToTimeMap).map(Number).sort((a, b) => a - b);
    var averageTimeSpentList = ageList.map(age => ageToTimeMap[age] / ageToCountMap[age]);

    return { ageList, averageTimeSpentList };
}



function plotLineChart(ageList, averageTimeSpentList) {
    const margin = {top: 50, right: 20, bottom: 50, left: 60},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

   
    d3.select("#lineplot svg").remove();

    // Create SVG element
    const svg = d3.select("#lineplot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
        .domain(d3.extent(ageList))
        .range([0, width]);

    // Add X axis
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")))
       .append("text")
       .attr("class", "axis-label") 
       .attr("x", width / 2)
       .attr("y", 40) // Adjust the position if necessary
       .attr("fill", "#000")
       .attr("text-anchor", "middle")
       .text("Age");

    const y = d3.scaleLinear()
       .domain([0, d3.max(averageTimeSpentList)])
       .range([height, 0]);
       svg.append("g")
       .call(d3.axisLeft(y));
 
       // Add Y axis
     svg.append("g")
     .call(d3.axisLeft(y))
     .append("text")
     .attr("class", "axis-label") // Add this class
     .attr("transform", "rotate(-90)")
     .attr("y", -40)
     .attr("x", -height / 2)
     .attr("fill", "#000")
     .attr("text-anchor", "middle")
     .text("Average Time Spent (hours)");

    // Define the line
    const line = d3.line()
        .x(d => x(d.age))
        .y(d => y(d.timeSpent));

    // Add the line
    svg.append("path")
        .datum(ageList.map((age, i) => ({age: age, timeSpent: averageTimeSpentList[i]})))
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Create a tooltip
    const tooltip = d3.select("#lineplot").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Tooltip mouseover event handler
    svg.selectAll(".dot")
        .data(ageList.map((age, i) => ({age: age, timeSpent: averageTimeSpentList[i]})))
      .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.age))
        .attr("cy", d => y(d.timeSpent))
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", function(event, d) {
            tooltip.transition()
              .duration(200)
              .style("opacity", .9);
            tooltip.html("Age: " + d.age + "<br/>Average Time Spent: " + d.timeSpent.toFixed(2) + " hours")
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });
}



document.addEventListener("DOMContentLoaded", () => {
    fetchData(filename, function (data) {
        var initialData = calculateAverageTimeSpentPerAge(data);
        plotLineChart(initialData.ageList, initialData.averageTimeSpentList);
    })
});
