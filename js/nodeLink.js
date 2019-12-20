function draw(nodes, edges){
    var g = d3.select("svg"),
    width = +g.attr("width"),
    height = +g.attr("height");
    var groups = []
    for(let i = 0; i < nodes.length; i++)
     for(let j = i + 1; j < nodes.length; j++)
     if(nodes[i]['group'] == nodes[j]['group']){
         groups.push({'source': i, 'target': j});
     }
    //新建一个力导向图
    var forceSimulation = d3.forceSimulation()
        .force("link",d3.forceLink()
            .distance(d=>100*(1-d['val'])*(1-d['val'])))
        //.force("group", d3.forceLink().distance(width/5))
        .force("charge",d3.forceManyBody())
        .force("center",d3.forceCenter());
    
    var color = d3.scaleOrdinal().domain([d3.range(10)]).range(d3.schemeCategory10);
    //初始化力导向图，也就是传入数据
    //生成节点数据
    forceSimulation.nodes(nodes)
        .on("tick",ticked);//这个函数很重要，后面给出具体实现和说明
    //生成边数据
    forceSimulation.force("link")
        .links(edges);
    //forceSimulation.force('group')
    //    .links(groups);
    //设置图形的中心位置	
    forceSimulation.force("center")
        .x(width/2)
        .y(height/2);

    //有了节点和边的数据后，我们开始绘制
    //绘制边
    var links = g.append("g")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("stroke", 'gray')
        .attr("stroke-width", d=>d['val']*50)
        .attr('opacity', 0.5);
    var zoom = d3.zoom().scaleExtent([1, 10])
		.on("zoom", function(){
            d3.select(this).attr("transform", d3.event.transform);
        });
    var linksText = g.append("g")
        .selectAll("text")
        .data(edges)
        .enter()
        .append("text");

    //绘制节点
    //老规矩，先为节点和节点上的文字分组
    var gs = g.selectAll(".circleText")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform",function(d,i){
            var cirX = d.x;
            var cirY = d.y;
            return "translate("+cirX+","+cirY+")";
        })
        .call(d3.drag()
            .on("start",started)
            .on("drag",dragged)
            .on("end",ended)
        );
        
    //绘制节点
    gs.append("circle")
        .attr("r",d => d['val']*200)
        .attr("fill",d => color(d['group']))
    //文字
    gs.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", 'middle')
        .attr("font-size", 12)
        .text(function(d){
            return d.name;
        })

    function ticked(){
        links
            .attr("x1",function(d){return d.source.x;})
            .attr("y1",function(d){return d.source.y;})
            .attr("x2",function(d){return d.target.x;})
            .attr("y2",function(d){return d.target.y;});
            
        linksText
            .attr("x",function(d){
            return (d.source.x+d.target.x)/2;
        })
        .attr("y",function(d){
            return (d.source.y+d.target.y)/2;
        });
            
        gs.attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
    function started(d){
        if(!d3.event.active){
            forceSimulation.alphaTarget(0.8).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function ended(d){
        if(!d3.event.active){
            forceSimulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
    }
}

d3.json('data/clustering.json')    
.then(function(d){
    console.log(d);
    draw(d[20]['nodes'], d[20]['edges'])
})