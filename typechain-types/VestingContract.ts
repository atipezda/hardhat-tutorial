/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface VestingContractInterface extends utils.Interface {
  functions: {
    "getBeneficiariesCount()": FunctionFragment;
    "getBeneficiary(address)": FunctionFragment;
    "registerBeneficiary(address,string)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getBeneficiariesCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBeneficiary",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "registerBeneficiary",
    values: [string, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "getBeneficiariesCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBeneficiary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerBeneficiary",
    data: BytesLike
  ): Result;

  events: {};
}

export interface VestingContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VestingContractInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getBeneficiariesCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getBeneficiary(addr: string, overrides?: CallOverrides): Promise<[string]>;

    registerBeneficiary(
      addr: string,
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getBeneficiariesCount(overrides?: CallOverrides): Promise<BigNumber>;

  getBeneficiary(addr: string, overrides?: CallOverrides): Promise<string>;

  registerBeneficiary(
    addr: string,
    name: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getBeneficiariesCount(overrides?: CallOverrides): Promise<BigNumber>;

    getBeneficiary(addr: string, overrides?: CallOverrides): Promise<string>;

    registerBeneficiary(
      addr: string,
      name: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getBeneficiariesCount(overrides?: CallOverrides): Promise<BigNumber>;

    getBeneficiary(addr: string, overrides?: CallOverrides): Promise<BigNumber>;

    registerBeneficiary(
      addr: string,
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getBeneficiariesCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBeneficiary(
      addr: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerBeneficiary(
      addr: string,
      name: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}