import React from "react";
import ReactDOM from "react-dom";
import { GridDetails, StartNode, EndNode } from "./GridSettings";

export default function BuildGrid() {
  const grid = [];
  for (let i = 0; i < GridDetails.numCols; i++) {
    grid.push([]);
    for (let j = 0; j < GridDetails.numRows; j++) {
      grid[i].push(BuildCell(i, j));
    }
  }
  return grid;
}

function BuildCell(xLoc, yLoc) {
  const leftPos = xLoc * GridDetails.cellSize + GridDetails.gridMargin;
  const topPos = yLoc * GridDetails.cellSize + GridDetails.gridMargin;
  const id = `${xLoc}, ${yLoc}`;
  let tempClass;
  let wasVisited;

  if (StartNode.xLoc === xLoc && StartNode.yLoc === yLoc) {
    tempClass = "grid startNode";
    wasVisited = true;
  } else if (EndNode.xLoc === xLoc && EndNode.yLoc === yLoc) {
    tempClass = "grid endNode";
    wasVisited = true;
  } else {
    tempClass = "grid";
    wasVisited = false;
  }

  const cellData = {
    id: id,
    cell: (
      <div
        key={id}
        id={id}
        was-visited={wasVisited.toString()}
        parent-node=""
        distance=""
        onClick={(e) => SetWall(e)}
        className={tempClass}
        style={{
          top: `${topPos}px`,
          left: `${leftPos}px`,
          height: `${GridDetails.cellSize}px`,
          width: `${GridDetails.cellSize}px`,
          border: "1px solid black",
        }}
      >
        {/* {xLoc}, {yLoc} */}
      </div>
    ),
  };

  function SetWall(e) {
    const element = document.getElementById(e.target.id);
    console.log(element);
    const shorthand = ReactDOM.findDOMNode(element).classList;
    if (shorthand.contains("startNode") || shorthand.contains("endNode")) {
      return;
    }
    
    if (shorthand.contains("wallNode")) {
      shorthand.remove("wallNode");
    } else {
      shorthand.add("wallNode");
    }
    
  }
  return cellData;
}
