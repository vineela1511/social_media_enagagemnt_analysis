function processGenderData(data) {
    let platformDataByGender = {};

    data.forEach(item => {
        if (!platformDataByGender[item.platform]) {
            platformDataByGender[item.platform] = { male: 0, female: 0, nonbinary: 0 };
        }
        if (item.gender === 'male') {
            platformDataByGender[item.platform].male++;
        } else if (item.gender === 'female') {
            platformDataByGender[item.platform].female++;
        } else if (item.gender === 'non-binary') {
            platformDataByGender[item.platform].nonbinary++;
        }
    });

    return platformDataByGender;
}


function plotGenderDistribution(platformDataByGender) {
    var platforms = Object.keys(platformDataByGender);
    var maleCount = platforms.map(platform => platformDataByGender[platform].male);
    var femaleCount = platforms.map(platform => platformDataByGender[platform].female);
    var nonbinaryCount = platforms.map(platform => platformDataByGender[platform].nonbinary);

    var trace1 = {
        x: platforms,
        y: maleCount,
        name: 'Male',
        type: 'bar',
        marker: { color: 'blue' },
    };

    var trace2 = {
        x: platforms,
        y: femaleCount,
        name: 'Female',
        type: 'bar',
        marker: { color: 'green' }
    };

    var trace3 = {
        x: platforms,
        y: nonbinaryCount,
        name: 'Non-binary',
        type: 'bar',
        marker: { color: 'red' }
    };

    var layout = {
      
        barmode: 'stack',
        xaxis: { title: 'Platforms' },
        yaxis: { title: 'Number of Users' }
    };

    Plotly.newPlot('stackedBarChart', [trace1, trace2, trace3], layout).then(function(){
        var svg = document.querySelector("#stackedBarChart svg");
        if(svg){
            svg.style.background = 'none';
        }
    });;
}


document.addEventListener("DOMContentLoaded", () => {
    fetchData(filename, function(fileData) {
        var data = processGenderData(fileData);
        plotGenderDistribution(data);
    });
});