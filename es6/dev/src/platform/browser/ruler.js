import { PromiseWrapper } from 'angular2/src/facade/async';
export class Rectangle {
    constructor(left, top, width, height) {
        this.left = left;
        this.right = left + width;
        this.top = top;
        this.bottom = top + height;
        this.height = height;
        this.width = width;
    }
}
export class Ruler {
    constructor(domAdapter) {
        this.domAdapter = domAdapter;
    }
    measure(el) {
        var clntRect = this.domAdapter.getBoundingClientRect(el.nativeElement);
        // even if getBoundingClientRect is synchronous we use async API in preparation for further
        // changes
        return PromiseWrapper.resolve(new Rectangle(clntRect.left, clntRect.top, clntRect.width, clntRect.height));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLW9pVmhHU256LnRtcC9hbmd1bGFyMi9zcmMvcGxhdGZvcm0vYnJvd3Nlci9ydWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDJCQUEyQjtBQUl4RDtJQU9FLFlBQVksSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTTtRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztBQUNILENBQUM7QUFFRDtJQUVFLFlBQVksVUFBc0I7UUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUFDLENBQUM7SUFFckUsT0FBTyxDQUFDLEVBQWM7UUFDcEIsSUFBSSxRQUFRLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFNUUsMkZBQTJGO1FBQzNGLFVBQVU7UUFDVixNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FDekIsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtEb21BZGFwdGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcbmltcG9ydCB7RWxlbWVudFJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2VsZW1lbnRfcmVmJztcblxuZXhwb3J0IGNsYXNzIFJlY3RhbmdsZSB7XG4gIGxlZnQ7XG4gIHJpZ2h0O1xuICB0b3A7XG4gIGJvdHRvbTtcbiAgaGVpZ2h0O1xuICB3aWR0aDtcbiAgY29uc3RydWN0b3IobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnJpZ2h0ID0gbGVmdCArIHdpZHRoO1xuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMuYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUnVsZXIge1xuICBkb21BZGFwdGVyOiBEb21BZGFwdGVyO1xuICBjb25zdHJ1Y3Rvcihkb21BZGFwdGVyOiBEb21BZGFwdGVyKSB7IHRoaXMuZG9tQWRhcHRlciA9IGRvbUFkYXB0ZXI7IH1cblxuICBtZWFzdXJlKGVsOiBFbGVtZW50UmVmKTogUHJvbWlzZTxSZWN0YW5nbGU+IHtcbiAgICB2YXIgY2xudFJlY3QgPSA8YW55PnRoaXMuZG9tQWRhcHRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoZWwubmF0aXZlRWxlbWVudCk7XG5cbiAgICAvLyBldmVuIGlmIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpcyBzeW5jaHJvbm91cyB3ZSB1c2UgYXN5bmMgQVBJIGluIHByZXBhcmF0aW9uIGZvciBmdXJ0aGVyXG4gICAgLy8gY2hhbmdlc1xuICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKFxuICAgICAgICBuZXcgUmVjdGFuZ2xlKGNsbnRSZWN0LmxlZnQsIGNsbnRSZWN0LnRvcCwgY2xudFJlY3Qud2lkdGgsIGNsbnRSZWN0LmhlaWdodCkpO1xuICB9XG59XG4iXX0=