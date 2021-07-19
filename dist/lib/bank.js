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
(function (cb) {
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
         * @type {any[]}
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
         * @returns {any[]} New Entries.
         */
        cache(...data) {
            const out = data.map((d, i, a) => {
                let o = this.filter(d);
                if (o instanceof Promise)
                    o.then(res => this.data.push(o = res));
                else if (typeof o == "function")
                    o = this.cache(o = o(i, a))[0];
                else
                    this.data.push(o);
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
        consume(data, times = this.remaining) {
            const out = [];
            while (times--)
                out.push(this.cache(data)[0]);
            return out;
        } //consume
        /**
         * Trim oldest entries.
         *
         * @param {number} [amt=this.remaining] by/amount
         * @returns Trimmed Entries.
         */
        trim(amt = this.remaining) {
            if (amt > 0)
                return this.data.splice(0, amt);
            else
                return [];
        } //trim
        /**
         * Filterer of data.
         *
         * @param {any} data - data to process
         * @returns {any} Processed Data.
         */
        filter(data) {
            //STUB
            return data;
        } //filter
        /**
         * Clear Expired Entries.
         *
         * @param condition - condition
         * @returns This
         */
        clear(condition = data => data) {
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
                yield await i;
        }
    } //CacheBank
    cb.CacheBank = CacheBank;
})(cb = exports.cb || (exports.cb = {})); //cb
exports.default = cb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFuay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9iYW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWI7Ozs7O0dBS0c7QUFDSCxJQUFjLEVBQUUsQ0E2S2Y7QUE3S0QsV0FBYyxFQUFFO0lBa0NmOzs7T0FHRztJQUNILE1BQWEsU0FBUztRQUVkLE1BQU0sQ0FBQyxRQUFRLEdBQWtCO1lBQ3ZDLEtBQUssRUFBRSxHQUFHO1NBQ1YsQ0FBQztRQUdGOzs7O1dBSUc7UUFDSSxLQUFLLEdBQVcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQ7Ozs7V0FJRztRQUNJLElBQUksR0FBVSxFQUFHLENBQUM7UUFFekIsWUFBWSxPQUFlLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQWlCLEVBQUUsSUFBWTtZQUMzRixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxQixJQUFJLElBQUksSUFBSSxJQUFJLFlBQVksS0FBSztnQkFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDL0MsSUFBSSxJQUFJO2dCQUFFLE1BQU0sa0JBQWtCLENBQUM7WUFFeEMsSUFBSSxRQUFRLElBQUksUUFBUSxZQUFZLFFBQVE7Z0JBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7aUJBQ2hFLElBQUksUUFBUTtnQkFBRSxNQUFNLFlBQVksQ0FBQztZQUV0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsTUFBTSxvQkFBb0IsQ0FBQztRQUM3QyxDQUFDLENBQUMsTUFBTTtRQUVSOzs7O1dBSUc7UUFDSCxJQUFJLFNBQVM7WUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QyxDQUFDLENBQUMsYUFBYTtRQUVmOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLEdBQVk7WUFDaEIsSUFBSSxDQUFDLEdBQUc7Z0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDOztnQkFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUM5QixDQUFDLENBQUMsTUFBTTtRQUVSOzs7OztXQUtHO1FBQ0gsS0FBSyxDQUFDLEdBQUcsSUFBVztZQUNuQixNQUFNLEdBQUcsR0FBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLENBQVMsRUFBRSxDQUFRLEVBQU8sRUFBRTtnQkFDaEUsSUFBSSxDQUFDLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFNUIsSUFBSSxDQUFDLFlBQVksT0FBTztvQkFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQzVELElBQUksT0FBTyxDQUFDLElBQUksVUFBVTtvQkFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztvQkFDM0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXZCLE9BQU8sQ0FBQyxDQUFDO1lBQ1YsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFWixPQUFPLEdBQUcsQ0FBQztRQUNaLENBQUMsQ0FBQyxPQUFPO1FBRVQ7Ozs7OztXQU1HO1FBQ0gsT0FBTyxDQUFDLElBQVMsRUFBRSxRQUFnQixJQUFJLENBQUMsU0FBUztZQUNoRCxNQUFNLEdBQUcsR0FBVSxFQUFHLENBQUM7WUFFdkIsT0FBTyxLQUFLLEVBQUU7Z0JBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUMsT0FBTyxHQUFHLENBQUM7UUFDWixDQUFDLENBQUMsU0FBUztRQUVYOzs7OztXQUtHO1FBQ0gsSUFBSSxDQUFDLE1BQWMsSUFBSSxDQUFDLFNBQVM7WUFDaEMsSUFBSSxHQUFHLEdBQUcsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7Z0JBQ3hDLE9BQU8sRUFBRyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxNQUFNO1FBRVI7Ozs7O1dBS0c7UUFDSCxNQUFNLENBQUMsSUFBUztZQUNmLE1BQU07WUFDTixPQUFPLElBQUksQ0FBQztRQUNiLENBQUMsQ0FBQyxRQUFRO1FBRVY7Ozs7O1dBS0c7UUFDSCxLQUFLLENBQUMsWUFBbUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJO1lBQ3BGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFeEMsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDLENBQUMsT0FBTztRQUVULElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBQ0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDakIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSTtnQkFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQzVCLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUk7Z0JBQUUsTUFBTSxNQUFNLENBQUMsQ0FBQztRQUMxQyxDQUFDO01BRUEsV0FBVztJQXJJQSxZQUFTLFlBcUlyQixDQUFBO0FBRUYsQ0FBQyxFQTdLYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUE2S2YsQ0FBQyxJQUFJO0FBRU4sa0JBQWUsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogQ2FjaGVCYW5rLlxyXG4gKiBcclxuICogQHNpbmNlIDIwLzcvMjFcclxuICogQGF1dGhvciBWLkguXHJcbiAqL1xyXG5leHBvcnQgbW9kdWxlIGNiIHtcclxuXHRcclxuXHQvKipcclxuXHQgKiBUeXBlIG9mIEZpbHRlcmVycy5cclxuXHQgKiBcclxuXHQgKiBAdHlwZSB7RnVuY3Rpb259XHJcblx0ICovXHJcblx0ZXhwb3J0IHR5cGUgRmlsdGVyID0gKC4uLmRhdGE6IGFueVtdKSA9PiBhbnk7XHJcblx0XHJcblx0LyoqXHJcblx0ICogQmFuay5cclxuXHQgKi9cclxuXHRleHBvcnQgaW50ZXJmYWNlIEJhbmsge1xyXG5cdFx0LyoqXHJcblx0XHQgKiBNYXggY2FjaGUgZW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHR5cGUge251bWJlcn1cclxuXHRcdCAqL1xyXG5cdFx0X3NpemU6IG51bWJlcjtcclxuXHRcdC8qKlxyXG5cdFx0ICogRW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHR5cGUge2FueVtdfVxyXG5cdFx0ICovXHJcblx0XHRkYXRhOiBhbnlbXTtcclxuXHRcdC8qKlxyXG5cdFx0ICogRmlsdGVyZXIgb2YgZGF0YS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHthbnlbXX0gZGF0YSAtIGRhdGEgdG8gcHJvY2Vzc1xyXG5cdFx0ICogQHJldHVybnMge2FueX0gLSBQcm9jZXNzZWQgRGF0YVxyXG5cdFx0ICovXHJcblx0XHRmaWx0ZXI6IEZpbHRlcjtcclxuXHR9IC8vQmFua1xyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIENhY2hlcyBFbnRyaWVzIGluIE1lbW9yeS5cclxuXHQgKiBAY2xhc3NcclxuXHQgKi9cclxuXHRleHBvcnQgY2xhc3MgQ2FjaGVCYW5rIGltcGxlbWVudHMgQmFuayB7XHJcblx0XHRcclxuXHRcdHB1YmxpYyBzdGF0aWMgZGVmYXVsdHM6IFBhcnRpYWw8QmFuaz4gPSB7XHJcblx0XHRcdF9zaXplOiAxMDAsXHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogTWF4IGNhY2hlIGVudHJpZXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEB0eXBlIHtudW1iZXJ9XHJcblx0XHQgKi9cclxuXHRcdHB1YmxpYyBfc2l6ZTogbnVtYmVyID0gTnVtYmVyKENhY2hlQmFuay5kZWZhdWx0cy5fc2l6ZSk7XHJcblx0XHQvKipcclxuXHRcdCAqIEVudHJpZXMuXHJcblx0XHQgKiBcclxuXHRcdCAqIEB0eXBlIHthbnlbXX1cclxuXHRcdCAqL1xyXG5cdFx0cHVibGljIGRhdGE6IGFueVtdID0gWyBdO1xyXG5cdFx0XHJcblx0XHRjb25zdHJ1Y3RvcihzaXplOiBudW1iZXIgPSBOdW1iZXIoQ2FjaGVCYW5rLmRlZmF1bHRzLl9zaXplKSwgZmlsdGVyZXI/OiBGaWx0ZXIsIGRhdGE/OiBhbnlbXSkge1xyXG5cdFx0XHR0aGlzLl9zaXplXHQ9IE51bWJlcihzaXplKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChkYXRhICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheSkgdGhpcy5kYXRhID0gZGF0YTtcclxuXHRcdFx0ZWxzZSBpZiAoZGF0YSkgdGhyb3cgXCJCYWQgSW5pdGlhbCBEYXRhXCI7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoZmlsdGVyZXIgJiYgZmlsdGVyZXIgaW5zdGFuY2VvZiBGdW5jdGlvbikgdGhpcy5maWx0ZXIgPSBmaWx0ZXJlcjtcclxuXHRcdFx0ZWxzZSBpZiAoZmlsdGVyZXIpIHRocm93IFwiQmFkIEZpbHRlclwiO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCF0aGlzLl9zaXplKSB0aHJvdyBcIkJhZCBDYWNoZUJhbmsgc2l6ZVwiO1xyXG5cdFx0fSAvL2N0b3JcclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBSZW1haW5pbmcgZW50cnlob2xlcyBhbW91bnQuXHJcblx0XHQgKiBcclxuXHRcdCAqIEB0eXBlIHtudW1iZXJ9IE51bWJlci5cclxuXHRcdCAqL1xyXG5cdFx0Z2V0IHJlbWFpbmluZygpOiBudW1iZXIge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5zaXplKCkgLSB0aGlzLmRhdGEubGVuZ3RoO1xyXG5cdFx0fSAvL2ctcmVtYWluaW5nXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogUmVzaXplIG9yIHF1ZXJ5IFNpemUuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBbbnN6XSAtIG5ldyBzaXplXHJcblx0XHQgKiBAcmV0dXJucyBbTmV3XSBTaXplLlxyXG5cdFx0ICovXHJcblx0XHRzaXplKG5zej86IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRcdGlmICghbnN6KSByZXR1cm4gdGhpcy5fc2l6ZTtcclxuXHRcdFx0ZWxzZSByZXR1cm4gdGhpcy5fc2l6ZSA9IG5zejtcclxuXHRcdH0gLy9zaXplXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogQ2FjaGUgYSBuZXcgRW50cnkuXHJcblx0XHQgKiBcclxuXHRcdCAqIEBwYXJhbSB7YW55W119IGRhdGEgLSBlbnRyeVxyXG5cdFx0ICogQHJldHVybnMge2FueVtdfSBOZXcgRW50cmllcy5cclxuXHRcdCAqL1xyXG5cdFx0Y2FjaGUoLi4uZGF0YTogYW55W10pOiBhbnlbXSB7XHJcblx0XHRcdGNvbnN0IG91dDogYW55W10gPSBkYXRhLm1hcCgoZDogYW55LCBpOiBudW1iZXIsIGE6IGFueVtdKTogYW55ID0+IHtcclxuXHRcdFx0XHRsZXQgbzogYW55ID0gdGhpcy5maWx0ZXIoZCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKG8gaW5zdGFuY2VvZiBQcm9taXNlKSBvLnRoZW4ocmVzID0+IHRoaXMuZGF0YS5wdXNoKG8gPSByZXMpKTtcclxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgbyA9PSBcImZ1bmN0aW9uXCIpIG8gPSB0aGlzLmNhY2hlKG8gPSBvKGksIGEpKVswXTtcclxuXHRcdFx0XHRlbHNlIHRoaXMuZGF0YS5wdXNoKG8pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiBvO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMudHJpbSgpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIG91dDtcclxuXHRcdH0gLy9jYWNoZVxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIEZpbGwgd2hvbGUgQmFuay5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHthbnl9IGRhdGEgLSB3aXRoXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVzPXRoaXMucmVtYWluaW5nXSAtIGFtb3VudFxyXG5cdFx0ICogQHJldHVybnMgXHJcblx0XHQgKi9cclxuXHRcdGNvbnN1bWUoZGF0YTogYW55LCB0aW1lczogbnVtYmVyID0gdGhpcy5yZW1haW5pbmcpOiBhbnlbXSB7XHJcblx0XHRcdGNvbnN0IG91dDogYW55W10gPSBbIF07XHJcblx0XHRcdFxyXG5cdFx0XHR3aGlsZSAodGltZXMtLSkgb3V0LnB1c2godGhpcy5jYWNoZShkYXRhKVswXSk7XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gb3V0O1xyXG5cdFx0fSAvL2NvbnN1bWVcclxuXHRcdFxyXG5cdFx0LyoqXHJcblx0XHQgKiBUcmltIG9sZGVzdCBlbnRyaWVzLlxyXG5cdFx0ICogXHJcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gW2FtdD10aGlzLnJlbWFpbmluZ10gYnkvYW1vdW50XHJcblx0XHQgKiBAcmV0dXJucyBUcmltbWVkIEVudHJpZXMuXHJcblx0XHQgKi9cclxuXHRcdHRyaW0oYW10OiBudW1iZXIgPSB0aGlzLnJlbWFpbmluZyk6IGFueVtdIHtcclxuXHRcdFx0aWYgKGFtdCA+IDApIHJldHVybiB0aGlzLmRhdGEuc3BsaWNlKDAsIGFtdCk7XHJcblx0XHRcdGVsc2UgcmV0dXJuIFsgXTtcclxuXHRcdH0gLy90cmltXHJcblx0XHRcclxuXHRcdC8qKlxyXG5cdFx0ICogRmlsdGVyZXIgb2YgZGF0YS5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIHthbnl9IGRhdGEgLSBkYXRhIHRvIHByb2Nlc3NcclxuXHRcdCAqIEByZXR1cm5zIHthbnl9IFByb2Nlc3NlZCBEYXRhLlxyXG5cdFx0ICovXHJcblx0XHRmaWx0ZXIoZGF0YTogYW55KTogYW55IHtcclxuXHRcdFx0Ly9TVFVCXHJcblx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0fSAvL2ZpbHRlclxyXG5cdFx0XHJcblx0XHQvKipcclxuXHRcdCAqIENsZWFyIEV4cGlyZWQgRW50cmllcy5cclxuXHRcdCAqIFxyXG5cdFx0ICogQHBhcmFtIGNvbmRpdGlvbiAtIGNvbmRpdGlvblxyXG5cdFx0ICogQHJldHVybnMgVGhpc1xyXG5cdFx0ICovXHJcblx0XHRjbGVhcihjb25kaXRpb246IChkYXRhOiBhbnksIGluZGV4PzogbnVtYmVyLCBhcnJheT86IGFueVtdKSA9PiBib29sZWFuID0gZGF0YSA9PiBkYXRhKTogdGhpcyB7XHJcblx0XHRcdHRoaXMuZGF0YSA9IHRoaXMuZGF0YS5maWx0ZXIoY29uZGl0aW9uKTtcclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSAvL2NsZWFyXHJcblx0XHRcclxuXHRcdGdldCBbU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZV0oKTogYm9vbGVhbiB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0KltTeW1ib2wuaXRlcmF0b3JdKCkge1xyXG5cdFx0XHRmb3IgKGNvbnN0IGkgb2YgdGhpcy5kYXRhKSB5aWVsZCBpO1xyXG5cdFx0fVxyXG5cdFx0YXN5bmMgKltTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKSB7XHJcblx0XHRcdGZvciAoY29uc3QgaSBvZiB0aGlzLmRhdGEpIHlpZWxkIGF3YWl0IGk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9IC8vQ2FjaGVCYW5rXHJcblx0XHJcbn0gLy9jYlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2I7XHJcbiJdfQ==