let data, domain, oldNodes;
function MatrixInit(){
    let margin = {top: 100, right: 0, bottom: 10, left: 100},
        width = 400,
        height = 400;
    let svg = d3.select(".Matrix")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .style('fill', '#eee');
    domain = d3.range(50);
}
function drawMatrix(nodes, edges){
    let margin = {top: 100, right: 0, bottom: 10, left: 100},
        width = 400,
        height = 400;
    let x = d3.scaleBand().range([0, width]),
        z = d3.scaleLinear(),
        c = d3.scaleOrdinal().domain([d3.range(10)]).range(d3.schemeCategory10);
    let svg = d3.select(".Matrix g");
    let matrix = [],
        n = nodes.length;

    // Compute index per node.
    if(typeof(oldNodes) != "undefined"){
        for(let i = 0; i < 50; i++){
            for(let j = 0; j < 50; j++)
            if(nodes[j]['name'] == oldNodes[i]['name']){
                let tmp = nodes[j];
                nodes[j] = nodes[i];
                nodes[i] = tmp;
            }
        }
    }
   console.log(nodes);
    oldNodes = nodes;
    nodes.forEach(function(node, i) {
        node.index = i;
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
    });

    // Convert links to matrix; count character occurrences.
    edges.forEach(function(link) {
        matrix[link.source][link.target].z += link.cnt;
        matrix[link.target][link.source].z += link.cnt;
        matrix[link.source][link.source].z += link.cnt;
        matrix[link.target][link.target].z += link.cnt;
    });

    // Precompute the orders.
    let orders = {
        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
        count: d3.range(n).sort(function(a, b) { return nodes[b].cnt - nodes[a].cnt; }),
        group: d3.range(n).sort(function(a, b) {
            if(nodes[a].group == nodes[b].group)
                return nodes[b].cnt - nodes[a].cnt;
            return nodes[a].group - nodes[b].group
        })
    };
    
    // The default sort order.
    x.domain(domain);
    z.domain([0, d3.max(edges.map(d=>d['cnt']))]).clamp(true);

    let row = svg.selectAll(".row")
        .data(matrix)
        .join(enter=>enter.append("g").attr("class", "row"))
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .each(Row);

    row.selectAll("line")
        .data([1])
        .join(enter=>enter.append("line"))
        .attr("x2", width)
        .style('stroke', 'white');

    row.selectAll("text")
        .data((d, i)=>[nodes[i].name])
        .join(enter=>enter.append("text"))
        .attr("x", -6)
        .attr("y", x.step() / 2)
        .attr('font-size', 10)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(d=>d);

    let column = svg.selectAll(".column")
        .data(matrix)
        .join(enter=>enter.append("g").attr("class", "column"))
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

    column.selectAll("line")
        .data([1])
        .join(enter=>enter.append("line"))
        .attr("x1", -width)
        .style('stroke', 'white');
    
    column.selectAll("text")
        .data((d, i)=>[nodes[i].name])
        .join(enter=>enter.append("text"))
        .attr("x", 6)
        .attr("y", x.step() / 2)
        .attr('font-size', 10)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(d=>d);

    function Row(row) {
        let cell = d3.select(this).selectAll(".cell")
            .data(row.filter(function(d) { return d.z; }))
            .join(enter=>enter.append("rect").attr("class", "cell").attr("fill", "gray"))
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.step())
            .attr("height", x.step())
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .style("fill-opacity", function(d) { return z(d.z); })
            
            .style("fill", function(d) { 
                return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : 'black'; });
    }

    function mouseover(p) {
        d3.selectAll(".row").classed("active", function(d, i) { return i == p.y; });
        d3.selectAll(".column").classed("active", function(d, i) { return i == p.x; });
    }

    function mouseout() {
        d3.selectAll(".row").classed("active", false);
        d3.selectAll(".column").classed("active", false);
    }

    d3.select("#order").on("change", function() {
        clearTimeout(timeout);
        order(this.value);
    });

    function order(value) {
        domain = orders[value];
        x.domain(domain);

        let t = svg.transition().duration(2500);

        t.selectAll(".row")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
            .selectAll(".cell")
            .delay(function(d) { return x(d.x) * 4; })
            .attr("x", function(d) { return x(d.x); });

        t.selectAll(".column")
            .delay(function(d, i) { return x(i) * 4; })
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
    }

    let timeout = setTimeout(function() {
            order("group");
            d3.select("#order").property("selectedIndex", 0).node().focus();
        }, 1500);
}

function main(){
    year = $(".year").val()-1999;
    console.log(year);
    drawMatrix(data[year]['nodes'], data[year]['edges']);
}

d3.json('data/clustering.json').then(function(d){
    data = d;
    MatrixInit();
    main();
})



