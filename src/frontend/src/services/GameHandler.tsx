import { useGameContext } from "../contexts/GameContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useRef } from "react";
import useGameSocket from "../sockets/game"

const useGameHandler = () => {
    const { roomName, setRoomName, game, setGame } = useGameContext();
    const { emitMove } = useGameSocket();

    const moveHandler = (move: string) => {
        const canMove = game.isLegalAction(move);
        console.log(`Move ${move} - ${canMove}`);
        // TODO: 服务端也需要判断
        if (!canMove) {
            // return 'snapback';
        } else {
            // TODO: move this to sockets/game.tsx
            emitMove(move, roomName);
        };
    }

    const swapHandler = (swap: string) => {
        // TODO: Condition!
        var canSwap = false;
        // TODO: 服务端也需要判断
        console.log(`Recieved swap during deployment: ${swap}`);

        function swap_layout(swap: string) {
            if (!/^([a-l][1-5]){2}$/.test(swap)) {
                throw new Error("Input must be in the format like 'a1b1'.");
            }

            function swapPieces(jzn: string, index1: number, index2: number) {
                const jznArray = jzn.split(""); // 转换为数组以便修改
                [jznArray[index1], jznArray[index2]] = [jznArray[index2], jznArray[index1]]; // 交换

                var new_jzn = jznArray.join("");

                return new_jzn;
            }

            // 将行列转换为索引
            function getIndex(position: string) {
                const row = position[0].charCodeAt(0) - 'a'.charCodeAt(0); // 行从 'a' 开始
                const col = parseInt(position[1], 10) - 1; // 列从 1 开始
                return row * 5 + col; // 计算索引
            }

            const old_short_jzn = game.jzn.split(" ")[0]

            // 提取位置
            const pos1 = swap.slice(0, 2);
            const pos2 = swap.slice(2);

            // 获取索引
            const index1 = getIndex(pos1);
            const index2 = getIndex(pos2);

            // 检查索引是否在范围内
            if (index1 >= old_short_jzn.length || index2 >= old_short_jzn.length) {
                throw new Error("Index out of range for window.jzn.");
            }

            var new_jzn = swapPieces(old_short_jzn, index1, index2);
            new_jzn = swapPieces(new_jzn, 59 - index1, 59 - index2);

            if (game.isLegalLayout(new_jzn.slice(0, 30)) && game.isLegalLayout(new_jzn.slice(30))) {
                console.log(`sJZN after swapping: ${new_jzn}`);
                return new_jzn + ' r 0 0';
            } else {
                console.log(`Illegal layout after swaping: ${new_jzn}`);
                return game.jzn;
            }
        }
        
        const new_jzn = swap_layout(swap);
        if (game.jzn !== new_jzn) { canSwap = true; }
        game.jzn = new_jzn;
        game.applyLayout(game.jzn.slice(0, 30));
        game.applyLayout(game.jzn.slice(30, 60));
        return canSwap;
    };

    return { moveHandler, swapHandler };
}

export default useGameHandler;