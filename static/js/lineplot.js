function updateLinePlot(countryName) {



    let filteredData = data.filter(function(d) {
        return d["Country Name"] === countryName;
    });


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


function updateLinePlotMultiple(countryNames) {

    if (countryNames.length === 0) {
        d3.select("#svg_line_plot").selectAll("*").remove();
        return;
    }

    const width = 900;
    const height = 300;
    const margin = {top: 30, right: 120, bottom: 50, left: 70};

    const svg = d3.select("#svg_line_plot");
    svg.selectAll("*").remove();

    svg.attr("width", width)
       .attr("height", height);

    let allLineData = countryNames.map(function(countryName) {
        let countryData = data
            .filter(d => d["Country Name"] === countryName)
            .sort((a, b) => +a.year - +b.year)
            .map(d => ({
                country: countryName,
                year: +d.year,
                value: +d[selectedIndicator]
            }))
            .filter(d => !isNaN(d.value));

        return {
            country: countryName,
            values: countryData
        };
    });

    let allValues = allLineData.flatMap(d => d.values);

    const xScale = d3.scaleLinear()
        .domain(d3.extent(allValues, d => d.year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(allValues, d => d.value))
        .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(countryNames);

    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value));

    svg.selectAll(".country-line")
        .data(allLineData)
        .enter()
        .append("path")
        .attr("class", "country-line")
        .attr("fill", "none")
        .attr("stroke", d => colorScale(d.country))
        .attr("stroke-width", 2)
        .attr("d", d => line(d.values));

    svg.selectAll(".line-label")
        .data(allLineData)
        .enter()
        .append("text")
        .attr("class", "line-label")
        .attr("x", width - margin.right + 10)
        .attr("y", function(d, i) {
            return margin.top + i * 15;
        })
        .attr("fill", d => colorScale(d.country))
        .attr("font-size", "11px")
        .text(d => d.country);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Selected countries — " + selectedIndicator);
}