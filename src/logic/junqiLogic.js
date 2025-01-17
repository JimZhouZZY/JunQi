const { node } = require('./types/junqiNode.js');
const JunqiBoard = require('./types/junqiBoard');

class JunqiGame {
    constructor(jzn='0'.repeat(60)+' r 0 0') {
        this.rows = 12;
        this.cols = 5;
        this.jzn = jzn; // JZN stands for 'Jim-Zhou Notation'
        this.board = new JunqiBoard();
        this.is_terminal = false;
        this.winner = "";
        this.skipped_actions = new Map([['r', 3],['b', 3]]);
        this.layout = new Map;
    }
    StringChange(s,index,change){ //method
        return s.slice(0,index)+change+s.slice(index+1);
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

    isTerminal(){
        const red_string=getMaskedJzn("r");
        const blue_string=getMaskedJzn("b");
        length=this.rows*this.cols;
        let flag=false;
        if ((red_string[1] !="a" && red_string[3] !="a") || (blue_string[56] !="A" && blue_string[58] !="A")){
                return(true);
        }
        let red_count=0;  let blue_count=0;
        for (let i=0; i<length; i++){
                if (red_string[i]!="0" && red_string[i]!="#" 
                && red_string[i] != "c"
                && i !=1 && i !=3
                && i !=56 && i !=58){
                        red_count++;
                }
                if (blue_string[i]!="0" && blue_string[i]!="#" 
                && blue_string[i] != "C"
                && i !=1 && i !=3
                && i !=56 && i !=58){
                        blue_count++;
                }
        }
        if (red_count ===0 || blue_count ===0 ){
                return(true);
        }
        const red_result = splitBySpace(red_string);
        const blue_result = splitBySpace(blue_string);
        if (Number(red_result[2]) ===31 || Number(blue_result[2]) ===31){
                return(true);
        }
        if (this.skipped_actions["r"] <0 || this.skipped_actions["b"] <0){
                return(true);
        }
    }
    getWinner(){
        const red_string=getMaskedJzn("r");
        const blue_string=getMaskedJzn("b");
        length=this.rows*this.cols;
        let flag=false;
        if (red_string[1] !="a" && red_string[3] !="a"){
                return("b");
        }
        if (blue_string[56] !="A" && blue_string[58] !="A"){
                return("r");
        }
        let red_count=0;  let blue_count=0;
        for (let i=0; i<length; i++){
                if (red_string[i]!="0" && red_string[i]!="#" 
                    && red_string[i] != "c"
                    && i !=1 && i !=3
                    && i !=56 && i !=58){
                        red_count++;
                }
                if (blue_string[i]!="0" && blue_string[i]!="#" 
                    && blue_string[i] != "C"
                    && i !=1 && i !=3
                    && i !=56 && i !=58){
                        blue_count++;
                }
        }
        if (red_count ===0 && blue_count >0 ){
                return("b");
        }
        if (red_count > 0 && blue_count === 0 ){
                return("r");
        }
        if (red_count === 0 && blue_count === 0 ){
                return("0");
        }
        const red_result = splitBySpace(red_string);
        const blue_result = splitBySpace(blue_string);
        if (Number(red_result[2]) === 31 ){
                return("b");
        }
        if (Number(blue_result[2]) === 31 ){
                return("r");
        }

    }
    isLegalLayout(layout){
        function Checkout(busket){
            const chess1=["l","L","k","K","a","A"];
            const chess2=["j","J","i","I","h","H","g","G","b","B"];
            const chess3=["f","F","e","E","d","D","c","C"];
            for (const key of busket.keys()){
                    let number_eachchess=busket.get(key);
                    if (chess1.includes(key)){
                            if (number_eachchess !== 1 ){
                                    return false;
                            }
                    }
                    if (chess2.includes(key)){
                            if (number_eachchess !== 2 ){
                                    return false;
                            }
                    }
                    if (chess3.includes(key)){
                            if (number_eachchess !== 3 ){
                                    return false;
                            }
                    }
            }
            return true;
        }
        let busket= new Map();
        board_number=layout.length;
        if (board_number>30){
                return false;
        }
        for (let i=0; i<board_number; i++){
                if (busket.get(layout[i])==undefined){
                        busket.set(layout[i], 1);
                }else{
                        let old_number=busket.get(layout[i]);
                        busket.set(layout[i], old_number+1);
                }
        }
        return(Checkout(busket));   
    }   
    applyLayout(layout){
        const ASCll_number = layout.charCodeAt(0);
        if (ASCll_number < 97){
            const player = "b";
            const strat = 30;
        }else{
            const player = "r";
            const strat = 0;
        }
        for (let i=strat; i<strat+30; i++){
            this.jzn = JunqiGame.StringChange(this.jzn, i, layout[i-strat]);
        }
        this.layout = this.layout.set(player,layout);
    }
    getMaskedJzn(player){
        if (player === "b"){
            const ASCLL_min="a".charCodeAt(0);
            const ASCLL_max="z".charCodeAt(0);
            const commander="c";
            const flag="a";
        }else{
            const ASCLL_min="A".charCodeAt(0);
            const ASCLL_max="Z".charCodeAt(0);
            const commander="C";
            const flag="A";
        }
        length=this.row*this.cols;
        let masked_jzn=this.jzn;
        for (let i=0; i<length; i++){
            if (masked_jzn[i] === flag){
                const position=i;
            }
            if (masked_jzn[i].charCodeAt(0) >= ASCLL_min && masked_jzn[i].charCodeAt(0) <= ASCLL_max){
                masked_jzn=JunqiGame.StringChange(masked_jzn,i,"#");
            }
        }
        commander_state=false;
        for (let i=0; i<length; i++){
            if (masked_jzn[i] === commander){
                commander_state=true;
                break;
            }
        }
        if (commander_state === false){
            if (player === "r"){
                masked_jzn=JunqiGame.StringChange(masked_jzn,position,"a");
            }else{
                masked_jzn=JunqiGame.StringChange(masked_jzn,position,"A");
            }
        }
        return masked_jzn;
    }
  
    skipAction(player) {
        let number = this.skipped_actions.get(player);
        this.skipped_actions.set(player, number - 1);
    }
    getJzn() {
        return this.jzn;
    }
}

a = new JunqiGame("0acc0Ljc0e000000000000000000e000D00B000000000GB000JK00DCACC0 0 0 0");
//console.log(a.isLegalAction('f4g4'));

module.exports = JunqiGame;
