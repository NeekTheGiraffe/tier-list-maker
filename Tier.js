const TIER_MARGIN = 20;

const TIER_BACKGROUND_BRIGHTNESS = 70;
const TIER_OUTLINE_BRIGHTNESS = 0;
const TIER_OUTLINE_WEIGHT = 1;
const TIER_DARK_TEXT_BRIGHTNESS = 0;
const TIER_LIGHT_TEXT_BRIGHTNESS = 255;

class Tier {
    #x; #y; #width; #mayShrink;

    constructor(x, y, width, minHeight, name, color) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.minHeight = minHeight;
        this.height = minHeight;

        this.contents = [];
        
        this.name = name; // optional
        this.color = color; // optional
    }
    get x() { return this.#x; }
    set x(value) { this.#x = value; this.#adjustPositions(); }
    get y() { return this.#y; }
    set y(value) { this.#y = value; this.#adjustPositions(); }
    get width() { return this.#width; }
    set width(value) { this.#width = value; this.#adjustPositions(); }
    get mayShrink() { return this.#mayShrink; }
    set mayShrink(value) { setShrink(value); }
    setShrink(value) {
        this.#mayShrink = value;
        if (value) return this.#adjustHeight();
        return false;
    }
    /** If this Tier has a name like S, A, B, etc. */
    get isNamedTier() { return this.name != null; }
    /** The x of the _bucket_ portion of the Tier, which is _not_ the same as `x`. */
    get bucketX() {
        if (this.isNamedTier) {
            return this.#x + this.minHeight + TIER_MARGIN;
        }
        return this.#x;
    }
    /** The y of the _bucket_ portion of the Tier, which _is_ the same as `y`. */
    get bucketY() { return this.#y; }
    /** The width of the _bucket_ portion of the Tier, which is _not_ the same as `width`. */
    get bucketWidth() {
        if (this.isNamedTier) {
            return this.#width - this.minHeight - TIER_MARGIN;
        }
        return this.#width;
    }
    /** The height of the _bucket_ portion of the Tier, which _is_ the same as `height`. */
    get bucketHeight() { return this.height; }
    /** The number of items in this tier. */
    get size() { return this.contents.length; }
    /** If this Tier is empty. */
    get isEmpty() { return this.size === 0; }
    /** The number of rows of items in this Tier */
    get numRows() {
        return Math.floor((this.size - 1) / this.itemsPerRow) + 1;
    }
    /**
     * Returns whether this Tier contains a point.
     * @param {number} x 
     * @param {number} y 
     * @param {number} padding 
     */
    containsPoint(x, y, padding = 0) {
        const { x: tx, y: ty, width, height } = this;
        if (x < tx - padding || x > tx + width + padding ||
            y < ty - padding || y > ty + height + padding)
            return false;
        return true;
    }
    /**
     * Returns whether the _bucket_ portion of the Tier (i.e., the part
     * containing the tier items) contains a point.
     * @param {number} x 
     * @param {number} y 
     * @param {number} padding 
     */
    bucketContainsPoint(x, y, padding = 0) {
        const { bucketX, bucketWidth, bucketY, bucketHeight } = this;
        if (x < bucketX - padding || x > bucketX + bucketWidth + padding ||
            y < bucketY - padding || y > bucketY + bucketHeight + padding)
            return false;
        return true;
    }
    /**
     * Returns whether an item of interest is in this Tier
     * @param {TierItem} item The item of interest
     */
    containsItem(item) {
        const { x, y } = item;
        if (!this.bucketContainsPoint(x, y)) return false;
        return this.contents[this.#indexOf(x, y)] === item;
    }
    /**
     * Add an existing TierItem to the end of the tier
     * @param {TierItem} item 
     * @returns If the height of the Tier changed
     */
    addItem(item) {
        item.x = this.#xOf(this.size);
        item.y = this.#yOf(this.size);
        this.contents.push(item);
        
        if (this.size % this.itemsPerRow === 1) return this.#adjustHeight();
        return false;
    }
    /**
     * Add an existing TierItem at the specified coordinates
     * @param {TierItem} item 
     * @param {number} x 
     * @param {number} y 
     * @returns If the height of the Tier changed
     */
    addItemAtPosition(item, x, y) {
        const index = this.#indexOf(x, y, 1);
        this.contents = [...this.contents.slice(0, index), item, ...this.contents.slice(index + 1)];
        
        this.#adjustPositions(index);

        if (this.size % this.itemsPerRow === 1) return this.#adjustHeight();
        return false;
    }
    /**
     * 
     * @param {*} img 
     * @returns If the height of the tier changed
     */
    addItemWithImage(img) {
        const newItem = new TierItem({ x: this.#xOf(this.size), y: this.#yOf(this.size), image: img });
        this.contents.push(newItem);

        if (this.size % this.itemsPerRow === 1) return this.#adjustHeight();
        return false;
    }
    /**
     * Returns the tier item _closest_ to the specified coordinates
     * @param {number} x 
     * @param {number} y 
     * @returns The tier item, or null if the tier is empty
     */
    getNearest(x, y) {
        const index = this.#indexOf(x, y);
        if (index === -1) return null;
        return this.contents[index];
    }
    /**
     * Sets the slot occupied by `oldItem` to be occupied by `newItem`
     * @param {*} oldItem 
     * @param {*} newItem 
     * @returns 
     */
    setItem(oldItem, newItem) {
        const index = this.#indexOfItem(oldItem);
        if (index === -1 || this.contents[index] !== oldItem) return false;

        this.#setItemAtIndex(index, newItem);
        return true;
    }
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} item 
     * @returns If the operation was succesful
     */
    setItemAt(x, y, item) {
        const index = this.#indexOf(x, y);
        if (index === -1) return false;

        this.#setItemAtIndex(index, item);
        return true;
    }
    #setItemAtIndex(index, item) {
        item.x = this.#xOf(index);
        item.y = this.#yOf(index);
        this.contents[index] = item;
    }
    /**
     * Removes the provided item, if it exists in this Tier.
     * @param {TierItem} item 
     * @returns Whether the height of the Tier changed
     */
    removeItem(item) {
        const index = this.#indexOfItem(item);
        if (index === -1 || this.contents[index] !== item) return false;
        return this.#removeItemAtIndex(index);
    }
    /**
     * Removes the item located at the designated position.
     * @param {number} x 
     * @param {number} y 
     * @returns Whether the height of the Tier changed
     */
    removeItemAt(x, y) {
        const index = this.#indexOf(x, y);
        if (index === -1) return false;
        return this.#removeItemAtIndex(index);
    }
    /**
     * Removes an item at the specified index
     * @param {number} index 
     * @returns 
     */
    #removeItemAtIndex(index) {
        this.contents.splice(index, 1);
        this.#adjustPositions(index);
        if (this.mayShrink && this.size % this.itemsPerRow == 0) {
            return this.#adjustHeight();
        }
        return false;
    }
    /**
     * Attempts to move an item within this tier
     * @param {TierItem} item 
     * @param {number} x The target x
     * @param {number} y The target y
     */
    moveItemWithinBucket(item, x, y) {
        const oldIndex = this.#indexOfItem(item);
        if (oldIndex === -1 || contents[oldIndex] !== item) {
            // Item is not in this Tier
            return false;
        }
        const newIndex = this.#indexOf(x, y);
        this.#shift(oldIndex, newIndex);
    }
    /**
     * Draws this tier and its contents
     */
    draw() {
        // Draw the background
        rectMode(CORNER);
        fill(TIER_BACKGROUND_BRIGHTNESS);
        stroke(TIER_OUTLINE_BRIGHTNESS);
        strokeWeight(TIER_OUTLINE_WEIGHT);
        rect(this.bucketX, this.bucketY, this.bucketWidth, this.height);

        // Draw the tier icon
        if (this.isNamedTier) {
            fill(this.color);
            rect(this.#x, this.#y, this.minHeight, this.height);

            textAlign(CENTER, BASELINE);
            fill((red(this.color) + green(this.color) + blue(this.color) > 600) ?
                TIER_DARK_TEXT_BRIGHTNESS : TIER_LIGHT_TEXT_BRIGHTNESS);
            text(this.name, this.#x + 0.5*this.minHeight, this.#y + 0.5*this.height + 0.5*textAscent());
        }

        // Draw the items
        this.contents.forEach(item => item.draw());
    }

    // ---- Helper functions ----

    /** Returns the index that an x, y coordinate 'belongs' to
     * based on the positioning of items in this tier.
     */
    #indexOf(x, y, extraSlots = 0) {
        const numItems = this.size + extraSlots;
        const numRows = Math.floor((numItems - 1) / this.itemsPerRow) + 1;
        const numColumns = Math.min(numItems, this.itemsPerRow);

        const column = this.#calcFromEquallySpacedGroups(x, this.bucketX, TIER_ITEM_SIZE, numColumns);
        const row = this.#calcFromEquallySpacedGroups(y, this.bucketY, TIER_ITEM_SIZE, numRows);

        const index = row * this.itemsPerRow + column;
        return Math.min(index, numItems - 1);
    }
    /**
     * Returns the index of an item inside this tier
     * @param {TierItem} item 
     * @returns The index of the item, or -1 if it's not in this tier
     */
    #indexOfItem(item) {
        const { x, y } = item;
        if (!this.containsPoint(x, y)) return -1;
        return this.indexOf(x, y);
    }
    /** Calculates the 'index' of the group that an item belongs to
     * Say there are 4 equally spaced groups along a 1D-axis:
     * `[___][___][__*][___]`
     * You want to find out what group the * belongs to.
     * Here it would be group 2.
     */
    #calcFromEquallySpacedGroups(testVal, startVal, spacing, numGroups) {
        if (testVal < startVal) return 0;
        if (testVal > startVal + numGroups * spacing) return numGroups - 1;
        return Math.floor((testVal - startVal) / spacing);
    }
    /** The x value where an item should be located */
    #xOf(index) {
        return this.bucketX + TIER_ITEM_SIZE * (index % this.itemsPerRow);
    }
    /** The y value where an item should be located */
    #yOf(index) {
        return this.bucketY + TIER_ITEM_SIZE * (index / this.itemsPerRow);
    }
    /** The number of items that can fit inside 1 row of this tier */
    get itemsPerRow() { return Math.floor(this.bucketWidth / TIER_ITEM_SIZE); }
    /** Adjusts the positions of the items stored in this Tier
     * to their proper locations.
     */
    #adjustPositions(firstIndex = 0) {
        this.contents.slice(firstIndex).forEach((item, index) => {
            item.x = this.#xOf(index);
            item.y = this.#yOf(index);
        });
    }
    /** Adjusts the height to match the number of items in this Tier
     * @returns If the new height is different from the old height.
     */
    #adjustHeight() {
        const newHeight = Math.max(this.numRows * TIER_ITEM_SIZE, this.minHeight);
        if (newHeight === this.height) return false;
        this.height = newHeight;
        return true;
    }
    /** The item at index i1 'jumps' to index i2.
     * Shift the items in between to accomodate this jump.
     * @param {number} i1
     * @param {number} i2
     */
    #shift(i1, i2) {
        if (i1 === i2) return;
        if (i1 > i2) {
            // Shift all items in between to the right
            this.contents = [
                ...this.contents.slice(0, i2),
                this.contents[i1],
                ...this.contents.slice(i2, i1),
                ...this.contents.slice(i1 + 1)
            ];
        } else {
            // i1 < i2
            this.contents = [
                ...this.contents.slice(0, i1),
                ...this.contents.slice(i1 + 1, i2),
                this.contents[i1],
                ...this.contents.slice(i2)
            ];
        }
        this.#adjustPositions();
    }
}