"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cb = void 0;
/**
 * CacheBank.
 *
 * @since 20/7/21
 * @author V.H.
 */
var cb;
(function (cb_1) {
    /**
     * Commands.
     */
    let Comm;
    (function (Comm) {
        Comm[Comm["STOP"] = 1] = "STOP";
        Comm[Comm["CONT"] = 2] = "CONT";
        Comm[Comm["REM"] = 4] = "REM";
        Comm[Comm["INVAL"] = 8] = "INVAL";
        Comm[Comm["ERR"] = 16] = "ERR";
    })(Comm = cb_1.Comm || (cb_1.Comm = {}));
    ;
    /**
     * Cache Entries.
     * @class
     */
    class CacheEntry {
        data;
        /**
         * Resource has loaded.
         */
        loaded = false;
        /**
         * Resource issue time.
         */
        issued = Date.now();
        /**
         * Resource loaded time.
         */
        completed;
        constructor(data, unwind = true, cb) {
            this.data = data;
            if (unwind && this.data instanceof Promise && !this.completed) {
                this.loaded = false;
                this.data.then((res) => {
                    this.data = res;
                    this.loaded = true;
                    if (cb)
                        this.data = cb(this, true);
                    this.completed = Date.now();
                }).catch((rej) => {
                    this.data = rej;
                    this.loaded = true;
                    if (cb)
                        this.data = cb(this, false);
                    this.completed = Date.now();
                });
            }
            else {
                this.loaded = true;
                if (cb)
                    cb(this);
                this.completed = Date.now();
            }
        } //ctor
    } //CacheEntry
    cb_1.CacheEntry = CacheEntry;
    /**
     * Caches Entries in Memory.
     * @class
     */
    class CacheBank {
        static defaults = {
            _size: 100,
        };
        /**
         * Max cache entries.
         *
         * @type {number}
         */
        _size = Number(CacheBank.defaults._size);
        /**
         * Entries.
         *
         * @type {CacheEntry[]}
         */
        data = [];
        constructor(size = Number(CacheBank.defaults._size), filterer, data) {
            this._size = Number(size);
            if (data && data instanceof Array)
                this.data = data;
            else if (data)
                throw "Bad Initial Data";
            if (filterer && filterer instanceof Function)
                this.filter = filterer;
            else if (filterer)
                throw "Bad Filter";
            if (!this._size)
                throw "Bad CacheBank size";
        } //ctor
        /**
         * Remaining entryholes amount.
         *
         * @type {number} Number.
         */
        get remaining() {
            return this.size() - this.data.length;
        } //g-remaining
        /**
         * Resize or query Size.
         *
         * @param {number} [nsz] - new size
         * @returns [New] Size.
         */
        size(nsz) {
            if (!nsz)
                return this._size;
            else
                return this._size = nsz;
        } //size
        /**
         * Cache a new Entry.
         *
         * @param {any[]} data - entry
         * @returns {CacheEntry[][]} New Entries.
         */
        cache(data, unwind, cb) {
            const out = data.map((d, i, a) => {
                let o = new CacheEntry(this.filter(d), unwind, cb);
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
        consume(data, times = this.remaining, unwind = true, cb = t => t.data) {
            /**
             * @type {CacheEntry[][]}
             */
            const out = [[], []];
            while (times--) {
                const o = this.cache([data], unwind, cb);
                out[0].push(o[0][0]);
                if (o[1][0])
                    out[1].push(o[1][0]);
            }
            return out;
        } //consume
        /**
         * Trim oldest entries.
         *
         * @param {number} [amt=this.remaining] by/amount
         * @returns {CacheEntry[]} Trimmed Entries.
         */
        trim(amt = this.remaining < 0 ? this.remaining : 0) {
            if (amt > 0)
                return this.data.splice(0, amt);
            else
                return [];
        } //trim
        /**
         * Fetch/Clean Entries.
         *
         * @param cond - condition
         * @returns
         */
        fetch(cond) {
            for (let i = 0; i < this.data.length; i++) {
                const e = cond(this.data[i]);
                if (e == Comm.REM) {
                    this.data.splice(i, 1);
                    i--;
                }
                else if (e == (Comm.REM | Comm.STOP)) {
                    return (this.data.splice(i, 1)[0] || { data: undefined }).data;
                }
                else if (e == Comm.STOP) {
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
        filter(data) {
            //STUB
            //@ts-ignore
            if (typeof data == "function")
                data = data(this, data);
            return data;
        } //filter
        /**
         * Clear Expired Entries.
         *
         * @param condition - condition
         * @returns This
         */
        clear(condition = data => !!data) {
            this.data = this.data.filter(condition);
            return this;
        } //clear
        get [Symbol.isConcatSpreadable]() {
            return true;
        }
        *[Symbol.iterator]() {
            for (const i of this.data)
                yield i;
        }
        async *[Symbol.asyncIterator]() {
            for (const i of this.data)
                yield await i.data;
        }
    } //CacheBank
    cb_1.CacheBank = CacheBank;
})(cb = exports.cb || (exports.cb = {})); //cb
exports.default = cb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9iYW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWI7Ozs7O0dBS0c7QUFDSCxJQUFjLEVBQUUsQ0FnUWY7QUFoUUQsV0FBYyxJQUFFO0lBU2Y7O09BRUc7SUFDSCxJQUFZLElBTVg7SUFORCxXQUFZLElBQUk7UUFDZiwrQkFBUSxDQUFBO1FBQ1IsK0JBQVEsQ0FBQTtRQUNSLDZCQUFPLENBQUE7UUFDUCxpQ0FBUyxDQUFBO1FBQ1QsOEJBQVEsQ0FBQTtJQUNULENBQUMsRUFOVyxJQUFJLEdBQUosU0FBSSxLQUFKLFNBQUksUUFNZjtJQUFBLENBQUM7SUEyQkY7OztPQUdHO0lBQ0gsTUFBYSxVQUFVO1FBZUg7UUFibkI7O1dBRUc7UUFDSSxNQUFNLEdBQVksS0FBSyxDQUFDO1FBQy9COztXQUVHO1FBQ2EsTUFBTSxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1Qzs7V0FFRztRQUNJLFNBQVMsQ0FBVTtRQUUxQixZQUFtQixJQUFnQyxFQUFFLFNBQWtCLElBQUksRUFBRSxFQUFvRTtZQUE5SCxTQUFJLEdBQUosSUFBSSxDQUE0QjtZQUNsRCxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxZQUFZLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzlELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUVwQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQU0sRUFBUSxFQUFFO29CQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ25CLElBQUksRUFBRTt3QkFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ25DLElBQUks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QUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFeEMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDLENBQUMsT0FBTztRQUVULElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQ0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDakIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQzVCLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUk7Z0JBQUUsTUFBTSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDL0MsQ0FBQztNQUVBLFdBQVc7SUFsS0EsY0FBUyxZQWtLckIsQ0FBQTtBQUVGLENBQUMsRUFoUWEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBZ1FmLENBQUMsSUFBSTtBQUVOLGtCQUFlLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIENhY2hlQmFuay5cclxuICogXHJcbiAqIEBzaW5jZSAyMC83LzIxXHJcbiAqIEBhdXRob3IgVi5ILlxyXG4gKi9cclxuZXhwb3J0IG1vZHVsZSBjYiB7XHJcblx0XHJcblx0LyoqXHJcblx0ICogVHlwZSBvZiBGaWx0ZXJlcnMuXHJcblx0ICogXHJcblx0ICogQHR5cGUge0Z1bmN0aW9ufVxyXG5cdCAqL1xyXG5cdGV4cG9ydCB0eXBlIEZpbHRlcjxUPiA9ICguLi5kYXRhOiBUW10pID0+IFQ7XHJcblx0XHJcblx0LyoqXHJcblx0ICogQ29tbWFuZHMuXHJcblx0ICovXHJcblx0ZXhwb3J0IGVudW0gQ29tbSB7XHJcblx0XHRTVE9QID0gMSxcclxuXHRcdENPTlQgPSAyLFxyXG5cdFx0UkVNID0gNCxcclxuXHRcdElOVkFMID0gOCxcclxuXHRcdEVSUiA9IDE2LFxyXG5cdH07XHJcblx0XHJcblx0LyoqXHJcblx0ICogQmFuay5cclxuXHQgKi9cclxuXHRleHBvcnQgaW50ZXJmYWNlIEJhbms8VCA9IGFueT4ge1xyXG5cdFx0LyoqXHJcblx0XHQgKiBNYXggY2FjaGUgZW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHR5cGUge251bWJlcn1cclxuXHRcdCAqL1xyXG5cdFx0X3NpemU6IG51bWJlcjtcclxuXHRcdC8qKlxyXG5cdFx0ICogRW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHR5cGUge2FueVtdfVxyXG5cdFx0ICovXHJcblx0XHRkYXRhOiBDYWNoZUVudHJ5PFQ+W107XHJcblx0XHQvKipcclxuXHRcdCAqIEZpbHRlcmVyIG9mIGRhdGEuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7YW55W119IGRhdGEgLSBkYXRhIHRvIHByb2Nlc3NcclxuXHRcdCAqIEByZXR1cm5zIHthbnl9IC0gUHJvY2Vzc2VkIERhdGFcclxuXHRcdCAqL1xyXG5cdFx0ZmlsdGVyOiBGaWx0ZXI8VCB8IEZpbHRlcjxUPiB8IFByb21pc2U8VD4+O1xyXG5cdH0gLy9CYW5rXHJcblx0XHJcblx0LyoqXHJcblx0ICogQ2FjaGUgRW50cmllcy5cclxuXHQgKiBAY2xhc3NcclxuXHQgKi9cclxuXHRleHBvcnQgY2xhc3MgQ2FjaGVFbnRyeTxUID0gYW55PiB7XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVzb3VyY2UgaGFzIGxvYWRlZC5cclxuXHRcdCAqL1xyXG5cdFx0cHVibGljIGxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXNvdXJjZSBpc3N1ZSB0aW1lLlxyXG5cdFx0ICovXHJcblx0XHRwdWJsaWMgcmVhZG9ubHkgaXNzdWVkOiBudW1iZXIgPSBEYXRlLm5vdygpO1xyXG5cdFx0LyoqXHJcblx0XHQgKiBSZXNvdXJjZSBsb2FkZWQgdGltZS5cclxuXHRcdCAqL1xyXG5cdFx0cHVibGljIGNvbXBsZXRlZD86IG51bWJlcjtcclxuXHRcdFxyXG5cdFx0Y29uc3RydWN0b3IocHVibGljIGRhdGE6IFQgfCBGaWx0ZXI8VD4gfCBQcm9taXNlPFQ+LCB1bndpbmQ6IGJvb2xlYW4gPSB0cnVlLCBjYj86ICh0OiBDYWNoZUVudHJ5PFQ+LCBzdWM/OiBib29sZWFuKSA9PiBUIHwgRmlsdGVyPFQ+IHwgUHJvbWlzZTxUPikge1xyXG5cdFx0XHRpZiAodW53aW5kICYmIHRoaXMuZGF0YSBpbnN0YW5jZW9mIFByb21pc2UgJiYgIXRoaXMuY29tcGxldGVkKSB7XHJcblx0XHRcdFx0dGhpcy5sb2FkZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLmRhdGEudGhlbigocmVzOiBUKTogdm9pZCA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEgPSByZXM7XHJcblx0XHRcdFx0XHR0aGlzLmxvYWRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpZiAoY2IpIHRoaXMuZGF0YSA9IGNiKHRoaXMsIHRydWUpO1xyXG5cdFx0XHRcdFx0dGhpcy5jb21wbGV0ZWQgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHRcdH0pLmNhdGNoKChyZWo6IGFueSk6IHZvaWQgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhID0gcmVqO1xyXG5cdFx0XHRcdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0aWYgKGNiKSB0aGlzLmRhdGEgPSBjYih0aGlzLCBmYWxzZSk7XHJcblx0XHRcdFx0XHR0aGlzLmNvbXBsZXRlZCA9IERhdGUubm93KCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChjYikgY2IodGhpcyk7XHJcblx0XHRcdFx0dGhpcy5jb21wbGV0ZWQgPSBEYXRlLm5vdygpO1xyXG5cdFx0XHR9XHJcblx0XHR9IC8vY3RvclxyXG5cdFx0XHJcblx0fSAvL0NhY2hlRW50cnlcclxuXHRcclxuXHQvKipcclxuXHQgKiBDYWNoZXMgRW50cmllcyBpbiBNZW1vcnkuXHJcblx0ICogQGNsYXNzXHJcblx0ICovXHJcblx0ZXhwb3J0IGNsYXNzIENhY2hlQmFuazxUID0gYW55PiBpbXBsZW1lbnRzIEJhbms8VD4ge1xyXG5cdFx0XHJcblx0XHRwdWJsaWMgc3RhdGljIGRlZmF1bHRzOiBQYXJ0aWFsPEJhbms+ID0ge1xyXG5cdFx0XHRfc2l6ZTogMTAwLFxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIE1heCBjYWNoZSBlbnRyaWVzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAdHlwZSB7bnVtYmVyfVxyXG5cdFx0ICovXHJcblx0XHRwdWJsaWMgX3NpemU6IG51bWJlciA9IE51bWJlcihDYWNoZUJhbmsuZGVmYXVsdHMuX3NpemUpO1xyXG5cdFx0LyoqXHJcblx0XHQgKiBFbnRyaWVzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAdHlwZSB7Q2FjaGVFbnRyeVtdfVxyXG5cdFx0ICovXHJcblx0XHRwdWJsaWMgZGF0YTogQ2FjaGVFbnRyeTxUPltdID0gWyBdO1xyXG5cdFx0XHJcblx0XHRjb25zdHJ1Y3RvcihzaXplOiBudW1iZXIgPSBOdW1iZXIoQ2FjaGVCYW5rLmRlZmF1bHRzLl9zaXplKSwgZmlsdGVyZXI/OiBGaWx0ZXI8VD4sIGRhdGE/OiBDYWNoZUVudHJ5PFQ+W10pIHtcclxuXHRcdFx0dGhpcy5fc2l6ZVx0PSBOdW1iZXIoc2l6ZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoZGF0YSAmJiBkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHRoaXMuZGF0YSA9IGRhdGE7XHJcblx0XHRcdGVsc2UgaWYgKGRhdGEpIHRocm93IFwiQmFkIEluaXRpYWwgRGF0YVwiO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGZpbHRlcmVyICYmIGZpbHRlcmVyIGluc3RhbmNlb2YgRnVuY3Rpb24pIHRoaXMuZmlsdGVyID0gZmlsdGVyZXI7XHJcblx0XHRcdGVsc2UgaWYgKGZpbHRlcmVyKSB0aHJvdyBcIkJhZCBGaWx0ZXJcIjtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghdGhpcy5fc2l6ZSkgdGhyb3cgXCJCYWQgQ2FjaGVCYW5rIHNpemVcIjtcclxuXHRcdH0gLy9jdG9yXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVtYWluaW5nIGVudHJ5aG9sZXMgYW1vdW50LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAdHlwZSB7bnVtYmVyfSBOdW1iZXIuXHJcblx0XHQgKi9cclxuXHRcdGdldCByZW1haW5pbmcoKTogbnVtYmVyIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuc2l6ZSgpIC0gdGhpcy5kYXRhLmxlbmd0aDtcclxuXHRcdH0gLy9nLXJlbWFpbmluZ1xyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIFJlc2l6ZSBvciBxdWVyeSBTaXplLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gW25zel0gLSBuZXcgc2l6ZVxyXG5cdFx0ICogQHJldHVybnMgW05ld10gU2l6ZS5cclxuXHRcdCAqL1xyXG5cdFx0c2l6ZShuc3o/OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0XHRpZiAoIW5zeikgcmV0dXJuIHRoaXMuX3NpemU7XHJcblx0XHRcdGVsc2UgcmV0dXJuIHRoaXMuX3NpemUgPSBuc3o7XHJcblx0XHR9IC8vc2l6ZVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIENhY2hlIGEgbmV3IEVudHJ5LlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge2FueVtdfSBkYXRhIC0gZW50cnlcclxuXHRcdCAqIEByZXR1cm5zIHtDYWNoZUVudHJ5W11bXX0gTmV3IEVudHJpZXMuXHJcblx0XHQgKi9cclxuXHRcdGNhY2hlKGRhdGE6IFJlYWRvbmx5PFQ+W10sIHVud2luZD86IGJvb2xlYW4sIGNiPzogKHQ6IENhY2hlRW50cnk8VD4sIHN1Yz86IGJvb2xlYW4pID0+IFQgfCBGaWx0ZXI8VD4gfCBQcm9taXNlPFQ+KTogW0NhY2hlRW50cnk8VD5bXSwgQ2FjaGVFbnRyeTxUPltdXSB7XHJcblx0XHRcdGNvbnN0IG91dDogQ2FjaGVFbnRyeTxUPltdID0gZGF0YS5tYXAoKGQ6IFQsIGk6IG51bWJlciwgYTogVFtdKTogQ2FjaGVFbnRyeTxUPiA9PiB7XHJcblx0XHRcdFx0bGV0IG86IENhY2hlRW50cnk8VD4gPSBuZXcgQ2FjaGVFbnRyeTxUPih0aGlzLmZpbHRlcihkKSwgdW53aW5kLCBjYik7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5kYXRhLnB1c2gobyk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuIG87XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIFtvdXQsIHRoaXMudHJpbSgpXTtcclxuXHRcdH0gLy9jYWNoZVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIEZpbGwgd2hvbGUgQmFuay5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHthbnl9IGRhdGEgLSB3aXRoXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVzPXRoaXMucmVtYWluaW5nXSAtIGFtb3VudFxyXG5cdFx0ICogQHJldHVybnMge0NhY2hlRW50cnlbXVtdfSBSZWNvcmRzLlxyXG5cdFx0ICovXHJcblx0XHRjb25zdW1lKGRhdGE6IFJlYWRvbmx5PFQ+LCB0aW1lczogbnVtYmVyID0gdGhpcy5yZW1haW5pbmcsIHVud2luZDogYm9vbGVhbiA9IHRydWUsIGNiOiAodDogQ2FjaGVFbnRyeTxUPiwgc3VjPzogYm9vbGVhbikgPT4gVCB8IEZpbHRlcjxUPiB8IFByb21pc2U8VD4gPSB0ID0+IHQuZGF0YSk6IFtDYWNoZUVudHJ5PFQ+W10sIENhY2hlRW50cnk8VD5bXV0ge1xyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogQHR5cGUge0NhY2hlRW50cnlbXVtdfVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0Y29uc3Qgb3V0OiBbQ2FjaGVFbnRyeTxUPltdLCBDYWNoZUVudHJ5PFQ+W11dID0gWyBbIF0sIFsgXSBdO1xyXG5cdFx0XHRcclxuXHRcdFx0d2hpbGUgKHRpbWVzLS0pIHtcclxuXHRcdFx0XHRjb25zdCBvOiBbQ2FjaGVFbnRyeTxUPltdLCBDYWNoZUVudHJ5PFQ+W11dID0gdGhpcy5jYWNoZShbZGF0YV0sIHVud2luZCwgY2IpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdG91dFswXS5wdXNoKG9bMF1bMF0pO1xyXG5cdFx0XHRcdGlmIChvWzFdWzBdKSBvdXRbMV0ucHVzaChvWzFdWzBdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIG91dDtcclxuXHRcdH0gLy9jb25zdW1lXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogVHJpbSBvbGRlc3QgZW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHtudW1iZXJ9IFthbXQ9dGhpcy5yZW1haW5pbmddIGJ5L2Ftb3VudFxyXG5cdFx0ICogQHJldHVybnMge0NhY2hlRW50cnlbXX0gVHJpbW1lZCBFbnRyaWVzLlxyXG5cdFx0ICovXHJcblx0XHR0cmltKGFtdDogbnVtYmVyID0gdGhpcy5yZW1haW5pbmcgPCAwID8gdGhpcy5yZW1haW5pbmcgOiAwKTogQ2FjaGVFbnRyeTxUPltdIHtcclxuXHRcdFx0aWYgKGFtdCA+IDApIHJldHVybiB0aGlzLmRhdGEuc3BsaWNlKDAsIGFtdCk7XHJcblx0XHRcdGVsc2UgcmV0dXJuIFsgXTtcclxuXHRcdH0gLy90cmltXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogRmV0Y2gvQ2xlYW4gRW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIGNvbmQgLSBjb25kaXRpb25cclxuXHRcdCAqIEByZXR1cm5zIFxyXG5cdFx0ICovXHJcblx0XHRmZXRjaChjb25kOiAodDogQ2FjaGVFbnRyeTxUPikgPT4gQ29tbSk6IFQgfCBGaWx0ZXI8VD4gfCBQcm9taXNlPFQ+IHwgdW5kZWZpbmVkIHtcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IGU6IG51bWJlciA9IGNvbmQodGhpcy5kYXRhW2ldKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoZSA9PSBDb21tLlJFTSkge1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdGktLTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGUgPT0gKENvbW0uUkVNIHwgQ29tbS5TVE9QKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICh0aGlzLmRhdGEuc3BsaWNlKGksIDEpWzBdIHx8IHsgZGF0YTogdW5kZWZpbmVkIH0pLmRhdGE7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlID09IENvbW0uU1RPUCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZGF0YVtpXS5kYXRhO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSAvL2ZldGNoXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogRmlsdGVyZXIgb2YgZGF0YS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHthbnl9IGRhdGEgLSBkYXRhIHRvIHByb2Nlc3NcclxuXHRcdCAqIEByZXR1cm5zIHthbnl9IFByb2Nlc3NlZCBEYXRhLlxyXG5cdFx0ICovXHJcblx0XHRmaWx0ZXIoZGF0YTogVCB8IEZpbHRlcjxUPiB8IFByb21pc2U8VD4pOiBUIHwgRmlsdGVyPFQ+IHwgUHJvbWlzZTxUPiB7XHJcblx0XHRcdC8vU1RVQlxyXG5cdFx0XHRcclxuXHRcdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRcdGlmICh0eXBlb2YgZGF0YSA9PSBcImZ1bmN0aW9uXCIpIGRhdGEgPSBkYXRhKHRoaXMsIGRhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHR9IC8vZmlsdGVyXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogQ2xlYXIgRXhwaXJlZCBFbnRyaWVzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0gY29uZGl0aW9uIC0gY29uZGl0aW9uXHJcblx0XHQgKiBAcmV0dXJucyBUaGlzXHJcblx0XHQgKi9cclxuXHRcdGNsZWFyKGNvbmRpdGlvbjogKGRhdGE6IENhY2hlRW50cnk8VD4sIGluZGV4PzogbnVtYmVyLCBhcnJheT86IENhY2hlRW50cnk8VD5bXSkgPT4gYm9vbGVhbiA9IGRhdGEgPT4gISFkYXRhKTogdGhpcyB7XHJcblx0XHRcdHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5maWx0ZXIoY29uZGl0aW9uKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSAvL2NsZWFyXHJcblx0XHRcclxuXHRcdGdldCBbU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZV0oKTogYm9vbGVhbiB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0KltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5kYXRhKSB5aWVsZCBpO1xyXG5cdFx0fVxyXG5cdFx0YXN5bmMgKltTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKSB7XHJcblx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmRhdGEpIHlpZWxkIGF3YWl0IGkuZGF0YTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH0gLy9DYWNoZUJhbmtcclxuXHRcclxufSAvL2NiXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYjtcclxuIl19