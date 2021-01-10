class PQEntry {
    /**
     * Creates a new entry for the PriorityQueue
     * @param {Number} key priority of the entry
     * @param {Object} value value of the entry
     * @param {Number} index index of the entry
     */
    constructor(key, value, index) {
        this.key = key;
        this.value = value;
        this.index = index;
    }
}

/**
 *
 * Data Structures & Algorithms 6th Ed
 * @author Michael T. Goodrich
 * @author Roberto Tamassia
 * @author Michael H. Goldwasser
 */
export class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    /**
     * Inserts a value according to its priority in the PriorityQueue.
     *
     * @param {Number} key priority of the value
     * @param {*} value value to be stored
     * @returns {PQEntry} the added entry
     */
    insert(key, value) {
        let newest = new PQEntry(key, value, this.heap.length);
        this.heap.push(newest);
        this._upheap(this.size - 1);
        return newest;
    }

    /**
     * Removes the given entry.
     *
     * @param {PQEntry} entry entry to be removed.
     */
    remove(entry) {
        const locator = this._validate(entry);
        let i = locator.index;

        if (i == this.heap.length - 1) {
            this.heap.pop();
        } else {
            this._swap(i, this.heap.length - 1);
            this.heap.pop();
            this._bubble(i);
        }
    }

    /**
     * Updates the priority of the given entry.
     *
     * @param {PQEntry} entry enter to be updated
     * @param {Number} newPriority updated priority
     */
    replaceKey(entry, newPriority) {
        const locator = this._validate(entry);
        locator.key = newPriority;
        this._bubble(locator.index);
    }

    /**
     * Updates the value of the given entry.
     *
     * @param {PQEntry} entry entry to be updated
     * @param {*} newValue updated value
     */
    replaceValue(entry, newValue) {
        const locator = this._validate(entry);
        locator.value = newValue;
    }

    /**
     * Returns the value in PriorityQueue with minimal priority.
     *
     * @returns {PQEntry} value with minimal priority
     */
    min() {
        if (this.isEmpty()) return null;
        return this.heap[0];
    }

    /**
     * Returns and removes the value in PriorityQueue with minimal priority.
     *
     * @returns {PQEntry} value with minimal priority
     */
    removeMin() {
        if (this.isEmpty()) return null;

        this._swap(0, this.size - 1);
        const output = this.heap.pop();
        this._downheap(0);
        return output;
    }

    /**
     * Returns the number of values in the PriorityQueue.
     *
     * @returns {Number} size of the PriorityQueue
     */
    get size() {
        return this.heap.length;
    }

    /**
     * Returns true if the PriorityQueue has no elements, false otherwise.
     *
     * @returns {Boolean} true if PriorityQueue is empty, false otherwise.
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    // return the index of the parent of the Entry at i
    _parent(i) {
        return Math.floor((i - 1) / 2);
    }

    // return the index of the left child of the Entry at i
    _left(i) {
        return 2 * i + 1;
    }

    // return the index of the right child of the Entry at i
    _right(i) {
        return 2 * i + 2;
    }

    // returns true if Entry at i has a left child, false otherwise
    _hasLeft(i) {
        return this._left(i) < this.size;
    }

    // returns true if Entry at i has a rgiht child, false otherwise
    _hasRight(i) {
        return this._right(i) < this.size;
    }

    // swaps the Entries at i and j
    _swap(i, j) {
        const tmp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = tmp;

        this.heap[i].index = i;
        this.heap[j].index = j;
    }

    // performs an upheap operation from starting from the Entry at i
    _upheap(i) {
        while (i > 0) {
            const p = this._parent(i);
            if (this.heap[i].key >= this.heap[p].key) break;

            this._swap(i, p);
            i = p;
        }
    }

    // performs an downheap operation from starting from the Entry at i
    _downheap(i) {
        while (this._hasLeft(i)) {
            const leftIndex = this._left(i);
            let smallChildIndex = leftIndex;
            if (this._hasRight(i)) {
                const rightIndex = this._right(i);
                if (this.heap[leftIndex].key > this.heap[rightIndex].key)
                    smallChildIndex = rightIndex;
            }

            if (this.heap[smallChildIndex].key >= this.heap[i].key) break;

            this._swap(i, smallChildIndex);
            i = smallChildIndex;
        }
    }

    _bubble(i) {
        if (i > 0 && this.heap[i].key < this.heap[this._parent(i)].key) {
            this._upheap(i);
        } else {
            this._downheap(i);
        }
    }

    // Validates the PQEntry
    _validate(entry) {
        let i = entry.index;
        if (i >= this.heap.length || this.heap[i] !== entry) {
            throw Error("Invalid Entry");
        }
        return entry;
    }
}
