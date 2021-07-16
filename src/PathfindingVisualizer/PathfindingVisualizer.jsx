import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if(node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-start-visited'
        }
        else if(node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish-visited'
        }
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if(node.isStart){
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path-start'
        }
        else if(node.isFinish){
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path-finish'
        }
        else{
          document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
        }
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearNode(node){
    node.isVisited = false;
    node.distance = Infinity;
    node.previousNode = null;
  }
  
  clearWalls(){
    const {grid} = this.state;
    for (let row = 0; row < 20; row++){
      for (let col = 0; col < 50; col++){
        if(grid[row][col].isWall === true){
          grid[row][col].isWall = false;
        }
      }
    }
    const NewGrid = ReRenderGrid(grid);
    this.setState({grid: NewGrid});
  }
  
  clearPath(){ 
    const {grid} = this.state;
    for (let row = 0; row < 20; row++){
      for (let col = 0; col < 50; col++){
        this.clearNode(grid[row][col]);
        if(grid[row][col].isStart){
          document.getElementById(`node-${row}-${col}`).className =
        'node node-start';
        }
        else if(grid[row][col].isFinish){
          document.getElementById(`node-${row}-${col}`).className =
        'node node-finish';
        }else if(grid[row][col].isWall){
          continue
        }
        else{
          document.getElementById(`node-${row}-${col}`).className =
        'node node-clearnode';
        }
      }
    }  
  }

  clearBoard(){
    this.clearPath();
    this.clearWalls();
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    const NewGrid = ReRenderGrid(grid);
    this.setState({grid: NewGrid});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button className= "button" onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button className= "button" onClick={() => this.clearWalls()}>
          Clear Walls
        </button>
        <button className= "button" onClick={() => this.clearPath()}>
          Clear Path
        </button>
        <button className= "button" onClick={() => this.clearBoard()}>
          Clear Board
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  }
  newGrid[row][col] = newNode;
  return newGrid;
}

const ReRenderGrid = (grid) => {
  const newGrid = grid.slice();
  return newGrid;
}