class ArmyChessBoard1 {
    constructor(rows, cols) {
        this.rows = rows; // 棋盘行数
        this.cols = cols; // 棋盘列数
        this.adjList = new Map(); // 邻接表存储棋盘节点
        this.buildBoard(); // 自动生成棋盘
    }

    // 添加节点
    addNode(node) {
        if (!this.adjList.has(node)) {
            this.adjList.set(node, []);
        }
    }

    // 添加边（双向边）
    addEdge(node1, node2) {
        if (!this.adjList.has(node1)) this.addNode(node1);
        if (!this.adjList.has(node2)) this.addNode(node2);

        this.adjList.get(node1).push(node2);
        this.adjList.get(node2).push(node1);
    }

    // 自动生成棋盘
    buildBoard() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = `${row},${col}`; // 用 "行,列" 表示节点
                this.addNode(node);

                // 添加相邻节点的边
                if (row > 0) this.addEdge(node, `${row - 1},${col}`); // 上方节点
                if (col > 0) this.addEdge(node, `${row},${col - 1}`); // 左方节点
            }
        }
    }

    // 打印棋盘结构
    printBoard() {
        for (let [node, neighbors] of this.adjList) {
            console.log(`${node} -> ${neighbors.join(", ")}`);
        }
    }
    //删除边
    removeEdge(node1, node2) {
        if (this.adjList.has(node1)) {
            this.adjList.set(node1, this.adjList.get(node1).filter(n => n !== node2));
        }
        if (this.adjList.has(node2)) {
            this.adjList.set(node2, this.adjList.get(node2).filter(n => n !== node1));
        }
    }
    // 判断两个点是否邻接
    areAdjacent(node1, node2) {
        if (!this.adjList.has(node1) || !this.adjList.has(node2)) {
            return false; // 如果任意一个点不存在，直接返回 false
        }
        return this.adjList.get(node1).includes(node2); // 判断邻接表中是否包含目标点
    }
}

// 创建一个 12x5 的棋盘
const chessBoard = new ArmyChessBoard1(12, 5);

chessBoard.addEdge("2,1", "1,0");chessBoard.addEdge("2,1", "1,2");
chessBoard.addEdge("2,1", "3,2");chessBoard.addEdge("2,1", "3,0");
chessBoard.addEdge("2,3", "1,2");chessBoard.addEdge("2,3", "1,4");
chessBoard.addEdge("2,3", "3,4");chessBoard.addEdge("2,3", "3,2");
chessBoard.addEdge("4,1", "3,0");chessBoard.addEdge("4,1", "5,0");
chessBoard.addEdge("4,1", "3,2");chessBoard.addEdge("4,1", "5,2");
chessBoard.addEdge("4,3", "3,2");chessBoard.addEdge("4,3", "3,4");
chessBoard.addEdge("4,3", "5,2");chessBoard.addEdge("4,3", "5,4");
//构建红方行营边
chessBoard.addEdge("7,1", "6,0");chessBoard.addEdge("7,1", "6,2");
chessBoard.addEdge("7,1", "8,2");chessBoard.addEdge("7,1", "8,0");
chessBoard.addEdge("7,3", "6,2");chessBoard.addEdge("7,3", "6,4");
chessBoard.addEdge("7,3", "8,4");chessBoard.addEdge("7,3", "8,2");
chessBoard.addEdge("9,1", "8,0");chessBoard.addEdge("9,1", "10,0");
chessBoard.addEdge("9,1", "8,2");chessBoard.addEdge("9,1", "10,2");
chessBoard.addEdge("9,3", "8,2");chessBoard.addEdge("9,3", "8,4");
chessBoard.addEdge("9,3", "10,2");chessBoard.addEdge("9,3", "10,4");
//构建蓝方行营边
chessBoard.removeEdge("5,1","6,1");chessBoard.removeEdge("5,3","6,3");


//傻逼工兵能走铁路！！！
class ArmyChessBoard2 {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.adjList = new Map(); // 用邻接表表示图
        this.railwayNodes = new Set(); // 储存铁路格子的节点
    }

    // 添加节点
    addNode(node) {
        if (!this.adjList.has(node)) {
            this.adjList.set(node, []);
        }
    }

    // 添加双向边
    addEdge(node1, node2) {
        if (!this.adjList.has(node1)) this.addNode(node1);
        if (!this.adjList.has(node2)) this.addNode(node2);
        this.adjList.get(node1).push(node2);
        this.adjList.get(node2).push(node1);
    }

    // 添加铁路节点
    addRailwayNode(node) {
        this.railwayNodes.add(node);
    }

    // 判断是否是铁路节点
    isRailwayNode(node) {
        return this.railwayNodes.has(node);
    }

    // 工兵移动规则：沿铁路可以直行或转弯到任意未被阻挡的铁路节点
    canMoveAsEngineer(start, end, blockedNodes = new Set()) {
        if (!this.isRailwayNode(start) || !this.isRailwayNode(end)) {
            return false; // 起点或终点必须是铁路节点
        }

        // 广度优先搜索 (BFS) 找到从 start 到 end 的路径
        let queue = [start];
        let visited = new Set();
        visited.add(start);

        while (queue.length > 0) {
            const current = queue.shift();

            if (current === end) {
                return true; // 找到通路
            }

            // 遍历所有邻接节点
            for (const neighbor of this.adjList.get(current)) {
                if (
                    this.isRailwayNode(neighbor) && // 必须是铁路节点
                    !visited.has(neighbor) && // 未访问过
                    (!blockedNodes.has(neighbor) || end===neighbor )// 未被阻挡
                ) {
                    //console.log(neighbor);
                    queue.push(neighbor);
                    visited.add(neighbor);
                }
            }
        }

        return false; // 未找到通路
    }
}
const board = new ArmyChessBoard2(12,5);

// 添加铁路格子
for (let i=0; i<5; i++){
    let str=String(i);
    board.addRailwayNode("1,"+str);
}
for (let i=0; i<5; i++){
    let str=String(i);
    board.addRailwayNode("5,"+str);
}
for (let i=0; i<5; i++){
    let str=String(i);
    board.addRailwayNode("6,"+str);
}
for (let i=0; i<5; i++){
    let str=String(i);
    board.addRailwayNode("10,"+str);
}
board.addRailwayNode("2,0");board.addRailwayNode("8,0");board.addRailwayNode("4,4");
board.addRailwayNode("3,0");board.addRailwayNode("9,0");board.addRailwayNode("7,4");
board.addRailwayNode("4,0");board.addRailwayNode("2,4");board.addRailwayNode("8,4");
board.addRailwayNode("7,0");board.addRailwayNode("3,4");board.addRailwayNode("9,4");

// 添加铁路的连接边
for (let i=0; i<4; i++){
    let str1=String(i); let str2=String(i+1);
    board.addEdge("1,"+str1,"1,"+str2);
}
for (let i=0; i<4; i++){
    let str1=String(i); let str2=String(i+1);
    board.addEdge("5,"+str1,"5,"+str2);
}
for (let i=0; i<4; i++){
    let str1=String(i); let str2=String(i+1);
    board.addEdge("6,"+str1,"6,"+str2);
}
for (let i=0; i<4; i++){
    let str1=String(i); let str2=String(i+1);
    board.addEdge("10,"+str1,"10,"+str2);
}
for (let j=1; j<10; j++){
    let str1=String(j); let str2=String(j+1);
    board.addEdge(str1+",0",str2+",0");
}
for (let j=1; j<10; j++){
    let str1=String(j); let str2=String(j+1);
    board.addEdge(str1+",4",str2+",4");
}
board.addEdge("5,2", "6,2");

function isLegalAction(s,request){
    const blocked = new Set();

    function splitBySpace(inputString) {
        // 使用空格分割字符串
        return inputString.split(" ");
    }
    const result = splitBySpace(s);
    const s1=result[0]; const s2=result[1]; const s3=result[2]; const s4=result[3];

    const headi=request.charCodeAt(0)-97; const headj=Number(request[1])-1;
    const head=String(headi)+","+String(headj);

    const taili=request.charCodeAt(2)-97; const tailj=Number(request[3])-1;
    const tail=String(taili)+","+String(tailj);
    //console.log(headi,headj,taili,tailj)
    for (let i=0; i<12; i++){
        for (let j=0;j<5;j++){
            if (s1[i*5+j] !="0"){
                blocked.add(String(i)+","+String(j));
            }
        }
    }
    //建立标记点
    //判断兵种
    const Target=s1[headi*5+headj];
    const Goal=s1[taili*5+tailj];
    //同类相吃
    const a=Target.charCodeAt(0)-65;const b=Goal.charCodeAt(0)-65;
    if (( a>=0 && a<=26 && b>=0 && b<=26) || (a>26 && b>26)){
        return false;
    }
    //行营不能动
    if ((tail==="2,1" || tail==="2,3" || tail==="3,2" || tail==="4,1" || tail==="4,3" || 
        tail==="7,1" || tail==="7,3" || tail==="8,2" || tail==="9,1" || tail==="9,3" 
    ) && b!==-17 ){
        return false;
    }
    //自己走自己
    if (head===tail){
        return false;
    }
    //本身就是空的
    if (Target==="0"){
        return false;
    }
    let flag=true;
    if (Target === "d" || Target === "D" ){
        if (board.railwayNodes.has(head) && board.railwayNodes.has(tail)) {
            flag=board.canMoveAsEngineer(head,tail,blocked)
        }else{
            flag=chessBoard.areAdjacent(head, tail)
        }
    }else if (Target === "a" || Target === "A" || Target === "c" || Target === "C" || head==="0,1" || head==="11,1" || head==="0,3" || head==="11,3"){
        flag=false;
    }else{
        if (board.railwayNodes.has(head) && board.railwayNodes.has(tail)) {
            //flag=board.canMoveAsOther(head,tail,blocked)
            if (!(headi===taili)&& !(headj===tailj)){
                flag=false;
            }else{
                if (headi===taili){
                    for (let i=headj+1;i<tailj;i++){
                        let point=String(headi)+","+String(i)
                        if (blocked.has(point)){
                            flag=false;
                        }
                    }
                    flag=flag && chessBoard.areAdjacent(head,String(headi)+","+String(headj+1))
                }
                if (headj===tailj){
                    for (let i=headi+1;i<taili;i++){
                        let point=String(i)+","+String(headj);
                        if (blocked.has(point)){
                            flag=false;
                        }
                    }
                    flag=flag && chessBoard.areAdjacent(head,String(headi+1)+","+String(headj))
                }
                
            }
        }else{
            flag=chessBoard.areAdjacent(head, tail)
        }
    }
    return flag;
}
module.exports = isLegalAction;
