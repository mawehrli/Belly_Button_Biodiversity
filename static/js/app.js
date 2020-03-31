// The function initializes the dropdown and the the optionChange to update all the graphs and data
function selectInit() {
    // Importing data from local json file
    // Use d3.json() to fetch data from JSON file
    // Incoming data is internally referred to as incomingData
    // Reference class exercise 15.3 #8
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;

        // Searching "names" through json file. "names" in the JSON file are the Test Subject ID numbers
        var names = data["names"];

        // Adding list of id names to dropdown menu. Dropdown menus covered in class exercises:
        // 15.2 #7, #8, and #9
        // 15.3 #2

        // Use map() method to create an array with the results of calling a function for every array element.
        // The map() method calls the provided function once for each element in an array, in order.
        // https://www.w3schools.com/jsref/jsref_map.asp

        // Generally map() method is used to iterate over an array and calling function on every element of array.
        // https://www.geeksforgeeks.org/javascript-array-map-method/
        names.map(function (testSubjectId) {
            
            // Use the d3.select() function in D3.js to select the first element that matches the specified 
            // selector string. If any element is not matched then it returns the empty selection. If multiple 
            // elements are matched with the selector then only the first matching element will be selected.
            // https://www.geeksforgeeks.org/d3-js-d3-select-function/
            
            // See class exercise 15.3 #2
            // Use D3 to select the dropdown menu
            var dropdownMenu = d3.select("#selDataset")

            // Append dropdown menu options
            dropdownMenu.append("option")
                // Test Subject ID Number
                .text(testSubjectId);
                // Associated Demographic Information
                // .property("value", testSubjectId);
        });
        // Display first Test Subject ID number (940)
        var firstId = names[0];

        // Caling functions to display first ID (940) data
        metaData(firstId);
        bar(firstId);
        bubble(firstId);
    });
};

// Function for the Demographic Info. 
function metaData(select) {
   // Importing data from local json file
    // Use d3.json() to fetch data from JSON file
    // Incoming data is internally referred to as incomingData
    // Reference class exercise 15.3 #8
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;

        // Define metaData variable
        // "metadata" in the JSON file represents demographic information
        var metaData = data["metadata"];

        //Use filter() to pass selection as an argument
        // See Class Exercise 15.3 #8
        var filterSelect = metaData.filter(data => data.id == select);

        //  Check to make sure your are filtering your movies.
        console.log(filterSelect);

        // Get the id of the metadata
        var sampleMetaData = d3.selectAll("#sample-metadata");

        // Clear any data within the sample metadata. Otherwise, the Demographic information
        // won't update when a different Test Subject ID Number is chosen
        sampleMetaData.html("");

        // Grab keys and values
        Object.entries(filterSelect[0]).forEach(([key, val]) => {
            var option = sampleMetaData.append("p");
            option.text(`${key}: ${val}`);
        })
    })
};

// Create horizontal bar chart
// Importing data from local json file
// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as incomingData
// Reference class exercise 15.3 #8
function bar(select) {
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;

        // Searching "samples" through json file. "samples" in the JSON file contain ids, otu_ids, sample_values, otu_labels
        var samples = data["samples"];

        // Use filter to pass the selection as an argument
        var filterSelect = samples.filter(data => data.id == select);

        // Define the variables
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;

        // Build the variables for the bar graph
        var barId = id;
        var barValue = value;
        var barLabel = label;

        // Sort the data array
        // Reference Class Exercise 15.3 #7 
        barValue.sort(function (a, b) {
            return parseFloat(b.sample_values) - parseFloat(a.sample_values);
        });

        // Slice the objects for plotting the top 10 UT0's
        // Reference Class Exercise 15.3 #7      
        barId = barId.slice(0, 10);
        barValue = barValue.slice(0, 10);
        barLabel = barLabel.slice(0, 10);

        // Reverse the array due to Plotly's defaults
        // Reference Class Exercise 15.3 #7 
        barId = barId.reverse();
        barValue = barValue.reverse();
        barLabel = barLabel.reverse();

        //Create empty array
        y0 = [];

        // Iterate and store in array
        // Reference Class Exercise 14.3 #3 
        Object.entries(barId).forEach(([k, v]) => {
            // Push values for OTU's into array
            y0.push(`OTU ${v}`);
        });

        // Create a trace object with the data in `y0`
        // Reference Class Exercise 15.2 #6
        // Reference Class Exercise 15.3 #7
        var trace1 = {
            x: barValue, 
            y: y0,
            text: barLabel,
            type: "bar",
            orientation: "h"
        };

        // Create variable for graph data
        var graphData = [trace1];

        // Create layout for top 10 UTO's
        var layout = {
            title: `Top 10 UTO's for ID: ${select}`
        };

        // Render the plot
        // Reference Class Exercise 15.2 #1
        Plotly.newPlot("bar", graphData, layout);
    });
};

// Create function for the Bubble chart
// https://plotly.com/javascript/bubble-charts/
// https://www.chartjs.org/docs/latest/charts/bubble.html

// Importing data from local json file
// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as incomingData
// Reference class exercise 15.3 #8
function bubble(select) {
    d3.json("./samples.json").then((incomingData) => {
        var data = incomingData;
        var samples = data["samples"];

        // Use filter() to pass selection as an argument
        var filterSelect = samples.filter(data => data.id == select);

        // Define the variables
        var id = filterSelect[0].otu_ids;
        var value = filterSelect[0].sample_values;
        var label = filterSelect[0].otu_labels;

        // Build the variables for Bubble Chart 
        var xBubble = id;
        var yBubble = value;
        var bubbleLabel = label;

        // Bubble size and shade determined by value
        var bubbleSize = value
        var bubbleColor = value;

        // Define variable trace1 for the Bubble chart data
        var trace1 = {
            x: xBubble,
            y: yBubble,
            text: bubbleLabel,
            mode: 'markers',
            marker: {
                size: bubbleSize,
                color: bubbleColor
            }
        };

        // Define variable for data
        var data = [trace1];

        // Apply layout to bubble chart
        var layout = {
            title: `Different microbial “species” (technically operational taxonomic units, OTUs) across the belly button, for sample ID: ${select}`
        };

        // Render the bubble chart
        Plotly.newPlot("bubble", data, layout)
    });
};

// Function onchange is initiated when drop down menu selection is made
// Reference line 25 in index.html: <select id="selDataset" onchange="optionChanged(this.value)"></select>
function optionChanged(select) {
    metaData(select);
    bar(select);
    bubble(select);
};

// Initialize function
selectInit();
