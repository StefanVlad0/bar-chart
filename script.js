let width;

if (screen.width > 900) {
  width = 750;
} else {
  width = screen.width - screen.width / 5;
  console.log(width);
}

let height = width / 2;

let svgContainer = d3
  .select(".visHolder")
  .append("svg")
  .attr("width", width + width / 8)
  .attr("height", height + (height * 60) / 400);

document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((response) => response.json())
    .then((data) => {
      let barWidth = width / data.data.length;

      let yearsDate = data.data.map(function (item) {
        return new Date(item[0]);
      });

      let years = data.data.map(function (item) {
        let quarter;
        let temp = item[0].substring(5, 7);

        switch (temp) {
          case "01":
            quarter = "Q1";
            break;
          case "04":
            quarter = "Q2";
            break;
          case "07":
            quarter = "Q3";
            break;
          case "10":
            quarter = "Q4";
            break;
          default:
            quarter = "";
            break;
        }

        return item[0].substring(0, 4) + " " + quarter;
      });

      let xScale = d3
        .scaleTime()
        .domain([d3.min(yearsDate), d3.max(yearsDate)])
        .range([0, width]);

      let GDP = data.data.map(function (item) {
        return item[1];
      });

      let yScale = d3
        .scaleLinear()
        .domain([0, d3.max(GDP)])
        .range([0, height]);

      let scaledGDP = GDP.map(function (item) {
        return yScale(item);
      });

      let xAxis = d3.axisBottom().scale(xScale);

      var yAxis = d3.axisLeft(
        d3
          .scaleLinear()
          .domain([0, d3.max(GDP)])
          .range([height, 0])
      );

      let tooltip = d3
        .select(".visHolder")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

      d3.select("svg")
        .selectAll("rect")
        .data(scaledGDP)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return xScale(yearsDate[i]);
        })
        .attr("y", function (d) {
          return height - d;
        })
        .attr("width", barWidth)
        .attr("height", function (d) {
          return d;
        })
        .attr("class", "bar")
        .attr("transform", "translate(" + (width * 60) / 800 + ", 0)")
        .attr("data-date", function (d, i) {
          return data.data[i][0];
        })
        .attr("data-gdp", function (d, i) {
          return data.data[i][1];
        })
        .attr("index", (d, i) => i)
        .on("mouseover", function (event, d) {
          var i = this.getAttribute("index");
          let currentGDP = data.data[i][1];
          tooltip.transition().duration(200).style("opacity", 0.9);

          var xPosition = xScale(yearsDate[i]) + 90;
          var yPosition = height - 80;

          tooltip
            .html(years[i] + "<br>$" + currentGDP.toFixed(1) + " Billion")
            .attr("data-date", data.data[i][0])
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");
          console.log(event.pageX);
        })

        .on("mouseout", function () {
          tooltip.transition().duration(500).style("opacity", 0);
        });

      svgContainer
        .append("g")
        .attr("id", "x-axis")
        .attr(
          "transform",
          "translate(" + (width * 60) / 800 + "," + height + ")"
        )
        .call(xAxis);
      svgContainer
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + (width * 60) / 800 + ",0)")
        .call(yAxis);
    });
});
