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
    type Filter<T> = (...data: T[]) => T;
    /**
     * Commands.
     */
    enum Comm {
        STOP = 1,
        CONT = 2,
        REM = 4,
        INVAL = 8,
        ERR = 16
    }
    /**
     * Bank.
     */
    interface Bank<T = any> {
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
    }
    /**
     * Cache Entries.
     * @class
     */
    class CacheEntry<T = any> {
        data: T | Filter<T> | Promise<T>;
        /**
         * Resource has loaded.
         */
        loaded: boolean;
        /**
         * Resource issue time.
         */
        readonly issued: number;
        /**
         * Resource loaded time.
         */
        completed?: number;
        constructor(data: T | Filter<T> | Promise<T>, unwind?: boolean, cb?: (t: CacheEntry<T>, suc?: boolean) => T | Filter<T> | Promise<T>);
    }
    /**
     * Caches Entries in Memory.
     * @class
     */
    class CacheBank<T = any> implements Bank<T> {
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
         * @type {CacheEntry[]}
         */
        data: CacheEntry<T>[];
        constructor(size?: number, filterer?: Filter<T>, data?: CacheEntry<T>[]);
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
         * @returns {CacheEntry[][]} New Entries.
         */
        cache(data: Readonly<T>[], unwind?: boolean, cb?: (t: CacheEntry<T>, suc?: boolean) => T | Filter<T> | Promise<T>): [CacheEntry<T>[], CacheEntry<T>[]];
        /**
         * Fill whole Bank.
         *
         * @param {any} data - with
         * @param {number} [times=this.remaining] - amount
         * @returns {CacheEntry[][]} Records.
         */
        consume(data: Readonly<T>, times?: number, unwind?: boolean, cb?: (t: CacheEntry<T>, suc?: boolean) => T | Filter<T> | Promise<T>): [CacheEntry<T>[], CacheEntry<T>[]];
        /**
         * Trim oldest entries.
         *
         * @param {number} [amt=this.remaining] by/amount
         * @returns {CacheEntry[]} Trimmed Entries.
         */
        trim(amt?: number): CacheEntry<T>[];
        /**
         * Fetch/Clean Entries.
         *
         * @param cond - condition
         * @returns
         */
        fetch(cond: (t: CacheEntry<T>) => Comm): T | Filter<T> | Promise<T> | undefined;
        /**
         * Filterer of data.
         *
         * @param {any} data - data to process
         * @returns {any} Processed Data.
         */
        filter(data: T | Filter<T> | Promise<T>): T | Filter<T> | Promise<T>;
        /**
         * Clear Expired Entries.
         *
         * @param condition - condition
         * @returns This
         */
        clear(condition?: (data: CacheEntry<T>, index?: number, array?: CacheEntry<T>[]) => boolean): this;
        get [Symbol.isConcatSpreadable](): boolean;
        [Symbol.iterator](): Generator<CacheEntry<T>, void, unknown>;
        [Symbol.asyncIterator](): AsyncGenerator<T | Filter<T>, void, unknown>;
    }
}
export default cb;
//# sourceMappingURL=bank.d.ts.map