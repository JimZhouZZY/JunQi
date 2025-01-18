/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const Queue = require('./classical/queue.js')
const UserNode = require('./userNode.js')

class UserQueue extends Queue {
    constructor(group_size = 2) {
        super();
        this.group_size = group_size
    }

    enqueueUser(username) {
        this.enqueue(username);
    }

    dequeueUser(username) {
        if (!this.head) return null;  // 队列为空

        let current = this.head;
        let previous = null;

        // 遍历队列查找目标用户
        while (current) {
            if (current.value === username) {
                // 找到目标用户
                if (previous) {
                    // 如果目标用户不是队头，修改前一个节点的 next 指针
                    previous.next = current.next;
                } else {
                    // 如果目标用户是队头，更新队头
                    this.head = current.next;
                }
                // 如果目标用户是队尾，更新队尾
                if (!current.next) {
                    this.tail = previous;
                }
                this.length--;
                return current.value;  // 返回被移除的用户名
            }
            // 向后移动
            previous = current;
            current = current.next;
        }
        return null;  // 如果未找到用户
    }

    isReady() {
        return (this.length >= this.group_size);
    }
}

module.exports = UserQueue;