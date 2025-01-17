const { node } = require('./types/junqiNode.js');
const JunqiBoard = require('./types/junqiBoard');

class JunqiGame {
    constructor(jzn='0'.repeat(60)+' 0 0 0') {
        this.rows = 12;
        this.cols = 5;
        this.jzn = jzn; // JZN stands for 'Jim-Zhou Notation'
        this.board = new JunqiBoard();
    }

    isLegalAction(request) {
        const blocked = new Set();
        const s = this.jzn;
        const canMoveAsEngineer = (start, end, blockedNodes = new Set()) => {
            start = node(start, 'railway');
            end = node(end, 'railway');
            if (!start.type === 'railway' || !end.type === 'railway') {
                return false; // 起点或终点必须是铁路节点
            }

            // BFS

            let queue = [start];
            let visited = new Set();
            visited.add(start);

            while (queue.length > 0) {
                const current = queue.shift();

                if (current === end) {
                    return true; // 找到通路
                }

                // 遍历所有邻接节点
                for (const neighbor of this.board.getNeighbors(current)) {
                    if (
                        (neighbor.type == 'railway') && // 必须是铁路节点
                        !visited.has(neighbor) && // 未访问过
                        (!blockedNodes.has(neighbor) || end === neighbor)// 未被阻挡
                    ) {
                        queue.push(neighbor);
                        visited.add(neighbor);
                    }
                }
            }
            return false; // 未找到通路
        }

        function splitBySpace(inputString) {
            return inputString.split(" ");
        }

        const result = splitBySpace(s);
        const s1 = result[0]; const s2 = result[1]; const s3 = result[2]; const s4 = result[3];

        const headi = request.charCodeAt(0) - 97; const headj = Number(request[1]) - 1;
        const head = String(headi) + "-" + String(headj);

        const taili = request.charCodeAt(2) - 97; const tailj = Number(request[3]) - 1;
        const tail = String(taili) + "-" + String(tailj);

        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 5; j++) {
                if (s1[i * 5 + j] != "0") {
                    blocked.add(node(String(i) + "-" + String(j), 'railway'));
                }
            }
        }
        //建立标记点
        //判断兵种
        const Target = s1[headi * 5 + headj];
        const Goal = s1[taili * 5 + tailj];
        //同类相吃
        const a = Target.charCodeAt(0) - 65; const b = Goal.charCodeAt(0) - 65;
        if ((a >= 0 && a <= 26 && b >= 0 && b <= 26) || (a > 26 && b > 26)) {
            return false;
        }
        //行营不能动
        if ((tail === "2-1" || tail === "2-3" || tail === "3-2" || tail === "4-1" || tail === "4-3" ||
            tail === "7-1" || tail === "7-3" || tail === "8-2" || tail === "9-1" || tail === "9-3"
        ) && b !== -17) {
            return false;
        }
        //自己走自己
        if (head === tail) {
            return false;
        }
        //本身就是空的
        if (Target === "0") {
            return false;
        }
        let flag = true;
        if (Target === "d" || Target === "D") {
            if (this.board.adjList.has(node(head, 'railway')) && this.board.adjList.has(node(tail, 'railway'))) {
                flag = canMoveAsEngineer(head, tail, blocked);
            } else {
                flag = this.board.areAdjacent(node(head), node(tail));
            }
        } else if (Target === "a" || Target === "A" || Target === "c" || Target === "C" || head === "0-1" || head === "11-1" || head === "0-3" || head === "11-3") {
            flag = false;
        } else {
            if (this.board.adjList.has(node(head, 'railway')) && this.board.adjList.has(node(tail, 'railway'))) {
                if ((!(headi === taili) && !(headj === tailj))
                    || ((headi === taili) && ([1, 5, 6, 10].indexOf(headi) === -1))
                    || ((headj === tailj) && ([0, 4].indexOf(headj) === -1))
                    ) {
                    flag = false;
                } else {
                    if (headi === taili) {
                        if (tailj > headj){
                            for (let i = headj + 1; i < tailj; i++) {
                                let point = node(String(headi) + "-" + String(i), 'railway')
                                if (blocked.has(point)) {
                                    flag = false;
                                }
                            }
                        } else {
                            for (let i = headj - 1; i > tailj; i--) {
                                let point = node(String(headi) + "-" + String(i), 'railway')
                                if (blocked.has(point)) {
                                    flag = false;
                                }
                            }
                        }
                    }
                    if (headj === tailj) {
                        if ((headj == 1 || headj == 3)
                            && (headi == 5 && taili == 6) || (taili == 5 && headi == 6)
                        ) {
                            flag = false;
                        }
                        if (taili > headi){
                            for (let i = headi + 1; i < taili; i++) {
                                let point = node(String(i) + "-" + String(headj), 'railway');
                                if (blocked.has(point)) {
                                    flag = false;
                                }
                            }
                        } else {
                            for (let i = headi - 1; i > taili; i--) {
                                let point = node(String(i) + "-" + String(headj), 'railway');
                                if (blocked.has(point)) {
                                    flag = false;
                                }
                            }
                        }
                    }

                }
            } else {
                flag = false;
            }
            flag = flag || this.board.areAdjacent(node(head), node(tail));
        }
        return flag;
    }

    applyAction(request){
        function splitBySpace(inputString) {
            // 使用空格分割字符串
            return inputString.split(" ");
        }
        const s = this.jzn;
        const result = splitBySpace(s);
        let s1 = result[0]; let s2 = result[1]; let s3 = Number(result[2]); let s4 = Number(result[3]);
        const headi = request.charCodeAt(0) - 97; const headj = Number(request[1]) - 1;
        const taili = request.charCodeAt(2) - 97; const tailj = Number(request[3]) - 1;
        const Target = s1[headi * 5 + headj];
        const Goal = s1[taili * 5 + tailj];
        let flag=true;
        function StringChange(s,index,change){
            return s.slice(0,index)+change+s.slice(index+1);
        }
        //console.log(s1[59])
        if (Target === "d" || Target === "D") {
            if (Goal === "d" || Goal === "D") {
                s1=StringChange(s1,headi * 5 + headj,"0");
                s1=StringChange(s1,taili * 5 + tailj,"0");
                flag=false;
            }else{
                if (Goal === "c" || Goal === "C") {
                    s1=StringChange(s1,headi * 5 + headj,"0");
                    s1=StringChange(s1,taili * 5 + tailj,Target);
                    flag=false;
                }else{
                    s1=StringChange(s1,headi * 5 + headj,"0");
                    flag=false;
                }
            }
        }
        if (Target === "b" || Target === "B") {
            s1=StringChange(s1,headi * 5 + headj,"0");
            s1=StringChange(s1,taili * 5 + tailj,"0");
            flag=false;
        }
        let a = Target.charCodeAt(0); let b = Goal.charCodeAt(0);
        if (a<97){
            a=a+32;
        }
        if (b<97){
            b=b+32;
        }
        const T2=String.fromCharCode(a);const G2=String.fromCharCode(b);
        //console.log(T2,G2)
        if (T2>G2){
            s1=StringChange(s1,headi * 5 + headj,"0");
            s1=StringChange(s1,taili * 5 + tailj,Target);
            flag=false;
        }else{
            if (T2<G2){
                s1=StringChange(s1,headi * 5 + headj,"0");
                flag=false;
            }else{
                s1=StringChange(s1,headi * 5 + headj,"0");
                s1=StringChange(s1,taili * 5 + tailj,"0");
                flag=false;
            }
        }
        //console.log(flag);
        //s1[0]="w"
       // console.log(s1);
        s4=s4+1;
        if (flag!==true){
            s3=1;
        }
        if (s2==="r"){
            s2="b";
        }else{
            s2="r";
        }
        let st=s1+" "+s2+" "+String(s3)+" "+String(s4);
        this.jzn = st;
        console.log(this.jzn);
        return st;
    }

    getJzn() {
        return this.jzn;
    }
}

a = new JunqiGame("0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0 0 0 0");
//console.log(a.isLegalAction('f4g4'));

module.exports = JunqiGame;
