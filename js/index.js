var data, articles;

/*
* 可以在里面做一些初始化工作，例如建立坐标系，为svg添加g分组之类的。
* 只会在一开始调用一次
*/
function infoInit(){
    // ToDo
}

/*
* 显示当年与keyword相关的所有文章。
* 在class为Info的svg中显示相关文章的标题、作者等信息。
* 当flag为true时显示，当flag为false时取消显示。
* 可以在全局变量articles中找到相关信息
*/
function drawInfo(year, keyword, flag){
    // ToDo
}

/* 与infoInit类似 */
function seriesInit(){
    // ToDo
}
/* 
* 在class为Series的svg中显示绘制其中的关键词出现次数占比随时间变化的图
* 参考http://square.github.io/cubism/
* 传入一个关键词list。 最好实现鼠标悬浮显示详细信息。
* 全局变量data中可以找到相关信息。data[i].nodes.val是占比。
*/
function drawSeries(wordsList){
    // ToDo
}

function packInit(){
    let width = 500, height = 500;
    let svg = d3.select(".Pack")
        .attr("width", width)
        .attr("height", height);
    svg.append('g').attr('class', 'node');
    svg.append('g').attr('class', 'label');
}

function drawPack(d){
    let width = 500, height = 500;
    let data = preProcess(d);
    const root = pack(data);
    let focus = root;
    let view;
    let color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl)

    const svg = d3.select("svg")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("background", '#f6f6f6')
        .style("cursor", "pointer")
        .on("click", () => zoom(root));

    const node = svg.select("g[class=node]")
        .selectAll("circle")
        .data(root.descendants().slice(1).sort((a, b)=>a.data.key-b.data.key))
        .join("circle")
        .attr("fill", d => d.depth != 2 ? color(d.depth) : "white")
        .attr("class", d => d.data.name)
        .attr("pointer-events", null)
        .on("mouseover", function(d) {select(d); d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() {unselect(); d3.select(this).attr("stroke", null); })
        .on("click", d => click(d));

    const label = svg.select("g[class=label]")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants().slice(1).sort((a, b)=>a.data.key-b.data.key))
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 0 : 1)
        .text(d => d.data.name);

    view = [root.x, root.y, root.r * 2];
    label.transition().duration(1000)
        .attr("font-size", d => d.r / 3 >= 3? d.r / 3: 0);
    label.transition().duration(2000).delay(1000)
        .attr("transform", d => `translate(${(d.x - root.x)},${(d.y - root.y)})`);
    node.transition().duration(1000)
        .attr("r", d => d.value? d.r: 0);
    node.transition().duration(2000).delay(1000)
        .attr("transform", d => `translate(${(d.x - root.x)},${(d.y - root.y)})`);
    //zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];

        view = v;
        
        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        label.attr("font-size", d => d.r * k / 3 >= 3? d.r * k / 3: 0);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.value? d.r * k: 0);
    }

    function zoom(d) {
        focus = d;
        const transition = svg.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });
    }
    function click(d){
        if(d === focus) return;
        if(d.depth != 2){
            zoom(d);
        } else{
            console.log($(event.target).attr("select"));
            if($(event.target).attr("select") === "true")
                $(event.target).attr("select", "false");
            else
                $(event.target).attr("select", "true");
        }
        d3.event.stopPropagation();
    }
    function pack(data){
        return d3.pack()
            .size([width, height])
            .padding(3)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b)=>b.value-a.value))
    }
    function select(d){
        if(d.depth == 2){
            d3.selectAll("."+d.data.name).classed("active", true);
            return;
        }
        for(let i = 0; i < d.children.length; i++){
            let name = d.children[i].data.name; 
            d3.selectAll("."+name).classed("active", true);
        }
    }
    function unselect(){
        d3.selectAll(".active").classed("active", false);
    }
    function preProcess(d){
        let keywordsMap = {}, n = d['keywords'].length;
        let data = {'name':'', 'children':[], 'key': -1};
        let visited = d3.range(n), groupMax = d3.range(n);
        for(let i = 0; i < n; i++){
            keywordsMap[d['keywords'][i]] = i;
            data['children'].push({'name':'', 'children':[], 'key': i});
            groupMax[i] = -1;
            visited[i] = 0;
        }
        for(let i = 0; i < d['nodes'].length; i++){
            let g = d['nodes'][i]['group'];
            if(groupMax[g] == -1 || 
                d['nodes'][groupMax[g]]['cnt'] < d['nodes'][i]['cnt']){
                    groupMax[g] = i;
                }
        }
        for(let i = 0; i < d['nodes'].length; i++){
            let p = groupMax[d['nodes'][i].group];
            p = keywordsMap[d['nodes'][p]['name']];
            let name = d['nodes'][i]['name'], val = d['nodes'][i]['cnt'], key = keywordsMap[name] + n;
            data['children'][p]['children'].push({'name': name, 'value': val, 'key': key});
            visited[key - n] = 1;
        }
        for(let i = 0; i < n; i++)
        if(!visited[i]){
            data['children'][i]['children'].push({'name': d['keywords'][i], 'value': 0, 'key': i + n});
        }
        console.log(data);
        return data;
    }
}

function matrixInit(){
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
}
function drawMatrix(d){
    let margin = {top: 100, right: 0, bottom: 10, left: 100},
        width = 400,
        height = 400;
    let x = d3.scaleBand().range([0, width]),
        z = d3.scaleLinear();
    let svg = d3.select(".Matrix g");
    let matrix = [],
        nodes = d['nodes'],
        edges = d['edges'],
        n = nodes.length;

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
        group: d3.range(n).sort(function(a, b) { return nodes[a].group - nodes[b].group; })
    };
    
    // The default sort order.
    x.domain(orders.group);
    z.domain([0, d3.max(edges.map(d=>d['cnt']))]).clamp(true);

    let row = svg.selectAll(".row")
        .data(matrix)
        .join(enter=>enter.append("g").attr("class", "row"))
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .attr("class", (d, i) => "row "+nodes[i].name)
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
        .attr("class", (d, i) => "column "+nodes[i].name)
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
            .join(enter=>enter.append("rect").attr("class", "cell"))
            .attr("x", function(d) { return x(d.x); })
            .attr("width", x.step())
            .attr("height", x.step())
            .attr("class", d => "cell "+nodes[d.x].name+" "+nodes[d.y].name)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .style("fill-opacity", function(d) { return z(d.z); });
    }

    function mouseover(d) {
        d3.selectAll("."+nodes[d.x].name).classed("active", true);
        d3.selectAll("."+nodes[d.y].name).classed("active", true);
        //d3.selectAll(".row").classed("active", function(d, i) { return i == p.y; });
        //d3.selectAll(".column").classed("active", function(d, i) { return i == p.x; });
    }

    function mouseout(d) {
        d3.selectAll("."+nodes[d.x].name).classed("active", false);
        d3.selectAll("."+nodes[d.y].name).classed("active", false);
        //d3.selectAll(".row").classed("active", false);
        //d3.selectAll(".column").classed("active", false);
    }

    d3.select("#order").on("change", function() {
        order(this.value);
    });

    function order(value) {
        x.domain(orders[value]);

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
}


function main(){
    year = $("#spinner input").val()-1999;
    console.log(year);
    drawPack(data[year]);
    drawMatrix(data[year]);
    drawSeries(["learning", "model", "system", "robot", "image"]);
}

d3.json('data/clustering.json').then(function(d){
    data = d;
    packInit();
    matrixInit();
    seriesInit();
    main();
});

d3.json('data/dataSetWithKeyWords.json').then(function(d){
    articles = d;
    infoInit();
    drawInfo(2019, "learning", true);
})