function cleanName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, "_");
}

function initScatterplot() {
    const svg = d3.select("#svg_plot");

    const width = 500;
    const height = 500;
    const margin = {top: 30, right: 30, bottom: 50, left: 60};

    svg.attr("width", width)
       .attr("height", height);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(pcaData, d => d.x))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(pcaData, d => d.y))
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    svg.selectAll(".pca-dot")
        .data(pcaData)
        .enter()
        .append("circle")
        .attr("class", d => "pca-dot dot-" + cleanName(d.country))
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {
    d3.select(this)
        .attr("r", 9)
        .attr("fill", "orange");

    d3.select(".country-" + cleanName(d.country))
        .attr("stroke-width", 2)
        .attr("stroke", "blue");
})
.on("mouseout", function(event, d) {
    d3.select(this)
        .attr("r", 5)
        .attr("fill", "steelblue");

    d3.select(".country-" + cleanName(d.country))
        .attr("stroke-width", 0.5)
        .attr("stroke", "black");
});

    svg.selectAll(".pca-label")
        .data(pcaData)
        .enter()
        .append("text")
        .attr("class", "pca-label")
        .attr("x", d => xScale(d.x) + 7)
        .attr("y", d => yScale(d.y) + 4)
        .text(d => d.country)
        .attr("font-size", "10px");
}