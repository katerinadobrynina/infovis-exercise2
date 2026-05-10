console.log("lineplot.js loaded");

function updateLinePlot(countryName) {

    console.log("updateLinePlot called for:", countryName);

    let filteredData = data.filter(function(d) {
        return d["Country Name"] === countryName;
    });

    console.log("filteredData:", filteredData);

    filteredData.sort(function(a, b) {
        return +a.year - +b.year;
    });

    let lineData = filteredData.map(function(d) {
        return {
            year: +d.year,
            value: +d[selectedIndicator]
        };
    }).filter(d => !isNaN(d.value));

    const width = 900;
    const height = 300;

    const margin = {
        top: 30,
        right: 30,
        bottom: 50,
        left: 70
    };

    const svg = d3.select("#svg_line_plot");

    svg.selectAll("*").remove();

    svg.attr("width", width)
   .attr("height", height);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(lineData, d => d.year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(lineData, d => d.value))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value));

    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(countryName + " — " + selectedIndicator);
}