"use strict";

/**
 * CacheBank.
 * 
 * @since 20/7/21
 * @author V.H.
 */
export module cb {
	
	/**
	 * Type of Filterers.
	 * 
	 * @type {Function}
	 */
	export type Filter<T> = (...data: T[]) => T;
	
	/**
	 * Commands.
	 */
	export enum Comm {
		STOP = 1,
		CONT = 2,
		REM = 4,
		INVAL = 8,
		ERR = 16,
	};
	
	/**
	 * Bank.
	 */
	export interface Bank<T = any> {
		/**
		 * Max cache entries.
		 * 
		 * @type {number}
		 */
		_size: number;
		/**
		 * Entries.
		 * 
		 * @type {any[]}
		 */
		data: CacheEntry<T>[];
		/**
		 * Filterer of data.
		 * 
		 * @param {any[]} data - data to process
		 * @returns {any} - Processed Data
		 */
		filter: Filter<T | Filter<T> | Promise<T>>;
	} //Bank
	
	/**
	 * Cache Entries.
	 * @class
	 */
	export class CacheEntry<T = any> {
		
		/**
		 * Resource has loaded.
		 */
		public loaded: boolean = false;
		/**
		 * Resource issue time.
		 */
		public readonly issued: number = Date.now();
		/**
		 * Resource loaded time.
		 */
		public completed?: number;
		
		constructor(public data: T | Filter<T> | Promise<T>, unwind: boolean = true, cb?: (t: CacheEntry<T>, suc?: boolean) => T | Filter<T> | Promise<T>) {
			if (unwind && this.data instanceof Promise && !this.completed) {
				this.loaded = false;
				
				this.data.then((res: T): void => {
					this.data = res;
					this.loaded = true;
					if (cb) this.data = cb(this, true);
					this.completed = Date.now();
				}).catch((rej: any): void => {
					this.data = rej;
					this.loaded = true;
					if (cb) this.data = cb(this, false);
					this.completed = Date.now();
				});
			} else {
				this.loaded = true;
				if (cb) cb(this);
				this.completed = Date.now();
			}
		} //ctor
		
	} //CacheEntry
	
	/**
	 * Caches Entries in Memory.
	 * @class
	 */
	export class CacheBank<T = any> implements Bank<T> {
		
		public static defaults: Partial<Bank> = {
			_size: 100,
		};
		
		
		/**
		 * Max cache entries.
		 * 
		 * @type {number}
		 */
		public _size: number = Number(CacheBank.defaults._size);
		/**
		 * Entries.
		 * 
		 * @type {CacheEntry[]}
		 */
		public data: CacheEntry<T>[] = [ ];
		
		constructor(size: number = Number(CacheBank.defaults._size), filterer?: Filter<T>, data?: CacheEntry<T>[]) {
			this._size	= Number(size);
			
			if (data && data instanceof Array) this.data = data;
			else if (data) throw "Bad Initial Data";
			
			if (filterer && filterer instanceof Function) this.filter = filterer;
			else if (filterer) throw "Bad Filter";
			
			if (!this._size) throw "Bad CacheBank size";
		} //ctor
		
		/**
		 * Remaining entryholes amount.
		 * 
		 * @type {number} Number.
		 */
		get remaining(): number {
			return this.size() - this.data.length;
		} //g-remaining
		
		/**
		 * Resize or query Size.
		 * 
		 * @param {number} [nsz] - new size
		 * @returns [New] Size.
		 */
		size(nsz?: number): number {
			if (!nsz) return this._size;
			else return this._size = nsz;
		} //size
		
		/**
		 * Cache a new Entry.
		 * 
		 * @param {any[]} data - entry
		 * @returns {CacheEntry[][]} New Entries.
		 */
		cache(data: Readonly<T>[], unwind?: boolean, cb?: (t: CacheEntry<T>, suc?: boolean) => T | Filter<T> | Promise<T>): [CacheEntry<T>[], CacheEntry<T>[]] {
			const out: CacheEntry<T>[] = data.map((d: T, i: number, a: T[]): CacheEntry<T> => {
				let o: CacheEntry<T> = new CacheEntry<T>(this.filter(d), unwind, cb);
				
				this.data.push(o);
				
				return o;
			});
			
			return [out, this.trim()];
		} //cache
		
		/**
		 * Fill whole Bank.
		 * 
		 * @param {any} data - with
		 * @param {number} [times=this.remaining] - amount
		 * @returns {CacheEntry[][]} Records.
		 */
		consume(data: Readonly<T>, times: number = this.remaining, unwind: boolean = true, cb: (t: CacheEntry<T>, suc?: boolean) => T | Filter<T> | Promise<T> = t => t.data): [CacheEntry<T>[], CacheEntry<T>[]] {
			/**
			 * @type {CacheEntry[][]}
			 */
			const out: [CacheEntry<T>[], CacheEntry<T>[]] = [ [ ], [ ] ];
			
			while (times--) {
				const o: [CacheEntry<T>[], CacheEntry<T>[]] = this.cache([data], unwind, cb);
				
				out[0].push(o[0][0]);
				if (o[1][0]) out[1].push(o[1][0]);
			}
			
			return out;
		} //consume
		
		/**
		 * Trim oldest entries.
		 * 
		 * @param {number} [amt=this.remaining] by/amount
		 * @returns {CacheEntry[]} Trimmed Entries.
		 */
		trim(amt: number = this.remaining < 0 ? this.remaining : 0): CacheEntry<T>[] {
			if (amt > 0) return this.data.splice(0, amt);
			else return [ ];
		} //trim
		
		/**
		 * Fetch/Clean Entries.
		 * 
		 * @param cond - condition
		 * @returns 
		 */
		fetch(cond: (t: CacheEntry<T>) => Comm): T | Filter<T> | Promise<T> | undefined {
			for (let i: number = 0; i < this.data.length; i++) {
				const e: number = cond(this.data[i]);
				
				if (e == Comm.REM) {
					this.data.splice(i, 1);
					i--;
				} else if (e == (Comm.REM | Comm.STOP)) {
					return (this.data.splice(i, 1)[0] || { data: undefined }).data;
				} else if (e == Comm.STOP) {
					return this.data[i].data;
				}
			}
		} //fetch
		
		/**
		 * Filterer of data.
		 * 
		 * @param {any} data - data to process
		 * @returns {any} Processed Data.
		 */
		filter(data: T | Filter<T> | Promise<T>): T | Filter<T> | Promise<T> {
			//STUB
			
			//@ts-ignore
			if (typeof data == "function") data = data(this, data);
			
			return data;
		} //filter
		
		/**
		 * Clear Expired Entries.
		 * 
		 * @param condition - condition
		 * @returns This
		 */
		clear(condition: (data: CacheEntry<T>, index?: number, array?: CacheEntry<T>[]) => boolean = data => !!data): this {
			this.data = this.data.filter(condition);
			
			return this;
		} //clear
		
		get [Symbol.isConcatSpreadable](): boolean {
			return true;
		}
		*[Symbol.iterator]() {
			for (const i of this.data) yield i;
		}
		async *[Symbol.asyncIterator]() {
			for (const i of this.data) yield await i.data;
		}
		
	} //CacheBank
	
} //cb

export default cb;
