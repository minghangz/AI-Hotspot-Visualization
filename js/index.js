var data, articles, selectedYear;
var selectCnt = 0, maxWords = 10, wordsList=[], ids=["", "", "", "", "", "", "", "", "", ""],Arr=[];

function showInfo(keyword, year, cnt, val){
    keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    d3.select(".details")
        .style("display", "block")
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY+10) + "px")
        .html("<b>"+year+"年 "+keyword+"：</b><br/>"+
            "出现次数："+cnt+"次<br/>"+
            "全年占比："+(val*100).toFixed(2)+"%");
}

function showInfo2(year, keyword1, keyword2, cnt1, cnt2, cnt3){
    keyword1 = keyword1.charAt(0).toUpperCase() + keyword1.slice(1);
    keyword2 = keyword2.charAt(0).toUpperCase() + keyword2.slice(1);
    cnt3 = d3.min([cnt1, cnt2, cnt3]);
    d3.select(".details")
        .style("display", "block")
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY+10) + "px")
        .html("<b>"+year+"年</b><br/>"+
            keyword1+"："+cnt1+"次<br/>"+
            keyword2+"："+cnt2+"次<br/>"+
            "共现："+cnt3+"次");
}

/*
* 可以在里面做一些初始化工作，例如建立坐标系，为svg添加g分组之类的。
* 只会在一开始调用一次
*/
function infoInit(){
    // ToDo
}

//显示悬浮窗
function showInform(event){
      	document.getElementById("inform").style.display='block';
         // document.getElementById("inform").css("display","block");
}
//隐藏悬浮窗
function hiddenInform(event){
      	 let informDiv = document.getElementById('inform');
      	 let x=event.clientX;  
         let y=event.clientY;  
      	 let divx1 = informDiv.offsetLeft;  
         let divy1 = informDiv.offsetTop;  
         let divx2 = informDiv.offsetLeft + informDiv.offsetWidth;  
         let divy2 = informDiv.offsetTop + informDiv.offsetHeight;
         if( x < divx1 || x > divx2 || y < divy1 || y > divy2){  
              document.getElementById('inform').style.display='none';  
         }  
        
}
//获取元素的纵坐标
function getTop(e){


}

//获取元素的横坐标
function getLeft(e){

   

}
/*
* 显示当年与keyword相关的所有文章。
* 在class为Info的svg中显示相关文章的标题、作者等信息。
* 当flag为true时显示，当flag为false时取消显示。
* 可以在全局变量articles中找到相关信息
*/

//在鼠标显示一个层
function showTip(e,content,ifhave){ 	    

	let div1 = document.getElementById(content); //将要弹出的层
	let x,x1;
	let y,y1;
	if(window.event){
	e = window.event;	
	x=(e.clientX+document.body.scrollLeft+10); //鼠标目前在X轴上的位置
	y=(e.clientY+document.body.scrollTop+6);
	if((y+150)>document.body.clientHeight){y=y-150-6;}
	}else{
	x=(e.pageX+10);
	y=(e.pageY+6);
	if((y+150)>document.body.clientHeight){y=y-150-6;}
	}
	div1.style.left=x+"px"; //鼠标目前在X轴上的位置，加10是为了向右边移动10个px方便看到内容 
	div1.style.top=y+"px"; 	
	div1.style.display="block"; //div1设置为可见 
	
	div1.style.position="absolute";
}

//关闭显示 
function closeTip(event,divid) { 
//let div1 = document.getElementById('divdisplay'); 
//div1.style.display="none"; 
document.getElementById(divid).style.display="none";
} 

function getArr(year){
    Arr=[];
    for(let i in articles){
        if(articles[i].year==year)
        {
            Arr.push({"title":articles[i].title, "keywords":articles[i].keywords, "authors":articles[i].authors, "abstract":articles[i].abstract});
        }
    }
}

function drawInfo(year){
    getArr(year);
    let Info = document.getElementById("Info");
    let num = document.getElementById("num");
    let cnt=0;
    $(Info).empty();
    for(let i in Arr){ 
        let f=false;
            if(selectCnt!=0){
                for(var k=0; k<selectCnt;k++){
                  for(var p=0; p<Arr[i].keywords.length;p++)
                     {
                         if(Arr[i].keywords[p]==wordsList[k].name)
                            break;
                     }
                    if(p==Arr[i].keywords.length)
                        break;
                }
                 if(k==selectCnt)
                       f=true;
                }
            if(f==true||selectCnt==0){
            cnt++;
            let entry = document.createElement("div");
            entry.className="entry";
            entry.id=i.toString();
            Info.appendChild(entry);

            let index = document.createElement("div");
            index.className="index";
            index.innerText = cnt;
            entry.appendChild(index);

            let title = document.createElement("div");
            title.className="title";
            entry.appendChild(title);

            let show = document.createElement("a");
            show.href="#collapse"+cnt;
            show.setAttribute("data-toggle","collapse");
            show.setAttribute("data-parent","#Info-container");
            show.innerText = Arr[i].title;
            title.appendChild(show);

            for(let j=0;j<Arr[i].authors.length&&j<4;j++){
                let author = document.createElement("div");
                author.className="author";
                author.innerText = Arr[i].authors[j];
                entry.appendChild(author);
             }

            let detailcontainer = document.createElement("div");
            detailcontainer.id="collapse"+cnt;
            detailcontainer.className="panel-collapse collapse in";
            entry.appendChild(detailcontainer);

            let abstr = document.createElement("div");
            abstr.id="abstract"+cnt;
            abstr.className="abstr";
            abstr.innerHTML = "<b>Abstract: </b>"+Arr[i].abstract;
            detailcontainer.appendChild(abstr);

         for(let j=0;j<Arr[i].keywords.length;j++){
                let keys = document.createElement("div");
                keys.className="keys";
                if(j==0)
                {
                    keys.innerHTML = "<b>keywords: </b>"+Arr[i].keywords[j];
                }
                else if(j>0){
                    keys.innerHTML = ", "+Arr[i].keywords[j];
                }
                detailcontainer.appendChild(keys);
             }
        }
    }
        num.innerText = cnt.toString()+" Publications";
        if(cnt==0) {
            let tips = document.createElement("div");
            tips.className="tips";
            tips.innerText = "No results meet your requirements";
            Info.appendChild(tips);
        }
    }
     

	/*
	//通过createElementNS创建svg元素并设置属性
		let svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); 	
		svg.setAttribute("style","width:100%;height:100%;");
		svg.setAttribute("viewBox","0 0 100 100");				
		
		//创建矩形元素并设置属性
		let rect=document.createElementNS('http://www.w3.org/2000/svg','rect'); 
		rect.setAttribute("x","10");
		rect.setAttribute("y","10");
		rect.setAttribute("width","20");
		rect.setAttribute("height","20");
		rect.setAttribute("style","fill:#ff6666;stroke-width:1;stroke:rgb(255,0,0)");
		
		
		//监听鼠标事件
	let rect = bar.selectAll("rect")
    .on("mouseover",function(d,i){
        showTip();
    })
    .on("mouseout",function(d,i){
		closeTip();
		hiddenInform();
    });
*/
/*
function drawNode(data){
    let g = d3.select("#Node"), nodes=data["nodes"], edges = data["edges"],
    width = 400,
    height = 400;
    g.attr('width', width).attr('height', height);

    let groups = [];
    for(let i = 0; i < nodes.length; i++)
     for(let j = 0; j < nodes.length; j++)
     if(nodes[i].group == nodes[j].group){
         groups.push({"source":i, "target":j});
     }

    //力学模型
    let forceSimulation = d3.forceSimulation()
        .force("link",d3.forceLink()
            .distance(d=>d.source.group == d.target.group?120:180)) // 同一类之间的引力大
        //    .distance(d=>200*(1-d['val'])))
        .force("charge",d3.forceManyBody())
        .force("group", d3.forceLink().distance(100))
        .force("center",d3.forceCenter());
    
    let color = d3.scaleOrdinal().domain([d3.range(10)]).range(d3.schemeCategory10);

    //节点数据
    forceSimulation.nodes(nodes)
        .on("tick",ticked);
    //边数据
    forceSimulation.force("link")
        .links(edges);
    forceSimulation.force("group")
        .links(groups)
    //中心位置
    forceSimulation.force("center")
        .x(width/2)
        .y(height/2);


    //绘制边
    let links = g.selectAll("line")
        .data(edges)
        .join("line")
        .attr("class", (d, i)=>"Data N"+i)
        .attr("stroke", 'gray')
        .attr("stroke-width", d=>(d['val'])*25)
        .attr('opacity', 0.5);
    let zoom = d3.zoom().scaleExtent([1, 10])
		.on("zoom", function(){
            d3.select(this).attr("transform", d3.event.transform);
        });

    //节点分组
    let gs = g.selectAll(".circleText")
        .data(nodes)
        .join(enter=>enter.append("g"))
        .attr("class", d=>"circleText Data "+d.name)
        .attr("transform",function(d,i){
            let cirX = d.x;
            let cirY = d.y;
            return "translate("+cirX+","+cirY+")";
        })
        .on("mouseover", d => select(d.name))
        .on("mouseout", unselect)
        .call(d3.drag()
            .on("start",started)
            .on("drag",dragged)
            .on("end",ended)
        );
        
    //绘制点
    gs.selectAll("circle")
        .data(d=>[d])
        .join("circle")
        .attr("r",d => Math.sqrt(d['val'])*80)
        .attr("fill",d => color(d['group']))
    //绘制文字
    gs.selectAll("text")
        .data(d=>[d])
        .join("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", 'middle')
        .attr("font-size", d => Math.sqrt(d['val'])*40)
        .text(function(d){
            return d.name;
        })

    function ticked(){
        links.attr("x1",function(d){return d.source.x;})
            .attr("y1",function(d){return d.source.y;})
            .attr("x2",function(d){return d.target.x;})
            .attr("y2",function(d){return d.target.y;});
            
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
    function select(name){
        let threshold = 0.005;
        d3.selectAll(".Data").classed("deactive", true);
        d3.selectAll("#Node line").classed("deactive", true);
        d3.selectAll("."+name).classed("deactive", false);
        d3.selectAll("#Pack circle."+name).attr("stroke", "#000");
        for(let i = 0; i < edges.length; i++){
            if(edges[i]["key1"]==name && edges[i]['val'] >= threshold){
                d3.selectAll("#Node ."+edges[i]["key2"]).classed("deactive", false);
                d3.selectAll("#Node line.N"+i).classed("deactive", false);
            }
            if(edges[i]["key2"]==name && edges[i]['val'] >= threshold){
                d3.selectAll("#Node ."+edges[i]["key1"]).classed("deactive", false);
                d3.selectAll("#Node line.N"+i).classed("deactive", false);
            }
        }
    }
    function unselect(){
        d3.selectAll(".Data").classed("deactive", false);
        d3.selectAll("#Node line").classed("deactive", false);
        d3.selectAll("#Pack circle").attr("stroke", "rgb(51, 153, 204)");
    }
}
*/
function drawNode(graph){
    let len = graph.groupSize;
    let areaMatrix = new Array(len);
    let color = d3.scaleOrdinal().domain([d3.range(10)]).range(d3.schemeCategory10);

    let width = 1000,
        height = 1000,
        innerRadius = Math.min(width, height) * .41,
        outerRadius = innerRadius * 1.02;
    
    $("#Node").empty();
    let svg = d3.select("#Node").append("g")
        .attr("transform", "scale(0.58) translate(458,500)"); 

    for (let i = 0; i < len; i++) {
        areaMatrix[i] = new Array(len);
        for (let j = 0; j < len; j++) {
            areaMatrix[i][j] = 0;
        }
    }

    collaMap = new Array(graph.nodes.length);
    for (let i = 0; i < graph.nodes.length; i++) {
        collaMap[i] = new Array(len);
        for (let j = 0; j < graph.nodes.length; j++) {
            collaMap[i][j] = 0;
        }
    }

    for (let i = 0; i < graph.nodes.length; i++) {
        let nodeAreaID = graph.nodes[i].group;
        areaMatrix[nodeAreaID][nodeAreaID] = areaMatrix[nodeAreaID][nodeAreaID] + 1;
    }

    let areaChord = d3.chord()
        //                .padding(0.2)
        //                .sortGroups(d3.descending)
            .sortSubgroups(d3.descending);

    let are_chord = svg.append("g")
            .selectAll("path")
            .data(areaChord(areaMatrix).groups)
            .join("path")
            .attr("class", "areaChord")
            .attr("fill", d => color(d.index))
            .attr("stroke", d => color(d.index))
            .attr("opacity", 0.4)
            .attr("d", d3.arc().innerRadius(innerRadius).outerRadius(outerRadius * 1.05))
            .on("mouseover",function(data){
                d3.select(this).attr("opacity", 1);
                //this.opacity = 1;
                d3.selectAll("#Pack .Data").classed("deactive", true);
                d3.selectAll("#Series .Data").classed("deactive", true);

                nodes.attr("opacity",function(d){
                    if(data.index == d.group){
                        d3.selectAll("#Pack ."+d.name).classed("deactive", false);
                        d3.selectAll("#Series ."+d.name).classed("deactive", false);
                        return constNum.opacityHighlight;
                    }
                    else
                        return constNum.opacity;
                })
                labels.attr("opacity",function(d){
                    if(data.index == d.group)
                        return constNum.opacityHighlight;
                    else
                        return constNum.opacity;
                })
                textLabel.attr("opacity",function(d){
                    if(data.index == d.group)
                        return 1;
                    else
                        return 0.1;
                });
                link.attr("opacity",function(d){
                    if(d.source.group == data.index && d.target.group == data.index)
                        return 1;
                    else
                        return 0.1;
                })
            })
            .on("mouseout",function(data){
                d3.selectAll(".deactive").classed("deactive", false);
                are_chord.attr("opacity", 0.4);
                nodes.attr("opacity",function(d) {
                    return constNum.opacityHighlight;
                });
                labels.attr("opacity",1);
                textLabel.text(function(data){
                    return data.cnt;
                })
                    .attr("opacity",1);
                link.attr("opacity",0.4);
            });
    let prof_centerNodes = [];
    let prof_groups = areaChord(areaMatrix).groups;
    for (let i = 0; i < prof_groups.length; i++) {
        let d = prof_groups[i];
        let x = innerRadius * 0.6 * Math.sin((d.endAngle + d.startAngle) / 2);
        let y = -innerRadius * 0.6 * Math.cos((d.endAngle + d.startAngle) / 2);
        let areaName = i;
        prof_centerNodes.push({x: x, y: y, a: areaName});
    }
    prof_centerNodes.aiMap = {};
    for (let i = 0; i < prof_centerNodes.length; i++) {
        prof_centerNodes.aiMap[prof_centerNodes[i].a] = i;
    }

    prof_centerNodes.getProfCenterNodes = function (areaName) {
        let index = this.aiMap[areaName];
        return prof_centerNodes[index];
    };


    for(let i=0;i<graph.nodes.length;i++){
        graph.nodes[i].neighbor =[];
    }

    let constNum = {
        forceCharge: -1200,
        forceChargeHighlight: -1200*2,

        size: {
            node: 24,
            nodeHighlight: 24*3/2,

        },

        opacity: 0.2,
        opacityHighlight: 1
    };
    let force = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(graph.edges));
    force.force("charge")
        .strength(function(d) {
            return constNum.forceChargeHighlight;
        })
        .distanceMax(300);
    force.force("link")
        .distance(300)
        .strength(0.3);

    for(let i=0;i<graph.edges.length;i++){
        let l = graph.edges[i];
        l.source.neighbor.push(l.target.index);
        l.target.neighbor.push(l.source.index);
        collaMap[l.target.index][l.source.index]=l.cnt;
        collaMap[l.source.index][l.target.index]=l.cnt;
    }

    let link = svg.selectAll(".link")
        .data(graph.edges)
        .enter().append("line")
        .attr("class", "Data")
        .attr("stroke","#999")
        .attr("stroke-opacity",".6")
        .attr("stroke-width", d => Math.sqrt(d.val) * 30);
    let g = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .on("mouseover", mouseover)
        .on("mousemove", data => showInfo(data.name, graph.year, data.cnt, data.val))
        .on("mouseout", mouseout)
        .on("click", click);
        /*.call(d3.drag()
            .on("start",started)
            .on("drag",dragged)
            .on("end",ended)
        )*/
    let nodes = g.append("circle")
        .attr("r", function(d) {
            return Math.sqrt(d['val'])*150;
        })
        .attr("class", d => "Data "+d.name)
        .attr("fill", d => color(d.group))
        .attr("stroke", "white")
        .attr("opacity",function(d) {
            return constNum.opacityHighlight;
        });
    let labels = g.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", d => "Data "+d.name)
        .attr("text-anchor", 'middle')
        .attr("font-size", d => Math.sqrt(d['val'])*70)
        .text(d => d.name);

    link.append("title")
            .text(function(d) {return d.val;});
    let textLabel = svg.append("g")
            .selectAll(".text")
            .data(graph.nodes)
            .enter()
            .append("text")
            .attr("class", d => "Data "+d.name)
            .attr("text-anchor", 'middle')
            .attr("font-size", d => Math.sqrt(d['val'])*70)
            .attr("font-family","Serif")
            .text(function(data){
                return data.cnt;
            })
            .attr("x",function(data){return data.x;})
            .attr("y",function(data){return data.y+Math.sqrt(data['val'])*70+10;})
            .on("mouseover", mouseover)
            .on("mousemove", data => showInfo(data.name, graph.year, data.cnt, data.val))
            .on("mouseout", mouseout)
            .on("click", click);
            

    force.on("tick", function() {

        let k = force.alpha()*0.8 ;
        // Push nodes toward their designated focus.
        graph.nodes.forEach(function (o, i) {
            let cx = prof_centerNodes.getProfCenterNodes(o.group).x;
            let cy = prof_centerNodes.getProfCenterNodes(o.group).y;
            o.x += (cx - o.x) * k;
            o.y += (cy - o.y) * k;
        });

        link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

        labels.attr("transform", function(d){
            return "translate(" + d.x + "," + d.y + ")"; 
        });

        nodes.attr("cx", function(d) { return d.x;  })
            .attr("cy", function(d) { return d.y; });

        textLabel.attr("x",function(data){return data.x;})
                .attr("y",function(data){return data.y+Math.sqrt(data['val'])*70+10;})

    });
    function mouseover(data,index){
        showInfo(data.name, graph.year, data.cnt, data.val);
        are_chord.attr("opacity",function(d){
            if(d.index == data.group)
                return 1;
            else
                return 0.4;
        })
        d3.selectAll("#Pack .Data").classed("deactive", true);
        d3.selectAll("#Series .Data").classed("deactive", true);

        svg.selectAll("."+data.name).attr("opacity", constNum.opacityHighlight);
        svg.selectAll("circle."+data.name).attr("stroke", "black");
        d3.selectAll("#Pack ."+data.name).classed("deactive", false);
        d3.selectAll("#Series ."+data.name).classed("deactive", false);
        //nodes["_groups"][0][index].opacity = constNum.opacityHighlight;
        nodes["_groups"][0].forEach(function(n,i){
            if(n.__data__.neighbor.indexOf(index) != -1){
                //nodes["_groups"][0][i].opacity = constNum.opacityHighlight;
                svg.selectAll("."+n.__data__.name).attr("opacity", constNum.opacityHighlight);
                //d3.selectAll("#Pack ."+n.__data__.name).classed("deactive", false);
                //d3.selectAll("#Series ."+n.__data__.name).classed("deactive", false);
            }
            else if(i!=index){
                svg.selectAll("."+n.__data__.name).attr("opacity", 0.2);
                //svg.select("."+data.name).attr("opacity", constNum.opacityHighlight);
                //nodes["_groups"][0][i].opacity = constNum.opacity;
                //labels["_groups"][0][i].opacity = 0.3;
            }
        });
        textLabel.attr("x",function(data){return data.x;})
                .attr("y",function(data){return data.y+Math.sqrt(data['val'])*70+10;})
                .text(function(data,id){
                    if(data.neighbor.indexOf(index) != -1){
                        return collaMap[index][id];
                    }
                    else if(id == index){
                        return data.cnt;
                    }
                    else
                    {
                        return "";
                    }
                })
        link.attr("opacity",function(d){
            if(d.source.index == data.index || d.target.index == data.index){
                return 1;
            }else{
                return  0.1;
            }
        })
    }
    function mouseout(){
        d3.select(".details").style("display", "none");
        are_chord.attr("opacity", 0.4);
        nodes.attr("opacity",function(d) {
            return constNum.opacityHighlight;
        });
        nodes.attr("stroke", "white");
        labels.attr("opacity",1);
        textLabel.text(function(data){
            return data.cnt;
        });
        link.attr("opacity",0.4);
        d3.selectAll(".deactive").classed("deactive", false);
    }
    
    function click(d){
        d3.selectAll("#Pack circle."+d.name).each(function(d, i){
            var onClickFunc = d3.select(this).on("click");
            onClickFunc.apply(this, [d, i]);
        });
    }
}

/* 与infoInit类似 */
function seriesInit(){
    let margin = {"top": 20, "left": 30};
    let width = 550, height = 300;
    let xScale = d3.scaleBand()
        .domain(d3.range(2004, 2020))
        .range([0, width - margin.left]);
    let yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.top, 0]);
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);
    let svg = d3.select("#Series");
    svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate('+margin.left+','+height+')')
        .call(xAxis);
    svg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')
        .call(yAxis);
    svg.append('g').attr("class", "line");
    svg.append('g').attr("class", "hint");
}
/* 
* 在class为Series的svg中显示绘制其中的关键词出现次数占比随时间变化的图
* 参考http://square.github.io/cubism/
* 传入一个关键词list。 最好实现鼠标悬浮显示详细信息。
* 全局变量data中可以找到相关信息。data[i].nodes.val是占比。
*/
function drawSeries(keyword, flag){
    d3.select(".details").style("display", "none");
    preProcess(keyword, flag);
    let margin = {"top": 20, "left": 30};
    let width = 550, height = 300;
    let xScale = d3.scaleBand()
        .domain(d3.range(2004, 2020))
        .range([0, width - margin.left]);
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(wordsList.map(d => d["maxVal"]*100))+5])
        .range([height - margin.top, 0]);
    let color = d3.scaleOrdinal()
        .domain(d3.range(10))
        .range(d3.schemeCategory10);
    
    d3.select("#Series .yAxis").call(d3.axisLeft(yScale));
    let line = d3.line()
        .x(d => xScale(d["year"]) + margin.left+xScale.step()/2)
        .y(d => yScale(d["val"]*100) + margin.top);
    d3.select("#Series .line").selectAll("g")
        .data(wordsList).join("g")
        .attr("class", d => "Data "+d.name)
        .each(addLine);
    d3.select("#Series .hint").selectAll("text")
        .data(wordsList).join("text")
        .attr("class", d => "Data "+d.name)
        .attr("x", 470)
        .attr("y", (d, i) => i*20+13)
        .text(d => d.name);
    d3.select("#Series .hint").selectAll("rect")
        .data(wordsList).join("rect")
        .attr("class", d => "Data "+d.name)
        .attr("width", 15)
        .attr("height", 15)
        .attr("x",450)
        .attr("y", (d, i)=>i*20)
        .attr("fill", d => color(d.id));

    function addLine(data){
        d3.select(this).selectAll("path")
            .data([0]).join("path")
            .attr("d", d => line(data.data))
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", color(data.id))
            .on("mouseover", function(){
                d3.selectAll(".Data").classed("deactive", true);
                d3.selectAll("."+data.name).classed("deactive", false);
                d3.selectAll("#Series ."+data.name).raise();
            })
            .on("mouseout", function(){
                d3.selectAll(".deactive").classed("deactive", false);
            })
            .on("click", function(){
                d3.selectAll("#Pack ."+data.name).attr("select", "false");
                selectCnt--;
                drawSeries(data.name, false);
                d3.selectAll(".deactive").classed("deactive", false);
                d3.select(".details").style("display", "none");
            });
        d3.select(this).selectAll("circle")
            .data(data.data).join("circle")
            .attr("r", 4)
            .attr("cx", d => xScale(d["year"]) + margin.left+xScale.step()/2)
            .attr("cy", d => yScale(d["val"]*100) + margin.top)
            .attr("fill", color(data.id))
            .on("mouseover", function(d){
                d3.selectAll(".Data").classed("deactive", true);
                d3.selectAll("."+data.name).classed("deactive", false);
                d3.selectAll("#Series ."+data.name).raise();
                showInfo(d.name, d.year, d.cnt, d.val);
            })
            .on("mousemove", d => showInfo(d.name, d.year, d.cnt, d.val))
            .on("mouseout", function(d){
                d3.selectAll(".deactive").classed("deactive", false);
                d3.select(".details").style("display", "none");
            })
            .on("click", function(){
                d3.selectAll("#Pack ."+data.name).attr("select", "false");
                selectCnt--;
                drawSeries(data.name, false);
                d3.selectAll(".deactive").classed("deactive", false);
                d3.select(".details").style("display", "none");
            });
    }

    function preProcess(keyword, flag){
        if(flag == false){
            let j = 0;
            for(let i = 0; i < wordsList.length; i++)
            if(wordsList[i].name == keyword){
                j = i;
                break;
            }
            for(let i = 0; i < maxWords; i++)
            if(ids[i] == keyword){
                ids[i] = "";
                break;
            }    
            wordsList.splice(j, 1);
            return;
        }
        let id = -1, maxVal = 0;
        for(let i = 0; i < maxWords; i++)
        if(ids[i] == ""){
            ids[i] = keyword;
            id = i;
            break;
        }
        let d = [];
        for(let i = 0; i < data.length; i++){
            let cnt = 0, val = 0;
            if(data[i].year < 2004) continue;
            for(let j = 0; j < data[i].nodes.length; j++)
            if(data[i].nodes[j].name == keyword){
                cnt = data[i].nodes[j].cnt;
                val = data[i].nodes[j].val;
            }
            d.push({"year": data[i].year, "cnt": cnt, "val": val, "name": keyword});
            maxVal = d3.max([val, maxVal]);
        }
        wordsList.push({"name":keyword, "data":d, "id":id, "maxVal": maxVal});
    }
}

function packInit(){
    let svg = d3.select("#Pack");
    svg.append('g').attr('class', 'node');
    svg.append('g').attr('class', 'label');
}

function drawPack(d){
    let width = 530, height = 530;
    let data = preProcess(d);
    const root = pack(data);
    let focus = root;
    let view;

    const svg = d3.select("#Pack")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .on("click", () => zoom(root));

    const node = svg.select("g[class=node]")
        .selectAll("circle")
        .data(root.descendants().slice(1).sort((a, b)=>a.data.key-b.data.key))
        .join("circle")
        .attr("fill", d => d.depth != 2 ? "rgb(51, 153, 204)" : "#ffffff")
        .attr("stroke", "rgb(51, 153, 204)")
        .attr("class", d => "Data "+d.data.name)
        .attr("pointer-events", null)
        .on("mouseover", function(d) {select(d); d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() {unselect(); d3.select(this).attr("stroke", "rgb(51, 153, 204)"); })
        .on("mousemove", function(d) {select(d); d3.select(this).attr("stroke", "#000"); })
        .on("click", d => click(d));

    const label = svg.select("g[class=label]")
        .attr("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants().slice(1).sort((a, b)=>a.data.key-b.data.key))
        .join("text")
        .attr("class", d => "Data "+d.data.name)
        .attr("fill-opacity", d => d.parent === root ? 0 : 1)
        .text(d => d.data.name);

    d3.selectAll(".Data").attr("pointer-events", "none");
    setTimeout(() => {d3.selectAll(".Data").attr("pointer-events", null)}, 2000);
    view = [root.x, root.y, root.r * 2];
    label.transition().duration(500)
        .attr("font-size", d => d.r / 3 >= 3? d.r / 3: 0);
    label.transition().duration(1500).delay(500)
        .attr("transform", d => `translate(${(d.x - root.x)},${(d.y - root.y)})`);
    node.transition().duration(500)
        .attr("r", d => d.value? d.r: 0);
    node.transition().duration(1500).delay(500)
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
        d3.selectAll(".Data").attr("pointer-events", "none");
        setTimeout(() => {d3.selectAll(".Data").attr("pointer-events", null)}, 750);
        const transition = svg.transition()
            .duration(750)
            .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
            });
    }
    function click(d){
        if(d === focus) return;
        if(d.depth != 2){
            zoom(d);
        } else {
            if($("#Pack circle."+d.data.name).attr("select") === "true"){
                $("#Pack circle."+d.data.name).attr("select", "false");
                selectCnt--;
                drawSeries(d.data.name, false);
                drawInfo($("#spinner input").val());
            }else{
                $("#Pack circle."+d.data.name).attr("select", "true");
                if(selectCnt >= maxWords){
                    window.alert("最多选择"+maxWords+"个关键词！");
                    return;
                } else {
                    selectCnt++;
                    drawSeries(d.data.name, true);
                    drawInfo($("#spinner input").val());
                }
            }
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
            d3.selectAll(".Data").classed("deactive", true);
            d3.selectAll("."+d.data.name).classed("deactive", false);
            d3.selectAll("#Series ."+d.data.name).raise();
            showInfo(d.data.name, d.data.year, d.data.value, d.data.ratio);
            return;
        }
        d3.selectAll(".Data").classed("deactive", true);
        d3.select(event.target).classed("deactive", false);
        for(let i = 0; i < d.children.length; i++){
            let name = d.children[i].data.name; 
            d3.selectAll("."+name).classed("deactive", false);
            d3.selectAll("#Series ."+name).raise();
        }
    }
    function unselect(){
        d3.selectAll(".deactive").classed("deactive", false);
        d3.select(".details").style("display", "none");
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
            data['children'][p]['children'].push({'year': d['year'], 'name': name, 
                'value': val, 'key': key, "ratio": d['nodes'][i]['val']});
            visited[key - n] = 1;
        }
        for(let i = 0; i < n; i++)
        if(!visited[i]){
            data['children'][i]['children'].push({'name': d['keywords'][i], 'value': 0, 'key': i + n});
        }
        return data;
    }
}

function matrixInit(){
    let margin = {top: 50, right: 0, bottom: 10, left: 50},
        width = 300,
        height = 300;
    let svg = d3.select("#Matrix")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .attr('fill', '#eee');
}
function drawMatrix(rawData){
    let margin = {top: 50, right: 0, bottom: 10, left: 50},
        width = 300,
        height = 300;
    let x = d3.scaleBand().range([0, width]),
        z = d3.scaleLinear();
    let svg = d3.select("#Matrix g");
    let matrix = [],
        nodes = rawData['nodes'],
        edges = rawData['edges'],
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
        .attr("class", (d, i) => "row Data "+nodes[i].name)
        .each(Row);

    row.selectAll("line")
        .data([1])
        .join(enter=>enter.append("line"))
        .attr("x2", width)
        .attr('stroke', 'white');

    row.selectAll("text")
        .data((d, i)=>[nodes[i].name])
        .join(enter=>enter.append("text"))
        .attr("x", -6)
        .attr("y", x.step() / 2)
        .attr('font-size', 8)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(d=>d);

    let column = svg.selectAll(".column")
        .data(matrix)
        .join(enter=>enter.append("g").attr("class", "column"))
        .attr("class", (d, i) => "column Data "+nodes[i].name)
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

    column.selectAll("line")
        .data([1])
        .join(enter=>enter.append("line"))
        .attr("x1", -width)
        .attr('stroke', 'white');
    
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
            .attr("class", d => "cell Data "+nodes[d.x].name+" "+nodes[d.y].name)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mouseover)
            .attr("fill", "#336699")
            .attr("fill-opacity", function(d) { return z(d.z); });
    }

    function mouseover(d) {
        d3.selectAll(".Data").classed("deactive", true);
        d3.selectAll("."+nodes[d.x].name).classed("deactive", false);
        d3.selectAll("."+nodes[d.y].name).classed("deactive", false);
        d3.selectAll("#Series ."+nodes[d.x].name).raise();
        d3.selectAll("#Series ."+nodes[d.y].name).raise();
        d3.selectAll("#Pack circle."+nodes[d.y].name).attr("stroke", "#000");
        d3.selectAll("#Pack circle."+nodes[d.x].name).attr("stroke", "#000");
        showInfo2(rawData["year"], nodes[d.x].name, nodes[d.y].name, nodes[d.x].cnt, nodes[d.y].cnt, d.z);
        //d3.selectAll(".row").classed("active", function(d, i) { return i == p.y; });
        //d3.selectAll(".column").classed("active", function(d, i) { return i == p.x; });
    }

    function mouseout(d) {
        d3.selectAll(".deactive").classed("deactive", false);
        d3.selectAll("#Pack circle."+nodes[d.y].name).attr("stroke", "rgb(51, 153, 204)");
        d3.selectAll("#Pack circle."+nodes[d.x].name).attr("stroke", "rgb(51, 153, 204)");
        d3.select(".details").style("display", "none");
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
    selectedYear = $("#spinner input").val()-1999;
    drawPack(data[selectedYear]);
    //drawMatrix(data[selectedYear]);
    drawNode(data[selectedYear]);
    drawInfo($("#spinner input").val());
}

$("#spinner").spinner('changing', function(e, newVal, oldVal) {
    main();
});

d3.json('data/clustering.json').then(function(d){
    data = d;
    packInit();
    //matrixInit();
    seriesInit();
    main();
});

d3.json('data/dataSetWithKeyWords.json').then(function(d){
    articles = d;
    drawInfo($("#spinner input").val());
})