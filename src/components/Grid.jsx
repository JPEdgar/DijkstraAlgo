import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import FindNeighbor from "../algorithms/FindNeighbor";
import BuildGrid from "./BuildGrid";
import { StartNode, GridDetails } from "./GridSettings";

export default function Grid() {
  const grid = useState(BuildGrid);
  const [startSearchedAnimation, setStartSearchedAnimation] = useState(false);
  const [searchedNodes, setSearchedNodes] = useState([]);
  const [luckyNode, setLuckyNode] = useState([]); // the node that found the end.
  let searchNode = [];
  let searchArray = [];
  let isSearching = false;
  const animDelay = 50;

  useEffect(() => {
    if (startSearchedAnimation) {
      let timoutDelay = GridDetails.numRows * GridDetails.numRows * 50;
      // console.log(timoutDelay);
      AnimateSearchedNodes();
      setTimeout(() => {
        // console.log("timeout done");
        AnimatePath();
      }, timoutDelay);
    }
  }, [startSearchedAnimation]);

  function AnimateSearchedNodes() {
    const tempSearched = [...searchedNodes];
    let count = 0;
    const interval = setInterval(() => {
      if (count < searchedNodes.length) {
        const activeNode = tempSearched.shift();
        const element = document.getElementById(
          `${activeNode[0]}, ${activeNode[1]}`
        );
        const shorthand = ReactDOM.findDOMNode(element).classList;
        shorthand.add("visitedNode");
      }
      count++;
    }, animDelay);
    return () => clearInterval(interval);
  }

  function AnimatePath() {
    const listOfChildren = [`${luckyNode[0]}, ${luckyNode[1]}`];
    let search = true;
    const start = StartNode.xLoc + ", " + StartNode.yLoc;
    while (search) {
      let parent = listOfChildren.slice(-1);
      if (parent[0] == start) {
        search = false;
      } else {
        const element = document.getElementById(parent);
        listOfChildren.push(element.getAttribute("parent-node"));
      }
    }

    let i = listOfChildren.length;
    const interval = setInterval(() => {
      if (i > 0) {
        i--;
        let path = listOfChildren.pop();
        if (path != start) {
          const element = document.getElementById(path);
          const shorthand = ReactDOM.findDOMNode(element).classList;
          shorthand.add("pathNode")
        }
      }
    }, animDelay);
    return () => clearInterval(interval);
  }

  function testSearch() {
    do {
      GetNeighbor();
    } while (isSearching);
  }

  function GetNeighbor() {
    if (searchArray.length <= 0 && !isSearching) {
      searchNode = [StartNode.xLoc, StartNode.yLoc];
      isSearching = true;
    } else if (searchArray.length > 0 && isSearching) {
      // search is in node
      searchNode = searchArray.shift();
    } else {
      // search is over
      isSearching = false; // error here.  searchArray.length = 0 and isSearching = false, which starts the search over again.
    }

    if (searchNode.length > 0) {
      const searchResults = FindNeighbor(searchNode); // returns [returnArr (arr), continueSearch (bool), foundEnd (bool)];
      let continueSearch = searchResults[1];
      let foundEnd = searchResults[2];
      setLuckyNode(searchResults[3]);

      if (continueSearch) {
        searchArray = searchArray.concat(searchResults[0]);
        setSearchedNodes((curr) => curr.concat(searchResults[0]));
      } else {
        searchArray = searchResults[0];
        setSearchedNodes((curr) => curr.concat(searchResults[0]));
      }

      if (foundEnd) {
        setStartSearchedAnimation(true);
      }
    }
  }

  return (
    <>
      {grid[0].map((data) => {
        return data.map((cellInfo) => {
          return cellInfo.cell;
        });
      })}
      <div style={{ marginTop: "10px", marginLeft: "20px" }}>
        <button onClick={() => console.log(grid)}>Print Grid</button>
        <button
          onClick={() => console.log(searchArray)}
          style={{ marginLeft: "10px" }}
        >
          Print Search Array
        </button>
      </div>
      <div style={{ marginTop: "10px", marginLeft: "20px" }}>
        <button onClick={() => testSearch()}>Find Neighbor</button>
      </div>
    </>
  );
}

/*

  const [startNode, setStartNode] = useState(false);

  function SetStart() {
    setStartNode(!startNode);

  }


        <button
          style={{ backgroundColor: startNode ? "yellow" : "lightgray" }}
          onClick={() => SetStart()}
        >
          Set Start Node
        </button>

*/
