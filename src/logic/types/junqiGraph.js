/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

class JunqiGraph {
  constructor() {
    this.adjList = new Map();
  }

  addNode(node) {
    if (!this.adjList.has(node)) {
      this.adjList.set(node, new Set());
    }
  }

  removeNode(node) {
    if (this.adjList.has(node)) {
      for (const neighbor of this.adjList.get(node)) {
        this.adjList.get(neighbor).delete(node);
      }
      this.adjList.delete(node);
    }
  }

  addEdge(node1, node2) {
    this.addNode(node1);
    this.addNode(node2);
    this.adjList.get(node1).add(node2);
    this.adjList.get(node2).add(node1);
  }

  removeEdge(node1, node2) {
    if (this.adjList.has(node1)) {
      this.adjList.get(node1).delete(node2);
    }
    if (this.adjList.has(node2)) {
      this.adjList.get(node2).delete(node1);
    }
  }

  areAdjacent(node1, node2) {
    return (
      this.adjList.has(node1) &&
      (this.adjList.get(node1).has(node2) || this.adjList.get(node2).has(node1))
    );
  }

  getNeighbors(node) {
    return this.adjList.has(node) ? Array.from(this.adjList.get(node)) : [];
  }
}

module.exports = JunqiGraph;
