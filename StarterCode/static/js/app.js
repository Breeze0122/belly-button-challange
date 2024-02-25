
//console.log("Im Brissa")

//tester= document.getElementById("tester")

//plotly.newPlot(tester,[
//    {"x":[1,2,3,4],"y":[1,2,3,4]}
//])

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
  
    d3.json(url).then(data => {
            var sampleIds = data.names;
            var dropdown = d3.select("#selDataset");
            sampleIds.forEach(id => {
                dropdown.append("option").text(id).property("value", id);
            });

            var initialSample = sampleIds[0];
            //list of the fuctions running
            Charts(initialSample);
            Metadata(initialSample);
        })
        .catch(error => {
            console.error("Error reading samples.json:", error);
        });
}

function Charts(sample) {
    d3.json(url).then(data => {
            var samples = data.samples;
            var metadata = data.metadata;
            var sampleData = samples.find(obj => obj.id === sample);
            var metaData = metadata.find(obj => obj.id === parseInt(sample));

            // 2. Bar chart
            var barData = [{
                x: sampleData.sample_values.slice(0, 10).reverse(),
                y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
                text: sampleData.otu_labels.slice(0, 10).reverse(),
                type: 'bar',
                orientation: 'h'
            }];

            var barLayout = {
                title: 'Top 10 OTUs Found',
                xaxis: { title: 'Sample Values' },
                yaxis: { title: 'OTU IDs' }
            };

            Plotly.newPlot('bar', barData, barLayout);

            // 3. Bubble chart
            var bubbleData = [{
                x: sampleData.otu_ids,
                y: sampleData.sample_values,
                text: sampleData.otu_labels,
                mode: 'markers',
                marker: {
                    size: sampleData.sample_values,
                    color: sampleData.otu_ids,
                    colorscale: 'Earth'
                }
            }];

            var bubbleLayout = {
                title: 'Bacteria Cultures per Sample',
                xaxis: { title: 'OTU ID' },
                yaxis: { title: 'Sample Values' }
            };

            Plotly.newPlot('bubble', bubbleData, bubbleLayout);

            // 4. Metadata
            var metadataPanel = d3.select('#sample-metadata');
            metadataPanel.html('');
            Object.entries(metaData).forEach(([key, value]) => {
                metadataPanel.append('p').text(`${key}: ${value}`);
            });
        })
        .catch(error => {
            console.error("Error building charts:", error);
        });
}


// 6. gauge chart
function buildGaugeChart(sampleref) {
    d3.json(url).then(data => {
    var metadata = data.metadata;
    var sampleref= metadata.find(obj => obj.id == newSample).wfreq;
    var level = sampleref * 20;
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    var mainPath = 'M -.0 -0.05 L .0 0.05 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
        type: 'scatter',
        x: [0],
        y: [0],
        marker: { size: 28, color: '850000' },
        showlegend: false,
        name: 'Freq',
        text: level,
        hoverinfo: 'text+name'
    },
    {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6',
            '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: [
            ]
        },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: { color: '850000' }
        }],
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        height: 450,
        width: 450,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        }
    };

    Plotly.newPlot('gauge', data, layout);
    })}




// This fuction is to choose the new example to update the
function optionChanged(newSample) {
    console.log("Selection:" ,newSample);
    Charts(newSample);
    Metadata(newSample);
    buildGaugeChart(sampleref);
}





//run the dashboard
init();