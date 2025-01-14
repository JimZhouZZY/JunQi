class JunqiNode {
    constructor(name, type='normal') {
        this.name = name;
        this.type = type;
    }
}

nodeCache = new Map();

function node(name, type='normal') {
    const key = `${name}-${type}`;        
    if (!this.nodeCache.has(key)) {
        this.nodeCache.set(key, new JunqiNode(name, type));
    }
    return this.nodeCache.get(key);
}

module.exports = { node , JunqiNode };