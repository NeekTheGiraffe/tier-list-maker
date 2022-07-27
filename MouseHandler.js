const DEFAULT_BRIGHTNESS = 255;
const DRAGGED_ITEM_BRIGHTNESS = 100;
const HOVER_ITEM_BRIGHTNESS = 150;
const GHOST_ITEM_BRIGHTNESS = 255;
const GHOST_ITEM_ALPHA = 127;

class MouseHandler {
    /**
     * Creates a new MouseHandler
     * @param {TierList} tierList 
     */
    constructor(tierList) { this.tierList = tierList; }

    handleMouseDragged(x, y) {
        if (this.dragged != null) {
            // We're dragging a tier item
            this.dragged.x = x - 0.5*TIER_ITEM_SIZE;
            this.dragged.y = y - 0.5*TIER_ITEM_SIZE;
            this.tierList.adjustItemPosition(this.ghostDragged, x, y);
            
            return;
        }

        // If we're dragging over an item, pick it up
        this.dragged = this.tierList.getItemAt(x, y);
        if (this.dragged == null) {
            return;
        }
        this.dragged.brightness = DRAGGED_ITEM_BRIGHTNESS;
        
        this.ghostDragged = new TierItem(this.dragged);
        this.ghostDragged.brightness = GHOST_ITEM_BRIGHTNESS;
        this.ghostDragged.alpha = GHOST_ITEM_ALPHA;

        this.tierList.setItem(x, y, this.ghostDragged);
        this.tierList.mayShrink = false;
    }

    handleMouseReleased(x, y) {
        if (this.dragged == null) return;

        this.tierList.setItem(this.ghostDragged, this.dragged);
        this.dragged.brightness = DEFAULT_BRIGHTNESS;
        this.dragged = null;
        this.ghostDragged = null;

        this.tierList.mayShrink = true;
    }

    handleMouseMoved(x, y) {
        const current = this.tierList.getItemAt(x, y);

        if (this.dragged == null) {
            if (current != null) {
                current.brightness = mouseIsPressed ? DRAGGED_ITEM_BRIGHTNESS : HOVER_ITEM_BRIGHTNESS;
            }
            if (this.previous != null && current !== this.previous) {
                this.previous.brightness = DEFAULT_BRIGHTNESS;
            }
        }
    }

    draw() {
        if (this.dragged != null) {
            this.dragged.draw();
        }
    }
}