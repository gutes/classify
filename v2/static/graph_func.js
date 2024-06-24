class Grafo {
    constructor(v) {
        this.V = v;
        this.parent = new Array(v).fill(0).map((_, index) => index);
        this.rank = new Array(v).fill(0);
        this.initArrays()
    }

    initArrays() {
        this.adjListArray = [];

        this.components = new Array(this.V).fill(0).map((_, index) => [index]);

        for (let i = 0; i < this.V; i++) {
            this.adjListArray.push([]);
        }
    }

    reset() {
        this.initArrays();
    }

    find(node) {
        if (this.parent[node] !== node) {
            this.parent[node] = this.find(this.parent[node]);
        }
        return this.parent[node];
    }

    union(node1, node2) {
        let root1 = this.find(node1);
        let root2 = this.find(node2);

        if (root1 !== root2) {
            if (this.rank[root1] > this.rank[root2]) {
                this.parent[root2] = root1;
                this.mergeComponents(root1, root2);
            } else if (this.rank[root1] < this.rank[root2]) {
                this.parent[root1] = root2;
                this.mergeComponents(root2, root1);
            } else {
                this.parent[root2] = root1;
                this.rank[root1]++;
                this.mergeComponents(root1, root2);
            }
        }
    }

    mergeComponents(root1, root2) {
        let comp1 = this.components[root1];
        let comp2 = this.components[root2];
        this.components[root1] = comp1.concat(comp2);
        this.components[root2] = [];
    }

    addEdge(src, dest) {
        this.adjListArray[src].push(dest);
        this.adjListArray[dest].push(src);
        this.union(src, dest);
    }

    removeEdgesOfNode(node) {
        this.adjListArray[node].forEach(element => {
            this.adjListArray[element].splice(this.adjListArray[element].indexOf(node), 1);
        });
        this.adjListArray[node] = [];

        // Reset Union-Find structures and recompute components
        this.parent = new Array(this.V).fill(0).map((_, index) => index);
        this.rank = new Array(this.V).fill(0);
        this.components = new Array(this.V).fill(0).map((_, index) => [index]);

        for (let i = 0; i < this.V; i++) {
            for (let j = 0; j < this.adjListArray[i].length; j++) {
                this.union(i, this.adjListArray[i][j]);
            }
        }
    }

    getConnectedComponentsNumber(filterNodes = []) {
        let result = this.components.filter(component => component.length > 0 && filterNodes.includes(component[0]));
        return result.length;
    }

    getConnectedComponents() {
        let result = this.components.filter(component => component.length > 0);
        return result;
    }
}

// // Ejemplo de uso
// let grafo = new Grafo(5);
// grafo.addEdge(0, 1);
// grafo.addEdge(0, 4);
// grafo.addEdge(1, 2);
// grafo.addEdge(1, 3);
// grafo.addEdge(1, 4);
// grafo.addEdge(2, 3);
// grafo.addEdge(3, 4);

// console.log("Componentes Conectadas:");
// console.log(grafo.getConnectedComponents());


// class Grafo {
//     constructor(v) {
//         this.V = v;
//         this.initEdges();
//     }

//     initEdges() {
//         this.adjListArray = [];
//         this.reset();
//     }

//     reset() {
//         // Crear una nueva lista para cada vértice
//         // de modo que los nodos adyacentes puedan ser almacenados
//         for (let i = 0; i < this.V; i++) {
//             this.adjListArray.push([]);
//         }

//     }

//     // Añadir un borde a un grafo no dirigido
//     addEdge(src, dest) {
//         // Añadir un borde desde src a dest
//         this.adjListArray[src].push(dest);

//         // Como el grafo es no dirigido, añadir un borde de dest a src también
//         this.adjListArray[dest].push(src);
//     }

//     removeEdgesOfNode(node) {
//         this.adjListArray[node].forEach(element => {
//             this.adjListArray[element].splice(this.adjListArray[element].indexOf(node), 1);
//         });

//         this.adjListArray[node] = [];
//     }

//     DFSUtil(v, visited, component) {
//         visited[v] = true;
//         component.push(v);

//         for (let x = 0; x < this.adjListArray[v].length; x++) {
//             if (!visited[this.adjListArray[v][x]]) {
//                 this.DFSUtil(this.adjListArray[v][x], visited, component);
//             }
//         }
//     }

//     connectedComponents() {
//         let visited = new Array(this.V).fill(false);
//         let components = [];

//         for (let v = 0; v < this.V; ++v) {
//             if (!visited[v]) {
//                 let component = [];
//                 this.DFSUtil(v, visited, component);
//                 components.push(component);
//             }
//         }

//         return components;
//     }
// }

// // Ejemplo de uso
// let grafo = new Grafo(5);
// grafo.addEdge(0, 1);
// grafo.addEdge(0, 4);
// grafo.addEdge(1, 2);
// grafo.addEdge(1, 3);
// grafo.addEdge(1, 4);
// grafo.addEdge(2, 3);
// grafo.addEdge(3, 4);

// console.log("Componentes Conectadas:");
// grafo.connectedComponents();


// let V;
// let adjListArray=[];

// // constructor
// function Graph(v)
// {
//     V = v

//         // define the size of array as
//         // number of vertices

//         // Create a new list for each vertex
//         // such that adjacent nodes can be stored

//         for (let i = 0; i < V; i++) {
//             adjListArray.push([]);
//         }
// }

// // Adds an edge to an undirected graph
// function addEdge(src,dest)
// {
//     // Add an edge from src to dest.
//         adjListArray[src].push(dest);

//         // Since graph is undirected, add an edge from dest
//         // to src also
//         adjListArray[dest].push(src);
// }

// function removeEdgesOfNode(node)
// {
//     adjListArray[node].forEach(element => {
//         adjListArray[element].splice(adjListArray[element].indexOf(node), 1);
//     });

//     adjListArray[node] = [];
// }

// function DFSUtil(v,visited)
// {
//     // Mark the current node as visited and print it
//         visited[v] = true;
//         document.write(v + " ");

//         // Recur for all the vertices
//         // adjacent to this vertex
//         for (let x = 0; x < adjListArray[v].length; x++)
//         {
//             if (!visited[adjListArray[v][x]])
//                 DFSUtil(adjListArray[v][x], visited);
//         }
// }

// function connectedComponents()
// {
//     // Mark all the vertices as not visited
//         let visited = new Array(V);
//         for(let i = 0; i < V; i++)
//         {
//             visited[i] = false;
//         }
//         for (let v = 0; v < V; ++v)
//         {
//             if (!visited[v])
//             {
//                 // print all reachable vertices
//                 // from v
//                 DFSUtil(v, visited);
//                 document.write("<br>");
//             }
//         }
// }
