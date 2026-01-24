import { _decorator, Component, Node, Graphics, UITransform, Color, Vec3, Vec2, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

export enum HighlightType {
    CIRCLE,
    RECT
}

@ccclass('GuideMask')
export class GuideMask extends Component {

    @property(Node)
    holeNode: Node = null!;   // Graphics 节点

    @property(Graphics)
    holeGraphics: Graphics = null!;

    @property(Node)
    darkLayer: Node = null!;  // 半透明黑色背景

    private highlightType: HighlightType = HighlightType.CIRCLE;

    private center = new Vec2();
    private radius = 80;

    private rectW = 100;
    private rectH = 60;
    private rectRadius = 10;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    /** 设置圆形高亮 */
    setCircleHighlight(worldPos: Vec3, radius: number) {
        const uiPos = this.worldToUI(worldPos);
        this.highlightType = HighlightType.CIRCLE;
        this.center.set(uiPos.x, uiPos.y);
        this.radius = radius;
        this.redraw();
    }

    /** 设置矩形高亮 */
    setRectHighlight(worldPos: Vec3, width: number, height: number, cornerRadius = 10) {
        const uiPos = this.worldToUI(worldPos);
        this.highlightType = HighlightType.RECT;
        this.rectW = width;
        this.rectH = height;
        this.rectRadius = cornerRadius;

        this.center.set(uiPos.x, uiPos.y);
        this.redraw();
    }

    /** 自动高亮 UI 节点 */
    highlightNode(target: Node, padding = 10) {
        const ui = target.getComponent(UITransform);
        if (!ui) return;

        const size = ui.contentSize;
        const worldPos = target.worldPosition;

        this.setRectHighlight(
            worldPos,
            size.width + padding * 2,
            size.height + padding * 2,
            12
        );
    }

    /** 重绘洞 */
    private redraw() {
        const g = this.holeGraphics;
        g.clear();

        if (this.highlightType === HighlightType.CIRCLE) {
            g.circle(this.center.x, this.center.y, this.radius);
            g.fillColor = Color.WHITE; // 颜色无所谓，只用于 stencil
            g.fill();
        } else {
            const x = this.center.x - this.rectW / 2;
            const y = this.center.y - this.rectH / 2;
            g.roundRect(x, y, this.rectW, this.rectH, this.rectRadius);
            g.fillColor = Color.WHITE;
            g.fill();
        }
    }

    /** 世界坐标转 UI 坐标 */
    private worldToUI(worldPos: Vec3): Vec2 {
        const uiPos = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(worldPos);
        return new Vec2(uiPos.x, uiPos.y);
    }

    /** 点击穿透逻辑 */
    private onTouchStart(event: EventTouch) {
        const p = event.getUILocation();
        const local = this.node.getComponent(UITransform)!.convertToNodeSpaceAR(new Vec3(p.x, p.y));

        if (this.isInHighlight(local)) {
            return; // 允许穿透
        }

        event.propagationStopped = true; // 阻止事件继续向父节点冒泡
    }

    private isInHighlight(p: Vec3): boolean {
        if (this.highlightType === HighlightType.CIRCLE) {
            const dx = p.x - this.center.x;
            const dy = p.y - this.center.y;
            return dx * dx + dy * dy <= this.radius * this.radius;
        } else {
            const x = this.center.x - this.rectW / 2;
            const y = this.center.y - this.rectH / 2;
            return (
                p.x >= x &&
                p.x <= x + this.rectW &&
                p.y >= y &&
                p.y <= y + this.rectH
            );
        }
    }
}
