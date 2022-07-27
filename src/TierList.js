class TierList {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.tiers = [];

        const baseBucketY = this.#createDefaultTiers();

        this.baseBucket = new Tier(x, baseBucketY, width, TIER_ITEM_SIZE);
    }

    get mayShrink() { return this.baseBucket.mayShrink; }
    set mayShrink(value) { return this.setShrink(value); }
    setShrink(value) {
        let changedHeight = false;
        this.tiers.forEach(tier => {
            if (tier.setShrink(value)) changedHeight = true;
        });
        if (this.baseBucket.setShrink(value)) changedHeight = true;
        if (changedHeight) this.#adjustPositions();
        return changedHeight;
    }
    get height() {
        return this.tiers.reduce((acc, tier) => acc + tier.height + TIER_MARGIN, 2*TIER_MARGIN) + this.baseBucket.height;
    }
    /**
     * 
     * @param {*} image 
     */
    addItemWithImage(image) { this.baseBucket.addItemWithImage(image); }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns The nearest item, or null if there are no items in the nearest tier
     */
    getNearest(x, y) {
        const tier = this.tiers.find(tier => tier.containsPoint(x, y, TIER_MARGIN));
        if (tier) return tier.getNearest(x, y);
        return this.baseBucket.getNearest(x, y);
    }
    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @returns The item directly under the mouse, or null
     */
    getItemAt(x, y) {
        const tier = this.tiers.find(tier => tier.containsPoint(x, y));
        if (tier) return tier.getNearest(x, y);
        if (!this.baseBucket.containsPoint(x, y)) return null;
        return this.baseBucket.getNearest(x, y);
    }
    setItemAt(x, y, item) {
        const tier = this.tiers.find(tier => tier.bucketContainsPoint(x, y));
        if (tier) return tier.setItemAt(x, y, item);
        if (!this.baseBucket.containsPoint(x, y)) return false;
        return this.baseBucket.setItemAt(x, y, item);
    }
    setItem(oldItem, newItem) {
        const { x, y } = oldItem;
        return this.setItemAt(x, y, newItem);
    }
    adjustItemPosition(item, x, y) {
        const oldTier = this.#tierOfItem(item);
        const newTier = this.#tierOf(x, y, TIER_MARGIN);

        if (oldTier == null || newTier == null) return;

        if (oldTier !== newTier) {
            let heightChanged = false;
            if (oldTier.removeItem(item)) heightChanged = true;
            if (newTier.addItemAtPosition(item, x, y)) heightChanged = true;
            if (heightChanged) this.#adjustPositions();
            return;
        }

        oldTier.moveItemWithinBucket(item, x, y);
    }
    draw() {
        this.tiers.forEach(tier => tier.draw());
        this.baseBucket.draw();
    }

    #createDefaultTiers() {
        const tiers = [
            { name: 'S', color: color(245, 41, 0) },
            { name: 'A', color: color(245, 147, 0) },
            { name: 'B', color: color(245, 200, 0) },
            { name: 'C', color: color(104, 201, 0) },
            { name: 'D', color: color(6, 112, 212) },
            { name: 'F', color: color(87, 0, 217) }
        ];

        let y = this.y;
        tiers.forEach(tier => {
            this.tiers.push(new Tier(this.x, y, this.width, TIER_ITEM_SIZE, tier.name, tier.color));
            y += TIER_ITEM_SIZE + TIER_MARGIN;
        });
        return y;
    }
    #adjustPositions() {
        let y = this.y;
        this.tiers.forEach(tier => {
            tier.y = y;
            y += tier.height + TIER_MARGIN;
        });
        this.baseBucket.y = y;
    }
    #tierOf(x, y, padding = 0) {
        const tier = this.tiers.find(tier => tier.containsPoint(x, y, padding));
        if (tier != null) return tier;
        if (this.baseBucket.containsPoint(x, y, padding)) return this.baseBucket;
        return null;
    }
    #tierOfItem(item) {
        const tier = this.tiers.find(tier => tier.containsItem(item));
        if (tier != null) return tier;
        if (this.baseBucket.containsItem(item)) return this.baseBucket;
        return null;
    }
}