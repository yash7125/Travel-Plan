
function createGraph(V, E)
{
    let adj_list = [];
    
    for(let i = 0; i < V; i++)
    {
        adj_list.push([]);
    }

    for(let i = 0; i < E.length; i++)
    {
        adj_list[E[i][0]].push([E[i][1], E[i][2]]);
        adj_list[E[i][1]].push([E[i][0], E[i][2]]);
    }

    return adj_list;

}

function shortestPath(graph, V, src)
{   
    let vis = Array(V).fill(0);
    let dis = [];

    for(let i = 0; i < V; i++)
    {
        dis.push([1000, -1]);
    }

    dis[src][0] = 0;
    
    for(let i = 0; i < V - 1; i++)
    {   
        let mn = -1;

        for(let j = 0; j < V; j++)
        {
            if(vis[j] === 0)
            {
                if(mn === -1 || dis[j][0] < dis[mn][0])
                {
                    mn = j;
                }
            }
        }

        vis[mn] = 1;
        for(let j = 0; j < graph[mn].length; j++)
        {
            let edge = graph[mn][j];
            if(( (dis[mn][0] + edge[1]) < dis[edge[0]][0]) )
            {
                dis[edge[0]][0] = dis[mn][0] + edge[1];
                dis[edge[0]][1] = mn;
            }
        }
    }
    return dis;
}

let V = 9;
let Edges = [[0,1,4], [1,7,11], [0,7,8], [1,2,8], [2,8,2], [7,8,7], [7,6,1], [8,6,6], [6,5,2],
                [2,5,4], [2,3,7], [3,5,14], [5,4,10], [3,4,9]];

let graph = createGraph(V, Edges);
let distances = shortestPath(graph, V, 0);

console.log(distances);