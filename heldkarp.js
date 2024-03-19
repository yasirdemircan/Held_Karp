//Held-Karp dynamic programming implementation for 16 node Traveling Salesman problem

//Importing fs to read graph data
var fs = require("fs")

class wGraph {
    nodes = null
    edges = null
    Dmatrix = null

    constructor(nodeArray) {
        //Assign name of nodes
        this.nodes = nodeArray
        //Empty edge array
        this.edges = []
        //Distance matrix initialization
        this.Dmatrix = []

        // Fill the distance matrix with infinities (if X and Y has no connection will stay infinity)
        for (let i = 0; i < this.nodes.length; i++) {
            this.Dmatrix[i] = []
            for (let j = 0; j < this.nodes.length; j++) {
                this.Dmatrix[i][j] = Infinity

            }
        }



    }

    //Bidirectional connection 
    connect(X, Y, Weight) {
        //Self distance
        this.Dmatrix[this.nodes.indexOf(X)][this.nodes.indexOf(X)] = 0
        this.Dmatrix[this.nodes.indexOf(Y)][this.nodes.indexOf(Y)] = 0
        //Vertexes distance
        this.Dmatrix[this.nodes.indexOf(X)][this.nodes.indexOf(Y)] = Weight
        this.Dmatrix[this.nodes.indexOf(Y)][this.nodes.indexOf(X)] = Weight

        this.edges.push({ source: X, destination: Y, weight: Weight })
        this.edges.push({ source: Y, destination: X, weight: Weight })
    }

}


//New set for node names
let nodes = new Set()
//Read raw graph data
var rawData = fs.readFileSync("./graph.txt").toString('utf-8')
const rawEdges = rawData.split(";")
//Push all node names into a set (to discover node names)
for (let edge of rawEdges) {
    let values = edge.split(" ")
    nodes.add(values[0])
    nodes.add(values[1])
}
//Convert node names into array for modification
nodes = Array.from(nodes)
//Get root node to 0th for simplicity
let temp = nodes[0]
nodes[0] = nodes[2]
nodes[2] = temp
//Create a new graph from the node names
const G = new wGraph(nodes)
//For each edge add a connection
for (let edge of rawEdges) {
    let edgeData = edge.split(" ")
    G.connect(edgeData[0], edgeData[1], parseInt(edgeData[2]))
}


//Map for dynamic programming values
var eqs = new Map()

function Held_Karp(x, arr) {
    //Define return array for min operation
    let retArr = []
    //Name of equation x, [y]
    let eqname = x.toString() + "," + JSON.stringify(arr)
    if (eqs.has(eqname)) {
        //If equation solution exists return it
        return eqs.get(eqname)
    } else {
        //If array part is more than 0
        if (arr.length > 0) {
            //For each node calculate the function
            arr.forEach(element => {
                retArr.push(G.Dmatrix[x][element] + Held_Karp(element, [...arr].filter((x) => x != element)))
            })
            //Set equation solution into the array
            eqs.set(eqname, Math.min(...retArr))
            //Return equation solution
            return Math.min(...retArr)
        } else {
            //If the array is empty return the distance to the root node
            eqs.set(eqname, G.Dmatrix[0][x])
            return G.Dmatrix[0][x]
        }


    }

}

//Run the recursive held-karp implementation on the problem Held_Karp (root node (all nodes - root node))
Held_Karp(0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

//The solution (get value of last element of the equations map)
console.log(eqs.get(Array.from(eqs.keys()).at(-1)))

