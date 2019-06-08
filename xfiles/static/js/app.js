//-------------------------------------------
// David Kloepper
// Data Visualization Bootcamp, Cohort 3
// June 8th, 2019
//-------------------------------------------


// from data.js
var ufoData = data;

//JQuery; On document ready, looks for each dropdown input, and based on id value, returns a 
// distinct list of values from the data and passes it to a function to populate the dropdown elements
$(document).ready(function() { 
    d3.selectAll(".dropdown").each(function(){
        element = d3.select("#" + this.id);
        let distinctList = [...new Set(ufoData.map(sighting => sighting[this.id]))];
        //Sort list alphabetically, rather than order read
        distinctList.sort();
        //Call function to populate dropdown
        populateDropdown(element, distinctList);
    });
});

//Function called from document ready. Takes as input the d3 element and an array of unique elements
// for input into a dropdown list
function populateDropdown (element, elements) {
    
    for (let i = 0; i < elements.length; ++i) {
        var opt = elements[i];
        //Append <option> tags with text and value from array element
        var el = element.append("option")
            .text(opt)
            .attr("value", opt);
    }
}

// Function called from filter button onclick. Loops through values in the dropdown fields and 
// and uses them to create a filtered dataset. Function returns the filtered dataset
function filterSightingData(sightingData) {

    //Initialize object to contain filters
    let filterList = {};

    //Reg Ex to check text value of input
    var re = new RegExp("No Selection");

    //Select all drop downs, and for each one, check if there is a value
    d3.selectAll(".dropdown").each(function(){
        if (this.value === undefined || this.value === "" || re.test(this.value)) {
            // do nothing
        } else {
            //if legit value exists, add it to the filter object
            let itemName = this.id;
            filterList[itemName] = this.value;
        }
    });

    //For each key/value in the filter object, use it as a filter against the dataset
    let filteredSightingData = sightingData.filter(function(item) {
        for (var key in filterList) {
          if (item[key] === undefined || item[key] != filterList[key])
            return false;
        }
        return true;
      });

    return filteredSightingData;
}

//On filter button click, calls function to generate filtered dataset, then populates the HTML
// table with the filtered results
var filterBtn = d3.select("#filter-btn");
filterBtn.on("click", function() {

    //Prevent page refresh
    d3.event.preventDefault();

    //Call function to return filtered data
    let filteredUfoData = filterSightingData(ufoData);

    //Select the table body and empty any existing HTML within the table
    var ufoTable = d3.select("tbody");
    ufoTable.html("");

    //Loop through the filtered data and populate table rows and cells
    filteredUfoData.forEach((ufoSighting) => {
        var row = ufoTable.append("tr");
        Object.entries(ufoSighting).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
        });
    });

});

//On reset button click, loop through the dropdown form fields and reset their value
// to a default of "No Selection"
var resetBtn = d3.select("#reset-btn");
resetBtn.on("click", function() {

    //Prevent page refresh
    d3.event.preventDefault();

    //Set the value of each dropdown to default
    d3.selectAll(".dropdown").each(function(){
        d3.select("#" + this.id).property("value", "No Selection");
    });
});