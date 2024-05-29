const filename = 'data/Social_Media_analysis.csv';

function fetchData(url, successCallback) {
    d3.csv(url)
        .then(data => successCallback(data));
}
