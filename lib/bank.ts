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
	export type Filter = (...data: any[]) => any;
	
	/**
	 * Bank.
	 */
	export interface Bank {
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
		data: any[];
		/**
		 * Filterer of data.
		 * 
		 * @param {any[]} data - data to process
		 * @returns {any} - Processed Data
		 */
		filter: Filter;
	} //Bank
	
	/**
	 * Caches Entries in Memory.
	 * @class
	 */
	export class CacheBank implements Bank {
		
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
		 * @type {any[]}
		 */
		public data: any[] = [ ];
		
		constructor(size: number = Number(CacheBank.defaults._size), filterer?: Filter, data?: any[]) {
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
		 * @returns {any[]} New Entries.
		 */
		cache(...data: any[]): any[] {
			const out: any[] = data.map((d: any, i: number, a: any[]): any => {
				let o: any = this.filter(d);
				
				if (o instanceof Promise) o.then(res => this.data.push(o = res));
				else if (typeof o == "function") o = this.cache(o = o(i, a))[0];
				else this.data.push(o);
				
				return o;
			});
			
			this.trim();
			
			return out;
		} //cache
		
		/**
		 * Fill whole Bank.
		 * 
		 * @param {any} data - with
		 * @param {number} [times=this.remaining] - amount
		 * @returns 
		 */
		consume(data: any, times: number = this.remaining): any[] {
			const out: any[] = [ ];
			
			while (times--) out.push(this.cache(data)[0]);
			
			return out;
		} //consume
		
		/**
		 * Trim oldest entries.
		 * 
		 * @param {number} [amt=this.remaining] by/amount
		 * @returns Trimmed Entries.
		 */
		trim(amt: number = this.remaining): any[] {
			if (amt > 0) return this.data.splice(0, amt);
			else return [ ];
		} //trim
		
		/**
		 * Filterer of data.
		 * 
		 * @param {any} data - data to process
		 * @returns {any} Processed Data.
		 */
		filter(data: any): any {
			//STUB
			return data;
		} //filter
		
		/**
		 * Clear Expired Entries.
		 * 
		 * @param condition - condition
		 * @returns This
		 */
		clear(condition: (data: any, index?: number, array?: any[]) => boolean = data => data): this {
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
			for (const i of this.data) yield await i;
		}
		
	} //CacheBank
	
} //cb

export default cb;
