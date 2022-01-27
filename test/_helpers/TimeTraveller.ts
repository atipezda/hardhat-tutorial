import {JsonRpcProvider} from "@ethersproject/providers/src.ts/json-rpc-provider";

class TimeTraveller {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private snapshotID: any;
    private ethereum: JsonRpcProvider;

    constructor(ethereum: JsonRpcProvider) {
        this.ethereum = ethereum;
    }

    public async snapshot() {
        const snapshot = await this.ethereum.send("evm_snapshot", []);
        await this.mine_blocks(1);
        this.snapshotID = snapshot;
        return;
    }

    public async revertSnapshot() {
        await this.ethereum.send("evm_revert", [this.snapshotID]);
        await this.mine_blocks(1);
        await this.snapshot();
        return;
    }

    public async mine_blocks(amount: number) {
        for (let i = 0; i < amount; i++) {
            await this.ethereum.send("evm_mine", []);
        }
    }

    public async increaseTime(amount: number) {
        await this.ethereum.send("evm_increaseTime", [amount]);
    }

    public async setNextBlockTimestamp(timestamp: number) {
        await this.ethereum.send("evm_setNextBlockTimestamp", [timestamp]);
    }

}

export default TimeTraveller;