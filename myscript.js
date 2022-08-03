onload = function() 
{   
    let V, cur_data, src, dest;

    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const Gen = document.getElementById('generate-graph'); 
    const solve = document.getElementById('solve-graph');
    const temptext2 = document.getElementById('temptext2');
    const temptext = document.getElementById('temptext');
    
    const places = ['Navi Mumbai', 'Delhi', 'Goa', 'Kerala', 'Andhra Pradesh', 
                    'Bangalore', 'Hyderabad', 'Gujarat', 'J&K', 'Ladakh'];
    
    const options = {
        nodes: {
            font: '12px arial purple',
            shape: 'icon',
            scaling: {
                label: true
            },
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                color: '#991133',
                size: 40,
            }
        },
        edges: {
            font: {
                size: 20
            },
            labelHighlightBold: true
        }
    };

    const network = new vis.Network(container);
    const network2 = new vis.Network(container2);

    network.setOptions(options);
    network2.setOptions(options);

    function createGraphData()
    {
        V = Math.floor(Math.random() * 8) + 1;
        let nodes = [];

        for(let i = 1; i <= V; i++)
        {
            nodes.push({id: i, label: places[i - 1]});
        }

        nodes = new vis.DataSet(nodes);

        let Edges = [];

        //tree
        for(let i = 2; i <= V; i++)
        {
            let neighbour = i - Math.floor(Math.random() * Math.min(i - 1, 3) + 1);
            Edges.push({type: 0, from: i, to: neighbour, color: 'red', label: String(Math.floor(Math.random()*80) + 30)});
        }

        //adding more edges
        for(let i = 1; i <= V / 2;)
        {
            let node1 = Math.floor(Math.random() * V) + 1;
            let node2 = Math.floor(Math.random() * V) + 1;

            if(node1 === node2) {continue;}

            if(node1 < node2)
            {
                let tmp = node1;
                node1 = node2;
                node2 = tmp;
            }

            let check = 0;

            for(let j = 0; j < Edges.length; j++)
            {
                if(Edges[j]['from'] === node1 && Edges[j]['to'] === node2)
                {
                    if(Edges[j]['type'] === 0)
                    {
                        check = 1;
                    }
                    else
                    {
                        check = 2;
                    }
                }   
            }

            if(check <= 1)
            {
                if(check === 0 && i < V / 4)
                {
                    Edges.push({
                        type: 0,
                        from: node1,
                        to: node2,
                        color: 'red',
                        label: String(Math.floor(Math.random() * 80) + 30)
                    });
                }
                else
                {
                    Edges.push({
                        type: 1,
                        from: node1,
                        to: node2,
                        color: 'blue',
                        label: String(Math.floor(Math.random() * 50) + 10)
                    });
                }
                i++;
            }

        }

        src = 1;
        dest = V;

        cur_data = {
            nodes: nodes,
            edges: Edges
        };

    }

    Gen.onclick = function() {
        createGraphData();
        network.setData(cur_data);
        temptext2.innerText = 'Find the minimum time from ' + places[src-1] + ' to ' + places[dest-1];
        temptext.style.display = "inline";
        temptext2.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function() {
        temptext.style.display = "none";
        temptext2.style.display = "none";
        container2.style.display = "inline";
        const data = solveGraphData();
        network2.setData(data);
    };

    function createGraph(data)
    {
        let graph = [];
        for(let i = 0; i < V; i++)
        {
            graph.push([]);
        }

        for(let i = 0; i < data['edges'].length; i++)
        {
            let edge = data['edges'][i];
            if(edge['type'] === 1) continue;
            graph[edge['from']-1].push([edge['to']-1, parseInt(edge['label'])]);
            graph[edge['to']-1].push([edge['from']-1, parseInt(edge['label'])]);
        }

        return graph;

    }

    function shortestPath(graph, src, sz)
    {
        let dis = [];
        let vis = Array(sz).fill(0);

        for(let i = 0; i < sz; i++)
        {
            dis.push([10000, -1]);
        }

        dis[src][0] = 0;

        for(let i = 0; i < sz - 1; i++)
        {
            let mn = -1;

            for(let j = 0; j < sz; j++)
            {
                if((vis[j] === 0) && (mn === -1 || dis[mn][0] > dis[j][0]))
                {
                    mn = j;
                }
            }

            vis[mn] = 1;

            for(let j = 0; j < graph[mn].length; j++)
            {
                let edge = graph[mn][j];
                if((dis[mn][0] + edge[1]) < dis[edge[0]][0])
                {
                    dis[edge[0]][0] = dis[mn][0] + edge[1];
                    dis[edge[0]][1] = mn;
                }
            }

        }

        return dis;

    }

    function takePlane(edges, dis1, dis2, min_dis)
    {
        let p1 = -1, p2 = -1, plane = 0;

        for(let pos in edges)
        {
            let edge = edges[pos];
            if(edge['type'] === 1)
            {
                let from = edge['from'] - 1;
                let to = edge['to'] - 1;
                let wt = parseInt(edge['label']);

                if((dis1[to][0] + wt + dis2[from][0]) < min_dis)
                {
                    min_dis = dis1[to][0] + wt + dis2[from][0];
                    p1 = to;
                    p2 = from;
                    plane = wt;
                }
                if((dis2[to][0] + wt + dis1[from][0]) < min_dis)
                {
                    p2 = to;
                    p1 = from;
                    min_dis = dis2[to][0] + dis1[from][0] + wt;
                    plane = wt;
                }
            }
        }

        return {plane, p1, p2};

    }
    
    function solveGraphData()
    {   
        const data = cur_data;

        const graph = createGraph(data);

        let dist1 = shortestPath(graph, src - 1, V);
        let dist2 = shortestPath(graph, dest - 1, V);

        let min_dis = dist1[dest - 1][0];

        let {plane, p1, p2} = takePlane(data['edges'], dist1, dist2, min_dis);

        let new_edges = [];
        if(plane !== 0)
        {
            new_edges.push({arrows: {to: {enabled: true}}, from: p1+1, to: p2+1, color: 'blue', label:String(plane)});
            new_edges.push(...pushEdges(dist1, p1, false));
            new_edges.push(...pushEdges(dist2, p2, true));      
        }
        else
        {
            new_edges.push(...pushEdges(dist1, dest-1, false));
        }

        const ans = {
            nodes: data['nodes'],
            edges: new_edges
        };

        return ans;

    }

    function pushEdges(dis, cur, reverse)
    {
        let tmp = [];
        while(dis[cur][0] != 0)
        {   
            let fm = dis[cur][1];
            if(reverse)
            {
                tmp.push({arrows: {to: {enabled: true}},from:cur+1,to:fm+1,color:'red',label:String(dis[cur][0]-dis[fm][0])});
            }
            else
            {
                tmp.push({arrows: {to: {enabled: true}},from:fm+1,to:cur+1,color:'red',label:String(dis[cur][0]-dis[fm][0])})
            }
            cur = fm;
        }
        return tmp;
    }
    
    Gen.click();
    // solve.click();
    
};