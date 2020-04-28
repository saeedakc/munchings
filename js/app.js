//----------------------------------------------
// Choropleth begin
//----------------------------------------------

// state boundaries geojson
var stateURL = "../data/states.json"
var medIncome;
var foodAvai;
var foodCons;

var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 8
});

d3.json(stateURL, function(error, stateData) {
  if (error) throw error;
  //console.log(stateData.features);

    // Once we get a response, send the data.features object to the createFeatures function
    stateFeatures(stateData.features);
  });

  function stateFeatures(stateData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.NAME + "</h3>")
    }

var statelines = L.geoJson(stateData, {
  onEachFeature: onEachFeature,
  pointToLayer : function(latlng) {
    return L.polygon(features.geometry.coordinates);
  }
});
createMap(statelines);


//mouseover events
function resetHighlightInc(e) {
  medIncome.resetStyle(e.target);
  info.update();
};

function resetHighlightAvai(e) {
  foodAvai.resetStyle(e.target);
  info.update();
};

function resetHighlightCons(e) {
  foodCons.resetStyle(e.target);
  info.update();
};

function onEachFeatureInc(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlightInc
  });
  layer.bindPopup('<h3>' + feature.properties.NAME + '</h3>');
};

function onEachFeatureCons(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlightCons
  });
  layer.bindPopup('<h3>' + feature.properties.NAME + '</h3>');
};

function onEachFeatureAvai(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlightAvai
  });
  layer.bindPopup('<h3>' + feature.properties.NAME + '</h3>');
};

// data from flask server
var medIncomeURL = "/medIncome";
var foodAvailURL = "/foodAvail";
var foodConsURL = "/vegCons";

d3.json(medIncomeURL, function(income_data) {
  for (i=0; i < data.features.length; i++) {
    Object.defineProperties(income_data).forEach(([key,value]) => {
      if (key == data.features[i].properties.NAME) {
        data.features[i].properties.INCOME = value;
      };
    });
  };

d3.json(foodAvailURL, function(avail_data) {
  for (i=0; i < data.features.length; i++) {
    Object.defineProperties(avail_data).forEach(([key,value]) => {
      if (key == data.features[i].properties.NAME) {
        data.features[i].properties.AVAILABILITY = value;
      };
    });
  };

  d3.json(foodConsURL, function(consum_data) {
    for (i=0; i < data.features.length; i++) {
      Object.defineProperties(consum_data).forEach(([key,value]) => {
        if (key == data.features[i].properties.NAME) {
          data.features[i].properties.CONSUMPTION = value;
        };
      });
    };

    json_medIncome = L.choropleth(data, {
      valueProperty: "INCOME",
      scale: ['#ECE2F0', '#1C9099'],
      steps: 5,
      // q for quartile, e for equideistant, k for k-means
      mode: 'q',
      style: {
        color: '#000',
        weight: 1,
        fillOpacity: 0.75
      },
      onEachFeature: onEachFeatureInc
    });

    json_foodAvai = L.choropleth(data, {
      valueProperty: "FOOD AVAILABILITY",
      scale: ['#FDE0DD', '#C51B8A'],
      steps: 5,
      // q for quartile, e for equideistant, k for k-means
      mode: 'q',
      style: {
        color: '#000',
        weight: 1,
        fillOpacity: 0.75
      },
      onEachFeature: onEachFeatureAvai
    });

    json_foodCons = L.choropleth(data, {
      valueProperty: "VEG CONSUMPTION",
      scale: ['#F7FCB9', '#31A354'],
      steps: 5,
      // q for quartile, e for equideistant, k for k-means
      mode: 'q',
      style: {
        color: '#000',
        weight: 1,
        fillOpacity: 0.75
      },
      onEachFeature: onEachFeatureCons

    }).addTo(myMap);


  // Define streetmap and darkmap layers
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  })

  var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  })

    // Define a baseMaps object to hold our base layers
    var baseMaps = {"Satelite Map": satelitemap,
    "Dark Map": darkMap};

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      MedianIncome: medIncome,
      FoodAvailability: foodAvail,
      VegConsumption: vegCons
    };


      // div object will be located in top right corner and have additional info

      info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    info.update = function(props) {
        this._div.innerHTML = '<h4>State Info</h4>' + (props ?
            '<b>' + props.STATE + '</b><br />Median Income: $' + props.INCOME + '<br>Food Availability:' + (props.FoodAvailability).toFixed(2) + '%' + '<br>Vegetable Consumption:' + props.FoodConsumption :
            'Hover over a state');
    };

    info.addTo(myMap);



    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, { collapsed: false, position: 'bottomright' }).addTo(myMap);
});
});
});
};



//---------------------------------------------
// End Choropleth; begin bar chart
//---------------------------------------------


// Set up our chart
var svgWidth = innerWidth - 250;
var svgHeight = innerHeight;

var margin = {
  top: 50,
  right: 50,
  bottom: 120,
  left: 120
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#barchart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .classed("chart", true);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data
d3.csv("/foodTable").then(function(foodTable) {

  // Format the data
  foodTable.forEach(function(data) {
    data.food_group;
    data.at_home = +data.at_home;
    data.away_home = +data.away_home;
  });

  var barSpacing = 10; // desired space between each bar

  // Create a 'barWidth' variable so that the bar chart spans the entire chartWidth.
  var barWidth = (chartWidth - (barSpacing * (food_group.length - 1))) / food_group.length;

  // Create code to build the bar chart using the tvData.
  chartGroup.selectAll(".bar")
    .data(foodTable)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", d => barWidth)
    .attr("height", d => d.at_home + d.away_home)
    .attr("x", (d, i) => i * (barWidth + barSpacing))
    .attr("y", d => chartHeight - d.at_home + d.away_home);
}).catch(function(error) {
  console.log(error);
});

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(d => (`Food Group: ${d.food_group}<br>Consumed at Home: ${d.at_home} <br>Consumed Away from Home: ${d.away_home}`));

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    chartGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2)-50)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Food Group");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2 - 50}, ${height + margin.top + 10})`)
      .attr("class", "axisText")
      .text("Food Consumption");







//-----------------------------------------------
// End stacked bar chart; begin line charts
//-----------------------------------------------






var communityURL = "/comcon"

d3.json(communityURL).then(function(data) {
  // Grab values from the response json object to build the plots
  var foodGroup = data.dataset.food;
  var year = data.dataset.year;

  var dates = data.dataset.data.map(row => row[0]);
  // console.log(dates);
  var items = data.dataset.data.map(row => row[4]);
  // console.log(closingPrices);

  var trace1 = {
    type: "line",
    mode: "lines",
    name: foodGroup,
    x: year,
    y: items,
    line: {
      color: "#17BECF"
    }
  };

  var data = [trace1];

  var layout = {
    title: `${stock} Consumption Survey Totals`,
    xaxis: {
      range: [year],
      type: "date"
    },
    yaxis: {
      autorange: true,
      type: "linear"
    }
  };

  Plotly.newPlot("lineplot", data, layout);

  // hover code from 
  // https://observablehq.com/@d3/multi-line-chart

  function hover(svg, path) {
  
    if ("ontouchstart" in document) svg
        .style("-webkit-tap-highlight-color", "transparent")
        .on("touchmove", moved)
        .on("touchstart", entered)
        .on("touchend", left)
    else svg
        .on("mousemove", moved)
        .on("mouseenter", entered)
        .on("mouseleave", left);
  
    const dot = svg.append("g")
        .attr("display", "none");
  
    dot.append("circle")
        .attr("r", 2.5);
  
    dot.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", -8);
  
    function moved() {
      d3.event.preventDefault();
      const ym = y.invert(d3.event.layerY);
      const xm = x.invert(d3.event.layerX);
      const i1 = d3.bisectLeft(data.dates, xm, 1);
      const i0 = i1 - 1;
      const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
      const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
      path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
      dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
      dot.select("text").text(s.name);
    }
  
    function entered() {
      path.style("mix-blend-mode", null).attr("stroke", "#ddd");
      dot.attr("display", null);
    }
  
    function left() {
      path.style("mix-blend-mode", "multiply").attr("stroke", null);
      dot.attr("display", "none");
    }
  }

  svg.call(hover, path);

});
