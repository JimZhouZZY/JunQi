class JunqiNode {
    constructor(name, type='normal') {
        this.name = name;
        this.type = type;
    }
}

const nodeCache = new Map();

function node(name, type='normal') {
    const key = `${name}-${type}`;        
    if (!nodeCache.has(key)) {
        nodeCache.set(key, new JunqiNode(name, type));
    }
    return nodeCache.get(key);
}

export { node , JunqiNode };