const TIER_ITEM_SIZE = 100;
const TIER_ITEM_DEFAULT_BRIGHTNESS = 255;
const TIER_ITEM_DEFAULT_ALPHA = 255;

class TierItem {
    constructor(props = {}, other) {
        if (other != null) {
            props = other;
        }
        let { x, y, image,
            brightness = TIER_ITEM_DEFAULT_BRIGHTNESS,
            alpha = TIER_ITEM_DEFAULT_ALPHA
        } = props;
        this.x = x;
        this.y = y;
        this.image = image;
        this.brightness = brightness;
        this.alpha = alpha;
        this.image.resize(TIER_ITEM_SIZE, TIER_ITEM_SIZE);
    }

    containsPoint(x, y) {
        if (x < this.x || x > this.x + TIER_ITEM_SIZE ||
            y < this.y || y > this.y + TIER_ITEM_SIZE)
            return false;
        return true;
    }

    draw() {
        tint(this.brightness, this.alpha);
        image(this.image, this.x, this.y);
    }
}