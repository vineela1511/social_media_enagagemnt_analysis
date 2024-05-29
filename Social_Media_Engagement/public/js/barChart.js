function getAvgTimePerPlatform(data, platformFilter) {
    let professionData = {};

    data.forEach(item => {
        if (!platformFilter || item.platform === platformFilter) {
            if (!professionData[item.profession]) {
                professionData[item.profession] = { total: 0, count: 0 };
            }
            professionData[item.profession].total += Number(item.time_spent);
            professionData[item.profession].count++;
        }
    });

    return Object.keys(professionData).map(profession => ({
        profession,
        avgTime: professionData[profession].total / professionData[profession].count
    }));
}

function plotBarChart(professionData) {
    const margin = {top: 60, right: 30, bottom: 120, left: 60},  // Increased bottom margin
          width = 860 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Remove any existing SVG to avoid overlaps
    d3.select("#barchart svg").remove();

    // Create SVG and center it in the div
    const svg = d3.select("#barchart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

  

   // svg.append(dropdown);

    // X axis
    const x = d3.scaleBand()
      .range([0, width])
      .domain(professionData.map(d => d.profession))
      .padding(0.2);

    // Append and style x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "14px");  // Increased font size for axis labels

    // Label for x-axis
    svg.append("g")
    .append("text")
        .attr("x", width / 2)
        .attr("y", height + 90)  // Lowered the x-axis label
        .attr("class", "axis-label")
        .style("text-anchor", "middle")
        .attr("class", "axis-label") 
        .text("Profession");

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(professionData, d => d.avgTime)])
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

    // Tooltip for bar hover
    const tooltip = d3.select("#tooltip");

    svg.selectAll(".bar")
      .data(professionData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.profession))
        .attr("y", d => y(d.avgTime))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.avgTime))
        .attr("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            tooltip.transition()
              .duration(200)
              .style("opacity", 1);
            tooltip.html("Profession: " + d.profession + "<br/>Average Time: " + d.avgTime.toFixed(2) + " hours")
              .style("left", (event.pageX - 50) + "px")  // Center tooltip on the bar
              .style("top", (event.pageY - 40) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX - 50) + "px")  // Keep tooltip in the center of the bar
              .style("top", (event.pageY - 40) + "px");
        })
        .on("mouseleave", function(event, d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
        });
}



document.addEventListener("DOMContentLoaded", () => {
    fetchData(filename, function(fileData) {
        var data = getAvgTimePerPlatform(fileData);
        plotBarChart(data);

        var platforms = [...new Set(fileData.map(item => item.platform))];
        var dropdown = document.createElement('select');
        dropdown.id = "platform";
        dropdown.innerHTML = `<option value="">All</option>`;
        platforms.forEach(platform => {
            var option = document.createElement('option');
            option.value = platform;
            option.textContent = platform;
            dropdown.appendChild(option);
        });
        document.getElementById('dropdown').appendChild(dropdown);

        document.getElementById('platform').addEventListener('change', function() {
            var selectedPlatform = this.value;
            var filteredData = getAvgTimePerPlatform(fileData, selectedPlatform);
            plotBarChart(filteredData);
        });
    });
});