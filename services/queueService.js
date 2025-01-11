const UserQueue = require('./types/userQueue');
const matchService = require('./matchService');
const queue = require('../sockets/queue');
const queues = {};
queues['main'] = new UserQueue(2);

const locks = {};

async function tryStartMatch(queuename) {
    if (locks[queuename]) return; // 防止重复执行
    locks[queuename] = true;

    try {
        if (queues[queuename].isReady()){
            usernames = await exports.dequeueSpecificQueue(queuename);

            console.log(usernames);
            // TODO: multiple match types
            matchService.startMatch(usernames);
        }
    } finally {
        locks[queuename] = false;
    }
}

exports.joinSpecificQueue = async function(username, queuename) {
    queues[queuename].enqueueUser(username);
    console.log(queues[queuename]);
    tryStartMatch(queuename);
}

exports.leaveSpecificQueue = async function(username, queuename) {
    queues[queuename].dequeueUser(username);
}

exports.dequeueSpecificQueue = async function(queuename) {
    let queue = queues[queuename];
    let usernames = [];
    for (let i=0; i < queue.group_size; i++) {
        console.log(queue.peek());
        usernames.push(queue.peek());
        queue.dequeue();
    }
    return usernames;
} 
