function calculateIncomeCount(data) {
    data.sort((a, b) => parseFloat(b.income) - parseFloat(a.income));

    var topTenPercent = Math.floor(data.length * 0.1) - 1;
    var bottomTenPercent = Math.ceil(data.length * 0.9) - 1;

    var highIncomeData = data.slice(0, topTenPercent + 1);
    var lowIncomeData = data.slice(bottomTenPercent);

    var highIncomePlatforms = countPlatforms(highIncomeData);
    var lowIncomePlatforms = countPlatforms(lowIncomeData);

    return {highIncomePlatforms, lowIncomePlatforms}
}

function countPlatforms(incomeData) {
    return incomeData.reduce((account, current) => {
        account[current.platform] = (account[current.platform] || 0) + 1;
        return account;
    }, {});
}


function plotPieChart(highIncomePlatforms, lowIncomePlatforms) {
    var trace1 = {
        labels: Object.keys(lowIncomePlatforms),
        values: Object.values(lowIncomePlatforms),
        type: 'pie',
        name: 'Low Income',
        domain: { x: [0, 0.5] },
        hoverinfo: 'label+percent'
    };

    var trace2 = {
        labels: Object.keys(highIncomePlatforms),
        values: Object.values(highIncomePlatforms),
        type: 'pie',
        name: 'High Income',
        domain: { x: [0.5, 1.0] },
        hoverinfo: 'label+percent'
    };

    var layout = {
      
        annotations: [
            {
                font: { size: 16 },
                showarrow: false,
                text: 'Low Income',
                x: 0.05,
                y: 0.5
            },
            {
                font: { size: 16 },
                showarrow: false,
                text: 'High Income',
                x: 0.58,
                y: 0.5
            }
        ]
    };

    Plotly.newPlot('piechart', [trace1, trace2], layout).then(function(){
        var svg = document.querySelector("#piechart svg");
        if(svg){
            svg.style.background = 'none';
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchData(filename, function(data) {
        data = calculateIncomeCount(data);
        plotPieChart(data.highIncomePlatforms, data.lowIncomePlatforms)

    })
});
