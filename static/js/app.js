// Make an HTTP request to fetch the JSON file
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch data and console log it
d3.json(url).then(function(data) {
  console.log(data);

  // Add event listener to dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  // Use D3 to populate the dropdown selector
  dropdownMenu.on("change", function() {
    var selectedSample = dropdownMenu.property("value");
    optionChanged(selectedSample);
  });

  function populateDropdown() {
    // Set variable for names
    let names = data.names;

    // Add names to the dropdown menu
    names.forEach(function(id) {
      dropdownMenu
        .append("option")
        .text(id)
        .property("value", id);
    });

  }

  // Call the function to populate the dropdown menu
  populateDropdown();

  // Function to handle the change event of the dropdown menu
  function optionChanged(selectedSample) {
    // Retrieve data for the selected sample
    let selectedData = data.samples.find(sample => sample.id === selectedSample);
    let selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedSample));

    // Extract values for the charts
    let sampleValues = selectedData.sample_values.slice(0, 10).reverse();
    let otuIDs = selectedData.otu_ids.slice(0, 10).reverse();
    let otuLabels = selectedData.otu_labels.slice(0, 10).reverse();

    // Update the metadata display
    displayMetadata(selectedMetadata);

    // Update the bar chart
    updateBarChart(sampleValues, otuIDs, otuLabels);

    // Update the bubble chart
    updateBubbleChart(sampleValues, otuIDs, otuLabels);
  }

  function processData(data) {
    var sampleData = data.samples[0];
    var metadata = data.metadata[0];
    var sampleValues = sampleData.sample_values.slice(0, 10).reverse();
    var otuIDs = sampleData.otu_ids.slice(0, 10).reverse();
    var otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

    // Update the metadata display
    displayMetadata(metadata);

    // Update the bar chart
    updateBarChart(sampleValues, otuIDs, otuLabels);

    // Update the bubble chart
    updateBubbleChart(sampleValues, otuIDs, otuLabels);
  }

  // Set trace for bar chart
  function updateBarChart(sampleValues, otuIDs, otuLabels) {
    let trace = {
      x: sampleValues,
      y: otuIDs.map(id => `OTU ${id}`),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    let data = [trace];

    let layout = {
      title: "Top 10 OTUs present",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", data, layout);
  };

  // Set trace for bubble chart
  function updateBubbleChart(sampleValues, otuIDs, otuLabels) {
    let trace1 = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIDs,
        colorscale: "Blues"
      }
    };

    // Set the layout for the bubble chart
    let layout = {
      title: "Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    // Use Plotly to plot the bubble chart
    Plotly.newPlot("bubble", [trace1], layout);
  }

  function displayMetadata(metadata) {
    var metadataPanel = d3.select("#sample-metadata");

    metadataPanel.html(""); // Clear previous metadata

    // Loop through each key-value pair in the metadata object
    Object.entries(metadata).forEach(([key, value]) => {
      // Append a new paragraph with the key-value pair
      metadataPanel
        .append("p")
        .text(`${key}: ${value}`);
    });
  }

}).catch(function(error) {
  // Handle any errors that occur during the request
  console.log(error);
});
