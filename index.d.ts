/*
 * Copyright 2019 balena
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

type Dictionary<T> = { [key: string]: T };

declare module '@balena/contrato' {
	export type Template = unknown;
	export type Layout = Dictionary<unknown>;
	export type Skeleton = Dictionary<unknown>;
	export type ContractObject = Dictionary<unknown>;

	export class Contract {
		public constructor(object: ContractObject, options?: { hash?: boolean });
		public getVersion(): string;
		public getSlug(): string;
		public getAllSlugs(): Set<string>;
		public hasAliases(): boolean;
		public getCanonicalSlug(): string;
		public getType(): string;
		public getReferenceString(): string;
		public toJSON(): ContractObject;
		public addChild(
			contract: Contract,
			options?: { rehash?: boolean; rebuild?: boolean },
		): Contract;
		public removeChild(
			contract: Contract,
			options?: { rehash?: boolean },
		): Contract;
		public addChildren(
			contracts: Contract[],
			options?: { rehash?: boolean },
		): Contract;
		public getChildrenTypes(): Set<string>;
		public getChildByHash(childHash: string): Contract | undefined;
		public getChildren(options?: { types?: Set<string> }): Contract[];
		public getchildrenByType(type: string);
		public findChildren(matcher: Contract): Contract[];
		public getChildrenCombinations(options: {
			type: string;
			from: number;
			to: number;
		}): Array<Contract[]>;
		public getReferencedContracts(options: {
			from: Contract;
			types: Set<string>;
		}): Contract[];
		public getChildrenCrossReferencedContracts(options: {
			from: Contract;
			types: Set<string>;
		}): Contract[];
		public satisfiesChildContract(
			contract: Contract,
			options?: { types?: Set<string> },
		): boolean;
		public areChildrenSatisfied(options?: { types?: Set<string> }): boolean;
		public static isEqual(contract1: Contract, contract2: Contract): boolean;
		public static build(source: ContractObject): Contract[];
	}

	export class Blueprint extends Contract {
		public constructor(layout: Layout, skeleton: Skeleton);
		public reproduce(contract: Contract): Contract[];
	}

	export function query(
		universe: Contract,
		layout: Layout,
		skeleton: Skeleton,
	): ReturnType<Blueprint['reproduce']>;

	export function buildTemplate(
		template: Template,
		context: Contract,
		options: { directory: string },
	);
}
