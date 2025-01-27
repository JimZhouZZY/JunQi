/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

import { node } from "./junqiNode.mjs";
import JunqiGraph from "./junqiGraph.mjs";

export default class JunqiBoard extends JunqiGraph {
  constructor() {
    super();
    this.rows = 12;
    this.cols = 5;
    this.init();
  }

  init() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const root_node = node(`${row}-${col}`);
        this.addNode(root_node);

        // 添加相邻节点的边
        if (row > 0) this.addEdge(root_node, node(`${row - 1}-${col}`)); // 上方节点
        if (col > 0) this.addEdge(root_node, node(`${row}-${col - 1}`)); // 左方节点
      }
    }

    // Camp edges
    this.addEdge(node("2-1"), node("1-0"));
    this.addEdge(node("2-1"), node("1-2"));
    this.addEdge(node("2-1"), node("3-2"));
    this.addEdge(node("2-1"), node("3-0"));
    this.addEdge(node("2-3"), node("1-2"));
    this.addEdge(node("2-3"), node("1-4"));
    this.addEdge(node("2-3"), node("3-4"));
    this.addEdge(node("2-3"), node("3-2"));
    this.addEdge(node("4-1"), node("3-0"));
    this.addEdge(node("4-1"), node("5-0"));
    this.addEdge(node("4-1"), node("3-2"));
    this.addEdge(node("4-1"), node("5-2"));
    this.addEdge(node("4-3"), node("3-2"));
    this.addEdge(node("4-3"), node("3-4"));
    this.addEdge(node("4-3"), node("5-2"));
    this.addEdge(node("4-3"), node("5-4"));
    this.addEdge(node("7-1"), node("6-0"));
    this.addEdge(node("7-1"), node("6-2"));
    this.addEdge(node("7-1"), node("8-2"));
    this.addEdge(node("7-1"), node("8-0"));
    this.addEdge(node("7-3"), node("6-2"));
    this.addEdge(node("7-3"), node("6-4"));
    this.addEdge(node("7-3"), node("8-4"));
    this.addEdge(node("7-3"), node("8-2"));
    this.addEdge(node("9-1"), node("8-0"));
    this.addEdge(node("9-1"), node("10-0"));
    this.addEdge(node("9-1"), node("8-2"));
    this.addEdge(node("9-1"), node("10-2"));
    this.addEdge(node("9-3"), node("8-2"));
    this.addEdge(node("9-3"), node("8-4"));
    this.addEdge(node("9-3"), node("10-2"));
    this.addEdge(node("9-3"), node("10-4"));

    // Remove extra edges
    this.removeEdge(node("5-1"), node("6-1"));
    this.removeEdge(node("5-3"), node("6-3"));

    // 添加铁路格子
    for (let i = 0; i < 5; i++) {
      this.addNode(node("1-" + String(i), "railway"));
      this.addNode(node("5-" + String(i), "railway"));
      this.addNode(node("6-" + String(i), "railway"));
      this.addNode(node("10-" + String(i), "railway"));
    }
    this.addNode(node("2-0", "railway"));
    this.addNode(node("8-0", "railway"));
    this.addNode(node("4-4", "railway"));
    this.addNode(node("3-0", "railway"));
    this.addNode(node("9-0", "railway"));
    this.addNode(node("7-4", "railway"));
    this.addNode(node("4-0", "railway"));
    this.addNode(node("2-4", "railway"));
    this.addNode(node("8-4", "railway"));
    this.addNode(node("7-0", "railway"));
    this.addNode(node("3-4", "railway"));
    this.addNode(node("9-4", "railway"));

    // 添加铁路的连接边
    for (let i = 0; i < 4; i++) {
      let str1 = String(i);
      let str2 = String(i + 1);
      this.addEdge(node("1-" + str1, "railway"), node("1-" + str2, "railway"));
      this.addEdge(node("5-" + str1, "railway"), node("5-" + str2, "railway"));
      this.addEdge(node("6-" + str1, "railway"), node("6-" + str2, "railway"));
      this.addEdge(
        node("10-" + str1, "railway"),
        node("10-" + str2, "railway"),
      );
    }
    for (let j = 1; j < 10; j++) {
      let str1 = String(j);
      let str2 = String(j + 1);
      this.addEdge(node(str1 + "-0", "railway"), node(str2 + "-0", "railway"));
      this.addEdge(node(str1 + "-4", "railway"), node(str2 + "-4", "railway"));
    }
    this.addEdge(node("5-2", "railway"), node("6-2", "railway"));
  }
}
