/**
 * CacheBank.
 *
 * @since 20/7/21
 * @author V.H.
 */
export declare module cb {
    /**
     * Type of Filterers.
     *
     * @type {Function}
     */
    type Filter = (...data: any[]) => any;
    /**
     * Bank.
     */
    interface Bank {
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
    }
    /**
     * Caches Entries in Memory.
     * @class
     */
    class CacheBank implements Bank {
        static defaults: Partial<Bank>;
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
        constructor(size?: number, filterer?: Filter, data?: any[]);
        /**
         * Remaining entryholes amount.
         *
         * @type {number} Number.
         */
        get remaining(): number;
        /**
         * Resize or query Size.
         *
         * @param {number} [nsz] - new size
         * @returns [New] Size.
         */
        size(nsz?: number): number;
        /**
         * Cache a new Entry.
         *
         * @param {any[]} data - entry
         * @returns {any[]} New Entries.
         */
        cache(...data: any[]): any[];
        /**
         * Fill whole Bank.
         *
         * @param {any} data - with
         * @param {number} [times=this.remaining] - amount
         * @returns
         */
        consume(data: any, times?: number): any[];
        /**
         * Trim oldest entries.
         *
         * @param {number} [amt=this.remaining] by/amount
         * @returns Trimmed Entries.
         */
        trim(amt?: number): any[];
        /**
         * Filterer of data.
         *
         * @param {any} data - data to process
         * @returns {any} Processed Data.
         */
        filter(data: any): any;
        /**
         * Clear Expired Entries.
         *
         * @param condition - condition
         * @returns This
         */
        clear(condition?: (data: any, index?: number, array?: any[]) => boolean): this;
        get [Symbol.isConcatSpreadable](): boolean;
        [Symbol.iterator](): Generator<any, void, unknown>;
        [Symbol.asyncIterator](): AsyncGenerator<any, void, unknown>;
    }
}
export default cb;
//# sourceMappingURL=bank.d.ts.map