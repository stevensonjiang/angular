'use strict';"use strict";
var core_1 = require('angular2/core');
var constants_1 = require('./constants');
var INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
var DowngradeNg2ComponentAdapter = (function () {
    function DowngradeNg2ComponentAdapter(id, info, element, attrs, scope, parentInjector, parse, viewManager, hostViewFactory) {
        this.id = id;
        this.info = info;
        this.element = element;
        this.attrs = attrs;
        this.scope = scope;
        this.parentInjector = parentInjector;
        this.parse = parse;
        this.viewManager = viewManager;
        this.hostViewFactory = hostViewFactory;
        this.component = null;
        this.inputChangeCount = 0;
        this.inputChanges = null;
        this.hostViewRef = null;
        this.changeDetector = null;
        this.contentInsertionPoint = null;
        this.element[0].id = id;
        this.componentScope = scope.$new();
        this.childNodes = element.contents();
    }
    DowngradeNg2ComponentAdapter.prototype.bootstrapNg2 = function () {
        var childInjector = this.parentInjector.resolveAndCreateChild([core_1.provide(constants_1.NG1_SCOPE, { useValue: this.componentScope })]);
        this.contentInsertionPoint = document.createComment('ng1 insertion point');
        this.hostViewRef = this.viewManager.createRootHostView(this.hostViewFactory, '#' + this.id, childInjector, [[this.contentInsertionPoint]]);
        var hostElement = this.viewManager.getHostElement(this.hostViewRef);
        this.changeDetector = this.hostViewRef.changeDetectorRef;
        this.component = this.viewManager.getComponent(hostElement);
    };
    DowngradeNg2ComponentAdapter.prototype.setupInputs = function () {
        var _this = this;
        var attrs = this.attrs;
        var inputs = this.info.inputs;
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var expr = null;
            if (attrs.hasOwnProperty(input.attr)) {
                var observeFn = (function (prop) {
                    var prevValue = INITIAL_VALUE;
                    return function (value) {
                        if (_this.inputChanges !== null) {
                            _this.inputChangeCount++;
                            _this.inputChanges[prop] =
                                new Ng1Change(value, prevValue === INITIAL_VALUE ? value : prevValue);
                            prevValue = value;
                        }
                        _this.component[prop] = value;
                    };
                })(input.prop);
                attrs.$observe(input.attr, observeFn);
            }
            else if (attrs.hasOwnProperty(input.bindAttr)) {
                expr = attrs[input.bindAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketAttr)) {
                expr = attrs[input.bracketAttr];
            }
            else if (attrs.hasOwnProperty(input.bindonAttr)) {
                expr = attrs[input.bindonAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketParenAttr)) {
                expr = attrs[input.bracketParenAttr];
            }
            if (expr != null) {
                var watchFn = (function (prop) { return function (value, prevValue) {
                    if (_this.inputChanges != null) {
                        _this.inputChangeCount++;
                        _this.inputChanges[prop] = new Ng1Change(prevValue, value);
                    }
                    _this.component[prop] = value;
                }; })(input.prop);
                this.componentScope.$watch(expr, watchFn);
            }
        }
        var prototype = this.info.type.prototype;
        if (prototype && prototype.ngOnChanges) {
            // Detect: OnChanges interface
            this.inputChanges = {};
            this.componentScope.$watch(function () { return _this.inputChangeCount; }, function () {
                var inputChanges = _this.inputChanges;
                _this.inputChanges = {};
                _this.component.ngOnChanges(inputChanges);
            });
        }
        this.componentScope.$watch(function () { return _this.changeDetector && _this.changeDetector.detectChanges(); });
    };
    DowngradeNg2ComponentAdapter.prototype.projectContent = function () {
        var childNodes = this.childNodes;
        var parent = this.contentInsertionPoint.parentNode;
        if (parent) {
            for (var i = 0, ii = childNodes.length; i < ii; i++) {
                parent.insertBefore(childNodes[i], this.contentInsertionPoint);
            }
        }
    };
    DowngradeNg2ComponentAdapter.prototype.setupOutputs = function () {
        var _this = this;
        var attrs = this.attrs;
        var outputs = this.info.outputs;
        for (var j = 0; j < outputs.length; j++) {
            var output = outputs[j];
            var expr = null;
            var assignExpr = false;
            var bindonAttr = output.bindonAttr ? output.bindonAttr.substring(0, output.bindonAttr.length - 6) : null;
            var bracketParenAttr = output.bracketParenAttr ?
                "[(" + output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8) + ")]" :
                null;
            if (attrs.hasOwnProperty(output.onAttr)) {
                expr = attrs[output.onAttr];
            }
            else if (attrs.hasOwnProperty(output.parenAttr)) {
                expr = attrs[output.parenAttr];
            }
            else if (attrs.hasOwnProperty(bindonAttr)) {
                expr = attrs[bindonAttr];
                assignExpr = true;
            }
            else if (attrs.hasOwnProperty(bracketParenAttr)) {
                expr = attrs[bracketParenAttr];
                assignExpr = true;
            }
            if (expr != null && assignExpr != null) {
                var getter = this.parse(expr);
                var setter = getter.assign;
                if (assignExpr && !setter) {
                    throw new Error("Expression '" + expr + "' is not assignable!");
                }
                var emitter = this.component[output.prop];
                if (emitter) {
                    emitter.subscribe({
                        next: assignExpr ? (function (setter) { return function (value) { return setter(_this.scope, value); }; })(setter) :
                            (function (getter) { return function (value) { return getter(_this.scope, { $event: value }); }; })(getter)
                    });
                }
                else {
                    throw new Error("Missing emitter '" + output.prop + "' on component '" + this.info.selector + "'!");
                }
            }
        }
    };
    DowngradeNg2ComponentAdapter.prototype.registerCleanup = function () {
        var _this = this;
        this.element.bind('$destroy', function () { return _this.viewManager.destroyRootHostView(_this.hostViewRef); });
    };
    return DowngradeNg2ComponentAdapter;
}());
exports.DowngradeNg2ComponentAdapter = DowngradeNg2ComponentAdapter;
var Ng1Change = (function () {
    function Ng1Change(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
    }
    Ng1Change.prototype.isFirstChange = function () { return this.previousValue === this.currentValue; };
    return Ng1Change;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX25nMl9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1QdEp6eHk2dC50bXAvYW5ndWxhcjIvc3JjL3VwZ3JhZGUvZG93bmdyYWRlX25nMl9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFTTyxlQUFlLENBQUMsQ0FBQTtBQUN2QiwwQkFBd0IsYUFBYSxDQUFDLENBQUE7QUFLdEMsSUFBTSxhQUFhLEdBQUc7SUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDO0FBRUY7SUFVRSxzQ0FBb0IsRUFBVSxFQUFVLElBQW1CLEVBQ3ZDLE9BQWlDLEVBQVUsS0FBMEIsRUFDckUsS0FBcUIsRUFBVSxjQUF3QixFQUN2RCxLQUE0QixFQUFVLFdBQTJCLEVBQ2pFLGVBQW1DO1FBSm5DLE9BQUUsR0FBRixFQUFFLENBQVE7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFlO1FBQ3ZDLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBcUI7UUFDckUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBVTtRQUN2RCxVQUFLLEdBQUwsS0FBSyxDQUF1QjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjtRQUNqRSxvQkFBZSxHQUFmLGVBQWUsQ0FBb0I7UUFidkQsY0FBUyxHQUFRLElBQUksQ0FBQztRQUN0QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDN0IsaUJBQVksR0FBa0MsSUFBSSxDQUFDO1FBQ25ELGdCQUFXLEdBQWdCLElBQUksQ0FBQztRQUNoQyxtQkFBYyxHQUFzQixJQUFJLENBQUM7UUFHekMsMEJBQXFCLEdBQVMsSUFBSSxDQUFDO1FBTzNCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMs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LENBQUM7NEJBQzFELENBQUMsVUFBQyxNQUFNLElBQUssT0FBQSxVQUFDLEtBQUssSUFBSyxPQUFBLE1BQU0sQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQW5DLENBQW1DLEVBQTlDLENBQThDLENBQUMsQ0FBQyxNQUFNLENBQUM7cUJBQ3hGLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQW9CLE1BQU0sQ0FBQyxJQUFJLHdCQUFtQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsT0FBSSxDQUFDLENBQUM7Z0JBQzVGLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxzREFBZSxHQUFmO1FBQUEsaUJBRUM7UUFEQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUNILG1DQUFDO0FBQUQsQ0FBQyxBQWpKRCxJQWlKQztBQWpKWSxvQ0FBNEIsK0JBaUp4QyxDQUFBO0FBRUQ7SUFDRSxtQkFBbUIsYUFBa0IsRUFBUyxZQUFpQjtRQUE1QyxrQkFBYSxHQUFiLGFBQWEsQ0FBSztRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFLO0lBQUcsQ0FBQztJQUVuRSxpQ0FBYSxHQUFiLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQy9FLGdCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBwcm92aWRlLFxuICBBcHBWaWV3TWFuYWdlcixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEhvc3RWaWV3UmVmLFxuICBJbmplY3RvcixcbiAgT25DaGFuZ2VzLFxuICBIb3N0Vmlld0ZhY3RvcnlSZWYsXG4gIFNpbXBsZUNoYW5nZVxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7TkcxX1NDT1BFfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQge0NvbXBvbmVudEluZm99IGZyb20gJy4vbWV0YWRhdGEnO1xuaW1wb3J0IEVsZW1lbnQgPSBwcm90cmFjdG9yLkVsZW1lbnQ7XG5pbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJy4vYW5ndWxhcl9qcyc7XG5cbmNvbnN0IElOSVRJQUxfVkFMVUUgPSB7XG4gIF9fVU5JTklUSUFMSVpFRF9fOiB0cnVlXG59O1xuXG5leHBvcnQgY2xhc3MgRG93bmdyYWRlTmcyQ29tcG9uZW50QWRhcHRlciB7XG4gIGNvbXBvbmVudDogYW55ID0gbnVsbDtcbiAgaW5wdXRDaGFuZ2VDb3VudDogbnVtYmVyID0gMDtcbiAgaW5wdXRDaGFuZ2VzOiB7W2tleTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlfSA9IG51bGw7XG4gIGhvc3RWaWV3UmVmOiBIb3N0Vmlld1JlZiA9IG51bGw7XG4gIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZiA9IG51bGw7XG4gIGNvbXBvbmVudFNjb3BlOiBhbmd1bGFyLklTY29wZTtcbiAgY2hpbGROb2RlczogTm9kZVtdO1xuICBjb250ZW50SW5zZXJ0aW9uUG9pbnQ6IE5vZGUgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaWQ6IHN0cmluZywgcHJpdmF0ZSBpbmZvOiBDb21wb25lbnRJbmZvLFxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnQ6IGFuZ3VsYXIuSUF1Z21lbnRlZEpRdWVyeSwgcHJpdmF0ZSBhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY29wZTogYW5ndWxhci5JU2NvcGUsIHByaXZhdGUgcGFyZW50SW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIHBhcnNlOiBhbmd1bGFyLklQYXJzZVNlcnZpY2UsIHByaXZhdGUgdmlld01hbmFnZXI6IEFwcFZpZXdNYW5hZ2VyLFxuICAgICAgICAgICAgICBwcml2YXRlIGhvc3RWaWV3RmFjdG9yeTogSG9zdFZpZXdGYWN0b3J5UmVmKSB7XG4gICAgKDxhbnk+dGhpcy5lbGVtZW50WzBdKS5pZCA9IGlkO1xuICAgIHRoaXMuY29tcG9uZW50U2NvcGUgPSBzY29wZS4kbmV3KCk7XG4gICAgdGhpcy5jaGlsZE5vZGVzID0gPE5vZGVbXT48YW55PmVsZW1lbnQuY29udGVudHMoKTtcbiAgfVxuXG4gIGJvb3RzdHJhcE5nMigpIHtcbiAgICB2YXIgY2hpbGRJbmplY3RvciA9IHRoaXMucGFyZW50SW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZUNoaWxkKFxuICAgICAgICBbcHJvdmlkZShORzFfU0NPUEUsIHt1c2VWYWx1ZTogdGhpcy5jb21wb25lbnRTY29wZX0pXSk7XG4gICAgdGhpcy5jb250ZW50SW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCduZzEgaW5zZXJ0aW9uIHBvaW50Jyk7XG5cbiAgICB0aGlzLmhvc3RWaWV3UmVmID0gdGhpcy52aWV3TWFuYWdlci5jcmVhdGVSb290SG9zdFZpZXcoXG4gICAgICAgIHRoaXMuaG9zdFZpZXdGYWN0b3J5LCAnIycgKyB0aGlzLmlkLCBjaGlsZEluamVjdG9yLCBbW3RoaXMuY29udGVudEluc2VydGlvblBvaW50XV0pO1xuICAgIHZhciBob3N0RWxlbWVudCA9IHRoaXMudmlld01hbmFnZXIuZ2V0SG9zdEVsZW1lbnQodGhpcy5ob3N0Vmlld1JlZik7XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvciA9IHRoaXMuaG9zdFZpZXdSZWYuY2hhbmdlRGV0ZWN0b3JSZWY7XG4gICAgdGhpcy5jb21wb25lbnQgPSB0aGlzLnZpZXdNYW5hZ2VyLmdldENvbXBvbmVudChob3N0RWxlbWVudCk7XG4gIH1cblxuICBzZXR1cElucHV0cygpOiB2b2lkIHtcbiAgICB2YXIgYXR0cnMgPSB0aGlzLmF0dHJzO1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmluZm8uaW5wdXRzO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaW5wdXQgPSBpbnB1dHNbaV07XG4gICAgICB2YXIgZXhwciA9IG51bGw7XG4gICAgICBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoaW5wdXQuYXR0cikpIHtcbiAgICAgICAgdmFyIG9ic2VydmVGbiA9ICgocHJvcCkgPT4ge1xuICAgICAgICAgIHZhciBwcmV2VmFsdWUgPSBJTklUSUFMX1ZBTFVFO1xuICAgICAgICAgIHJldHVybiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlucHV0Q2hhbmdlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLmlucHV0Q2hhbmdlQ291bnQrKztcbiAgICAgICAgICAgICAgdGhpcy5pbnB1dENoYW5nZXNbcHJvcF0gPVxuICAgICAgICAgICAgICAgICAgbmV3IE5nMUNoYW5nZSh2YWx1ZSwgcHJldlZhbHVlID09PSBJTklUSUFMX1ZBTFVFID8gdmFsdWUgOiBwcmV2VmFsdWUpO1xuICAgICAgICAgICAgICBwcmV2VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkoaW5wdXQucHJvcCk7XG4gICAgICAgIGF0dHJzLiRvYnNlcnZlKGlucHV0LmF0dHIsIG9ic2VydmVGbik7XG4gICAgICB9IGVsc2UgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KGlucHV0LmJpbmRBdHRyKSkge1xuICAgICAgICBleHByID0gYXR0cnNbaW5wdXQuYmluZEF0dHJdO1xuICAgICAgfSBlbHNlIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShpbnB1dC5icmFja2V0QXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW2lucHV0LmJyYWNrZXRBdHRyXTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoaW5wdXQuYmluZG9uQXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW2lucHV0LmJpbmRvbkF0dHJdO1xuICAgICAgfSBlbHNlIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShpbnB1dC5icmFja2V0UGFyZW5BdHRyKSkge1xuICAgICAgICBleHByID0gYXR0cnNbaW5wdXQuYnJhY2tldFBhcmVuQXR0cl07XG4gICAgICB9XG4gICAgICBpZiAoZXhwciAhPSBudWxsKSB7XG4gICAgICAgIHZhciB3YXRjaEZuID0gKChwcm9wKSA9PiAodmFsdWUsIHByZXZWYWx1ZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlucHV0Q2hhbmdlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Q2hhbmdlQ291bnQrKztcbiAgICAgICAgICAgIHRoaXMuaW5wdXRDaGFuZ2VzW3Byb3BdID0gbmV3IE5nMUNoYW5nZShwcmV2VmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5jb21wb25lbnRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfSkoaW5wdXQucHJvcCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50U2NvcGUuJHdhdGNoKGV4cHIsIHdhdGNoRm4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcm90b3R5cGUgPSB0aGlzLmluZm8udHlwZS5wcm90b3R5cGU7XG4gICAgaWYgKHByb3RvdHlwZSAmJiAoPE9uQ2hhbmdlcz5wcm90b3R5cGUpLm5nT25DaGFuZ2VzKSB7XG4gICAgICAvLyBEZXRlY3Q6IE9uQ2hhbmdlcyBpbnRlcmZhY2VcbiAgICAgIHRoaXMuaW5wdXRDaGFuZ2VzID0ge307XG4gICAgICB0aGlzLmNvbXBvbmVudFNjb3BlLiR3YXRjaCgoKSA9PiB0aGlzLmlucHV0Q2hhbmdlQ291bnQsICgpID0+IHtcbiAgICAgICAgdmFyIGlucHV0Q2hhbmdlcyA9IHRoaXMuaW5wdXRDaGFuZ2VzO1xuICAgICAgICB0aGlzLmlucHV0Q2hhbmdlcyA9IHt9O1xuICAgICAgICAoPE9uQ2hhbmdlcz50aGlzLmNvbXBvbmVudCkubmdPbkNoYW5nZXMoaW5wdXRDaGFuZ2VzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmNvbXBvbmVudFNjb3BlLiR3YXRjaCgoKSA9PiB0aGlzLmNoYW5nZURldGVjdG9yICYmIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpKTtcbiAgfVxuXG4gIHByb2plY3RDb250ZW50KCkge1xuICAgIHZhciBjaGlsZE5vZGVzID0gdGhpcy5jaGlsZE5vZGVzO1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLmNvbnRlbnRJbnNlcnRpb25Qb2ludC5wYXJlbnROb2RlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xuICAgICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNoaWxkTm9kZXNbaV0sIHRoaXMuY29udGVudEluc2VydGlvblBvaW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXR1cE91dHB1dHMoKSB7XG4gICAgdmFyIGF0dHJzID0gdGhpcy5hdHRycztcbiAgICB2YXIgb3V0cHV0cyA9IHRoaXMuaW5mby5vdXRwdXRzO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgb3V0cHV0cy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIG91dHB1dCA9IG91dHB1dHNbal07XG4gICAgICB2YXIgZXhwciA9IG51bGw7XG4gICAgICB2YXIgYXNzaWduRXhwciA9IGZhbHNlO1xuXG4gICAgICB2YXIgYmluZG9uQXR0ciA9XG4gICAgICAgICAgb3V0cHV0LmJpbmRvbkF0dHIgPyBvdXRwdXQuYmluZG9uQXR0ci5zdWJzdHJpbmcoMCwgb3V0cHV0LmJpbmRvbkF0dHIubGVuZ3RoIC0gNikgOiBudWxsO1xuICAgICAgdmFyIGJyYWNrZXRQYXJlbkF0dHIgPVxuICAgICAgICAgIG91dHB1dC5icmFja2V0UGFyZW5BdHRyID9cbiAgICAgICAgICAgICAgYFsoJHtvdXRwdXQuYnJhY2tldFBhcmVuQXR0ci5zdWJzdHJpbmcoMiwgb3V0cHV0LmJyYWNrZXRQYXJlbkF0dHIubGVuZ3RoIC0gOCl9KV1gIDpcbiAgICAgICAgICAgICAgbnVsbDtcblxuICAgICAgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KG91dHB1dC5vbkF0dHIpKSB7XG4gICAgICAgIGV4cHIgPSBhdHRyc1tvdXRwdXQub25BdHRyXTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkob3V0cHV0LnBhcmVuQXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW291dHB1dC5wYXJlbkF0dHJdO1xuICAgICAgfSBlbHNlIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShiaW5kb25BdHRyKSkge1xuICAgICAgICBleHByID0gYXR0cnNbYmluZG9uQXR0cl07XG4gICAgICAgIGFzc2lnbkV4cHIgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShicmFja2V0UGFyZW5BdHRyKSkge1xuICAgICAgICBleHByID0gYXR0cnNbYnJhY2tldFBhcmVuQXR0cl07XG4gICAgICAgIGFzc2lnbkV4cHIgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXhwciAhPSBudWxsICYmIGFzc2lnbkV4cHIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgZ2V0dGVyID0gdGhpcy5wYXJzZShleHByKTtcbiAgICAgICAgdmFyIHNldHRlciA9IGdldHRlci5hc3NpZ247XG4gICAgICAgIGlmIChhc3NpZ25FeHByICYmICFzZXR0ZXIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cHJlc3Npb24gJyR7ZXhwcn0nIGlzIG5vdCBhc3NpZ25hYmxlIWApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbWl0dGVyID0gdGhpcy5jb21wb25lbnRbb3V0cHV0LnByb3BdO1xuICAgICAgICBpZiAoZW1pdHRlcikge1xuICAgICAgICAgIGVtaXR0ZXIuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgIG5leHQ6IGFzc2lnbkV4cHIgPyAoKHNldHRlcikgPT4gKHZhbHVlKSA9PiBzZXR0ZXIodGhpcy5zY29wZSwgdmFsdWUpKShzZXR0ZXIpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGdldHRlcikgPT4gKHZhbHVlKSA9PiBnZXR0ZXIodGhpcy5zY29wZSwgeyRldmVudDogdmFsdWV9KSkoZ2V0dGVyKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWlzc2luZyBlbWl0dGVyICcke291dHB1dC5wcm9wfScgb24gY29tcG9uZW50ICcke3RoaXMuaW5mby5zZWxlY3Rvcn0nIWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJDbGVhbnVwKCkge1xuICAgIHRoaXMuZWxlbWVudC5iaW5kKCckZGVzdHJveScsICgpID0+IHRoaXMudmlld01hbmFnZXIuZGVzdHJveVJvb3RIb3N0Vmlldyh0aGlzLmhvc3RWaWV3UmVmKSk7XG4gIH1cbn1cblxuY2xhc3MgTmcxQ2hhbmdlIGltcGxlbWVudHMgU2ltcGxlQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByZXZpb3VzVmFsdWU6IGFueSwgcHVibGljIGN1cnJlbnRWYWx1ZTogYW55KSB7fVxuXG4gIGlzRmlyc3RDaGFuZ2UoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnByZXZpb3VzVmFsdWUgPT09IHRoaXMuY3VycmVudFZhbHVlOyB9XG59XG4iXX0=