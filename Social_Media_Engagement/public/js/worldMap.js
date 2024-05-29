function getCountryData(data) {
    let platformDataByCountry = {};

    data.forEach(row => {
        if (!platformDataByCountry[row.location]) {
            platformDataByCountry[row.location] = { hours: 0, count: 0, platforms: {} };
        }
        platformDataByCountry[row.location].hours += Number(row.time_spent);
        platformDataByCountry[row.location].count++;
        if (platformDataByCountry[row.location].platforms[row.platform]) {
            platformDataByCountry[row.location].platforms[row.platform]++;
        } else {
            platformDataByCountry[row.location].platforms[row.platform] = 1;
        }
    });

    return platformDataByCountry;
}


function calculatePlotData(platformDataByCountry) {
    var countries = Object.keys(platformDataByCountry);
    var values = [];
    var hoverText = [];
    var locations = [];

    countries.forEach(country => {
        var avgTime = platformDataByCountry[country].hours / platformDataByCountry[country].count;
        var platforms = platformDataByCountry[country].platforms;
        var mostPopularPlatform = Object.keys(platforms).reduce((a, b) => platforms[a] > platforms[b] ? a : b);

        values.push(avgTime);
        hoverText.push(`${country}: ${avgTime.toFixed(2)} hours on ${mostPopularPlatform}`);
        locations.push(country);
    });

    return { locations, values, hoverText };
}



function plotWorldMap(locations, values, hoverText) {
    var trace = {
        type: 'choropleth',
        locationmode: 'country names',
        locations: locations,
        z: values,
        text: hoverText,
        autocolorscale: false,
        colorscale: 'Viridis'
    };

    var layout = {
       
        geo: {
            projection: {
                type: 'robinson'
            }
        }
    };

    Plotly.newPlot('worldmap', [trace], layout).then(function(){
        var svg = document.querySelector("#worldmap svg");
        if(svg){
            svg.style.background = 'none';
        }
    });;
}


document.addEventListener("DOMContentLoaded", () => {
    fetchData(filename, function(fileData) {
        let processedData = getCountryData(fileData);
        let plotDataPrep = calculatePlotData(processedData);
        console.log(plotDataPrep)
        plotWorldMap(plotDataPrep.locations, plotDataPrep.values, plotDataPrep.hoverText);
    });
});
