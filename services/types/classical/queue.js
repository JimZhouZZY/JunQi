const Node = require('./node');

class Queue {
    constructor() {
        this.head = null; // 队头
        this.tail = null; // 队尾
        this.length = 0;
    }

    // 入队
    enqueue(value) {
        const newNode = new Node(value);
        if (this.tail) {
            this.tail.next = newNode;
        }
        this.tail = newNode;
        if (!this.head) {
            this.head = newNode;
        }
        this.length++;
    }

    // 出队
    dequeue() {
        if (!this.head) return null;
        const value = this.head.value;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null;
        }
        this.length--;
        return value;
    }

    // 查看队头
    peek() {
        return this.head ? this.head.value : null;
    }

    // 判断队列是否为空
    isEmpty() {
        return this.head === null;
    }
}

module.exports = Queue;