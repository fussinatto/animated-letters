/**
 * VERSION: beta 1.542
 * DATE: 2012-10-01
 * JavaScript (ActionScript 3 and 2 also available)
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, easing.EasePack, plugins.CSSPlugin, plugins.RoundPropsPlugin, plugins.BezierPlugin
 *
 * Copyright (c) 2008-2012, GreenSock. All rights reserved. 
 * This work is subject to the terms in http://www.greensock.com/terms_of_use.html or for 
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/ (window._gsQueue || (window._gsQueue = [])).push(function () {
    _gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (e, t, n) {
        var r = function (e, t, r) {
            n.call(this, e, t, r);
            this._cycle = 0;
            this._yoyo = this.vars.yoyo == 1;
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._dirty = !0
        }, i = r.prototype = n.to({}, .1, {}),
            s = [];
        i.constructor = r;
        i.kill()._gc = !1;
        r.killTweensOf = r.killDelayedCallsTo = n.killTweensOf;
        r.getTweensOf = n.getTweensOf;
        r.ticker = n.ticker;
        i.invalidate = function () {
            this._yoyo = this.vars.yoyo == 1;
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._uncache(!0);
            return n.prototype.invalidate.call(this)
        };
        i.updateTo = function (e, t) {
            var r = this.ratio,
                i;
            if (t && this.timeline != null && this._startTime < this._timeline._time) {
                this._startTime = this._timeline._time;
                this._uncache(!1);
                this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay)
            }
            for (i in e) this.vars[i] = e[i];
            if (this._initted) if (t) this._initted = !1;
                else {
                    this._notifyPluginsOfEnabled && this._firstPT && n._onPluginEvent("_onDisable", this);
                    if (this._time / this._duration > .998) {
                        var s = this._time;
                        this.render(0, !0, !1);
                        this._initted = !1;
                        this.render(s, !0, !1)
                    } else if (this._time > 0) {
                        this._initted = !1;
                        this._init();
                        var o = 1 / (1 - r),
                            u = this._firstPT,
                            a;
                        while (u) {
                            a = u.s + u.c;
                            u.c *= o;
                            u.s = a - u.c;
                            u = u._next
                        }
                    }
                }
            return this
        };
        i.render = function (e, t, n) {
            var r = this._dirty ? this.totalDuration() : this._totalDuration,
                i = this._time,
                o = this._totalTime,
                u = this._cycle,
                a, f, l;
            if (e >= r) {
                this._totalTime = r;
                this._cycle = this._repeat;
                if (this._yoyo && (this._cycle & 1) !== 0) {
                    this._time = 0;
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0
                } else {
                    this._time = this._duration;
                    this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1
                } if (!this._reversed) {
                    a = !0;
                    f = "onComplete"
                }
                if (this._duration === 0) {
                    (e === 0 || this._rawPrevTime < 0) && this._rawPrevTime !== e && (n = !0);
                    this._rawPrevTime = e
                }
            } else if (e <= 0) {
                this._totalTime = this._time = this._cycle = 0;
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
                if (o !== 0 || this._duration === 0 && this._rawPrevTime > 0) {
                    f = "onReverseComplete";
                    a = this._reversed
                }
                if (e < 0) {
                    this._active = !1;
                    if (this._duration === 0) {
                        this._rawPrevTime >= 0 && (n = !0);
                        this._rawPrevTime = e
                    }
                } else this._initted || (n = !0)
            } else {
                this._totalTime = this._time = e;
                if (this._repeat !== 0) {
                    var c = this._duration + this._repeatDelay;
                    this._cycle = this._totalTime / c >> 0;
                    this._cycle !== 0 && this._cycle === this._totalTime / c && this._cycle--;
                    this._time = this._totalTime - this._cycle * c;
                    this._yoyo && (this._cycle & 1) !== 0 && (this._time = this._duration - this._time);
                    this._time > this._duration ? this._time = this._duration : this._time < 0 && (this._time = 0)
                }
                if (this._easeType) {
                    var h = this._time / this._duration,
                        p = this._easeType,
                        d = this._easePower;
                    if (p === 1 || p === 3 && h >= .5) h = 1 - h;
                    p === 3 && (h *= 2);
                    d === 1 ? h *= h : d === 2 ? h *= h * h : d === 3 ? h *= h * h * h : d === 4 && (h *= h * h * h * h);
                    p === 1 ? this.ratio = 1 - h : p === 2 ? this.ratio = h : this._time / this._duration < .5 ? this.ratio = h / 2 : this.ratio = 1 - h / 2
                } else this.ratio = this._ease.getRatio(this._time / this._duration)
            } if (i === this._time && !n) return;
            if (!this._initted) {
                this._init();
                !a && this._time && (this.ratio = this._ease.getRatio(this._time / this._duration))
            }
            this._active || this._paused || (this._active = !0);
            o == 0 && this.vars.onStart && (this._totalTime !== 0 || this._duration === 0) && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || s));
            l = this._firstPT;
            while (l) {
                l.f ? l.t[l.p](l.c * this.ratio + l.s) : l.t[l.p] = l.c * this.ratio + l.s;
                l = l._next
            }
            this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s));
            this._cycle != u && (t || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || s));
            if (f && !this._gc) {
                if (a) {
                    this._timeline.autoRemoveChildren && this._enabled(!1, !1);
                    this._active = !1
                }
                t || this.vars[f] && this.vars[f].apply(this.vars[f + "Scope"] || this, this.vars[f + "Params"] || s)
            }
        };
        r.to = function (e, t, n) {
            return new r(e, t, n)
        };
        r.from = function (e, t, n) {
            n.runBackwards = !0;
            n.immediateRender != 0 && (n.immediateRender = !0);
            return new r(e, t, n)
        };
        r.fromTo = function (e, t, n, i) {
            i.startAt = n;
            n.immediateRender && (i.immediateRender = !0);
            return new r(e, t, i)
        };
        r.staggerTo = r.allTo = function (e, t, n, i, s, o, u) {
            i = i || 0;
            var a = [],
                f = e.length,
                l = n.delay || 0,
                c, h, p;
            for (h = 0; h < f; h++) {
                c = {};
                for (p in n) c[p] = n[p];
                c.delay = l;
                h === f - 1 && s && (c.onComplete = function () {
                    n.onComplete && n.onComplete.apply(n.onCompleteScope, n.onCompleteParams);
                    s.apply(u, o)
                });
                a[h] = new r(e[h], t, c);
                l += i
            }
            return a
        };
        r.staggerFrom = r.allFrom = function (e, t, n, i, s, o, u) {
            n.runBackwards = !0;
            n.immediateRender != 0 && (n.immediateRender = !0);
            return r.staggerTo(e, t, n, i, s, o, u)
        };
        r.staggerFromTo = r.allFromTo = function (e, t, n, i, s, o, u, a) {
            i.startAt = n;
            n.immediateRender && (i.immediateRender = !0);
            return r.staggerTo(e, t, i, s, o, u, a)
        };
        r.delayedCall = function (e, t, n, i, s) {
            return new r(t, 0, {
                delay: e,
                onComplete: t,
                onCompleteParams: n,
                onCompleteScope: i,
                onReverseComplete: t,
                onReverseCompleteParams: n,
                onReverseCompleteScope: i,
                immediateRender: !1,
                useFrames: s,
                overwrite: 0
            })
        };
        r.set = function (e, t) {
            return new r(e, 0, t)
        };
        r.isTweening = function (e) {
            var t = n.getTweensOf(e),
                r = t.length,
                i;
            while (--r > -1) if ((i = t[r])._active || i._startTime === i.timeline._time && i.timeline._active) return !0;
            return !1
        };
        var o = function (e, t) {
            var r = [],
                i = 0,
                s = e._first;
            while (s) {
                if (s instanceof n) r[i++] = s;
                else {
                    t && (r[i++] = s);
                    r = r.concat(o(s, t));
                    i = r.length
                }
                s = s._next
            }
            return r
        }, u = r.getAllTweens = function (t) {
                var n = o(e._rootTimeline, t);
                return n.concat(o(e._rootFramesTimeline, t))
            };
        r.killAll = function (e, n, r, i) {
            n == null && (n = !0);
            r == null && (r = !0);
            var s = u(i != 0),
                o = s.length,
                a = n && r && i,
                f, l, c;
            for (c = 0; c < o; c++) {
                l = s[c];
                if (a || l instanceof t || (f = l.target === l.vars.onComplete) && r || n && !f) e ? l.totalTime(l.totalDuration()) : l._enabled(!1, !1)
            }
        };
        r.killChildTweensOf = function (e, t) {
            if (e == null) return;
            if (e.jquery) {
                e.each(function (e, n) {
                    r.killChildTweensOf(n, t)
                });
                return
            }
            var i = n._tweenLookup,
                s = [],
                o, u, a, f, l;
            for (a in i) {
                u = i[a].target.parentNode;
                while (u) {
                    u === e && (s = s.concat(i[a].tweens));
                    u = u.parentNode
                }
            }
            l = s.length;
            for (f = 0; f < l; f++) {
                t && s[f].totalTime(s[f].totalDuration());
                s[f]._enabled(!1, !1)
            }
        };
        r.pauseAll = function (e, t, n) {
            a(!0, e, t, n)
        };
        r.resumeAll = function (e, t, n) {
            a(!1, e, t, n)
        };
        var a = function (e, n, r, i) {
            n == undefined && (n = !0);
            r == undefined && (r = !0);
            var s = u(i),
                o = n && r && i,
                a = s.length,
                f, l;
            while (--a > -1) {
                l = s[a];
                (o || l instanceof t || (f = l.target === l.vars.onComplete) && r || n && !f) && l.paused(e)
            }
        };
        i.progress = function (e) {
            return arguments.length ? this.totalTime(this.duration() * e + this._cycle * this._duration, !1) : this._time / this.duration()
        };
        i.totalProgress = function (e) {
            return arguments.length ? this.totalTime(this.totalDuration() * e, !1) : this._totalTime / this.totalDuration()
        };
        i.time = function (e, t) {
            if (!arguments.length) return this._time;
            this._dirty && this.totalDuration();
            e > this._duration && (e = this._duration);
            this._yoyo && (this._cycle & 1) !== 0 ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : this._repeat != 0 && (e += this._cycle * (this._duration + this._repeatDelay));
            return this.totalTime(e, t)
        };
        i.totalDuration = function (e) {
            if (!arguments.length) {
                if (this._dirty) {
                    this._totalDuration = this._repeat === -1 ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat;
                    this._dirty = !1
                }
                return this._totalDuration
            }
            return this._repeat == -1 ? this : this.duration((e - this._repeat * this._repeatDelay) / (this._repeat + 1))
        };
        i.repeat = function (e) {
            if (!arguments.length) return this._repeat;
            this._repeat = e;
            return this._uncache(!0)
        };
        i.repeatDelay = function (e) {
            if (!arguments.length) return this._repeatDelay;
            this._repeatDelay = e;
            return this._uncache(!0)
        };
        i.yoyo = function (e) {
            if (!arguments.length) return this._yoyo;
            this._yoyo = e;
            return this
        };
        return r
    }, !0);
    _gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function (e, t, n) {
        "use strict";
        var r = function (e) {
            t.call(this, e);
            this._labels = {};
            this.autoRemoveChildren = this.vars.autoRemoveChildren == 1;
            this.smoothChildTiming = this.vars.smoothChildTiming == 1;
            this._sortChildren = !0;
            this._onUpdate = this.vars.onUpdate;
            var n = i.length,
                r, s;
            while (--n > -1) if (s = this.vars[i[n]]) {
                    r = s.length;
                    while (--r > -1) if (s[r] === "{self}") {
                            s = this.vars[i[n]] = s.concat();
                            s[r] = this
                        }
                }
            this.vars.tweens instanceof Array && this.insertMultiple(this.vars.tweens, 0, this.vars.align || "normal", this.vars.stagger || 0)
        }, i = ["onStartParams", "onUpdateParams", "onCompleteParams", "onReverseCompleteParams", "onRepeatParams"],
            s = [],
            o = function (e) {
                var t = {}, n;
                for (n in e) t[n] = e[n];
                return t
            }, u = r.prototype = new t;
        u.constructor = r;
        u.kill()._gc = !1;
        u.to = function (e, t, r, i, s) {
            return this.insert(new n(e, t, r), this._parseTimeOrLabel(s) + (i || 0))
        };
        u.from = function (e, t, r, i, s) {
            return this.insert(n.from(e, t, r), this._parseTimeOrLabel(s) + (i || 0))
        };
        u.fromTo = function (e, t, r, i, s, o) {
            return this.insert(n.fromTo(e, t, r, i), this._parseTimeOrLabel(o) + (s || 0))
        };
        u.staggerTo = function (e, t, i, s, u, a, f, l, c) {
            var h = new r({
                onComplete: f,
                onCompleteParams: l,
                onCompleteScope: c
            });
            s = s || 0;
            for (var p = 0; p < e.length; p++) {
                i.startAt != null && (i.startAt = o(i.startAt));
                h.insert(new n(e[p], t, o(i)), p * s)
            }
            return this.insert(h, this._parseTimeOrLabel(a) + (u || 0))
        };
        u.staggerFrom = function (e, t, n, r, i, s, o, u, a) {
            n.immediateRender == null && (n.immediateRender = !0);
            n.runBackwards = !0;
            return this.staggerTo(e, t, n, r, i, s, o, u, a)
        };
        u.staggerFromTo = function (e, t, n, r, i, s, o, u, a, f) {
            r.startAt = n;
            n.immediateRender && (r.immediateRender = !0);
            return this.staggerTo(e, t, r, i, s, o, u, a, f)
        };
        u.call = function (e, t, r, i, s) {
            return this.insert(n.delayedCall(0, e, t, r), this._parseTimeOrLabel(s) + (i || 0))
        };
        u.set = function (e, t, r, i) {
            t.immediateRender = !1;
            return this.insert(new n(e, 0, t), this._parseTimeOrLabel(i) + (r || 0))
        };
        r.exportRoot = function (e, t) {
            e = e || {};
            e.smoothChildTiming == null && (e.smoothChildTiming = !0);
            var i = new r(e),
                s = i._timeline;
            t == null && (t = !0);
            s._remove(i, !0);
            i._startTime = 0;
            i._rawPrevTime = i._time = i._totalTime = s._time;
            var o = s._first,
                u;
            while (o) {
                u = o._next;
                (!t || !(o instanceof n && o.target == o.vars.onComplete)) && i.insert(o, o._startTime - o._delay);
                o = u
            }
            s.insert(i, 0);
            return i
        };
        u.insert = function (r, i) {
            if (!(r instanceof e)) {
                if (r instanceof Array) return this.insertMultiple(r, i);
                if (typeof r == "string") return this.addLabel(r, this._parseTimeOrLabel(i || 0, !0));
                if (typeof r != "function") throw "ERROR: Cannot insert() " + r + " into the TimelineLite/Max because it is neither a tween, timeline, function, nor a String.";
                r = n.delayedCall(0, r)
            }
            t.prototype.insert.call(this, r, this._parseTimeOrLabel(i || 0, !0));
            if (this._gc && !this._paused && this._time === this._duration && this._time < this.duration()) {
                var s = this;
                while (s._gc && s._timeline) {
                    s._timeline.smoothChildTiming ? s.totalTime(s._totalTime, !0) : s._enabled(!0, !1);
                    s = s._timeline
                }
            }
            return this
        };
        u.remove = function (t) {
            if (t instanceof e) return this._remove(t, !1);
            if (t instanceof Array) {
                var n = t.length;
                while (--n > -1) this.remove(t[n]);
                return this
            }
            return typeof t == "string" ? this.removeLabel(t) : this.kill(null, t)
        };
        u.append = function (e, t) {
            return this.insert(e, this.duration() + (t || 0))
        };
        u.insertMultiple = function (e, t, n, i) {
            n = n || "normal";
            i = i || 0;
            var s, o, u = this._parseTimeOrLabel(t || 0, !0),
                a = e.length;
            for (s = 0; s < a; s++) {
                (o = e[s]) instanceof Array && (o = new r({
                    tweens: o
                }));
                this.insert(o, u);
                typeof o != "string" && typeof o != "function" && (n === "sequence" ? u = o._startTime + o.totalDuration() / o._timeScale : n === "start" && (o._startTime -= o.delay()));
                u += i
            }
            return this._uncache(!0)
        };
        u.appendMultiple = function (e, t, n, r) {
            return this.insertMultiple(e, this.duration() + (t || 0), n, r)
        };
        u.addLabel = function (e, t) {
            this._labels[e] = t;
            return this
        };
        u.removeLabel = function (e) {
            delete this._labels[e];
            return this
        };
        u.getLabelTime = function (e) {
            return this._labels[e] != null ? this._labels[e] : -1
        };
        u._parseTimeOrLabel = function (e, t) {
            return e == null ? this.duration() : typeof e == "string" && isNaN(e) ? this._labels[e] == null ? t ? this._labels[e] = this.duration() : 0 : this._labels[e] : Number(e)
        };
        u.seek = function (e, t) {
            return this.totalTime(this._parseTimeOrLabel(e, !1), t != 0)
        };
        u.stop = function () {
            return this.paused(!0)
        };
        u.gotoAndPlay = function (e, n) {
            return t.prototype.play.call(this, e, n)
        };
        u.gotoAndStop = function (e, t) {
            return this.pause(e, t)
        };
        u.render = function (e, t, n) {
            this._gc && this._enabled(!0, !1);
            this._active = !this._paused;
            var r = this._dirty ? this.totalDuration() : this._totalDuration,
                i = this._time,
                o = this._startTime,
                u = this._timeScale,
                a = this._paused,
                f, l, c, h;
            if (e >= r) {
                this._totalTime = this._time = r;
                if (!this._reversed && !this._hasPausedChild()) {
                    l = !0;
                    h = "onComplete";
                    this._duration === 0 && (e === 0 || this._rawPrevTime < 0) && this._rawPrevTime !== e && (n = !0)
                }
                this._rawPrevTime = e;
                e = r + 1e-6
            } else if (e <= 0) {
                this._totalTime = this._time = 0;
                if (i !== 0 || this._duration === 0 && this._rawPrevTime > 0) {
                    h = "onReverseComplete";
                    l = this._reversed
                }
                if (e < 0) {
                    this._active = !1;
                    this._duration === 0 && this._rawPrevTime >= 0 && (n = !0)
                } else this._initted || (n = !0);
                this._rawPrevTime = e;
                e = -0.000001
            } else this._totalTime = this._time = this._rawPrevTime = e; if (this._time === i && !n) return;
            this._initted || (this._initted = !0);
            i === 0 && this.vars.onStart && this._time !== 0 && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || s));
            if (this._time > i) {
                f = this._first;
                while (f) {
                    c = f._next;
                    if (this._paused && !a) break;
                    if (f._active || f._startTime <= this._time && !f._paused && !f._gc) f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (e - f._startTime) * f._timeScale, t, !1) : f.render((e - f._startTime) * f._timeScale, t, !1);
                    f = c
                }
            } else {
                f = this._last;
                while (f) {
                    c = f._prev;
                    if (this._paused && !a) break;
                    if (f._active || f._startTime <= i && !f._paused && !f._gc) f._reversed ? f.render((f._dirty ? f.totalDuration() : f._totalDuration) - (e - f._startTime) * f._timeScale, t, !1) : f.render((e - f._startTime) * f._timeScale, t, !1);
                    f = c
                }
            }
            this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || s));
            if (h && !this._gc) if (o === this._startTime || u != this._timeScale) if (this._time === 0 || r >= this.totalDuration()) {
                        if (l) {
                            this._timeline.autoRemoveChildren && this._enabled(!1, !1);
                            this._active = !1
                        }
                        t || this.vars[h] && this.vars[h].apply(this.vars[h + "Scope"] || this, this.vars[h + "Params"] || s)
                    }
        };
        u._hasPausedChild = function () {
            var e = this._first;
            while (e) {
                if (e._paused || e instanceof r && e._hasPausedChild()) return !0;
                e = e._next
            }
            return !1
        };
        u.getChildren = function (e, t, r, i) {
            i = i || -9999999999;
            var s = [],
                o = this._first,
                u = 0;
            while (o) {
                if (!(o._startTime < i)) if (o instanceof n) t != 0 && (s[u++] = o);
                    else {
                        r != 0 && (s[u++] = o);
                        if (e != 0) {
                            s = s.concat(o.getChildren(!0, t, r));
                            u = s.length
                        }
                    }
                o = o._next
            }
            return s
        };
        u.getTweensOf = function (e, t) {
            var r = n.getTweensOf(e),
                i = r.length,
                s = [],
                o = 0;
            while (--i > -1) if (r[i].timeline === this || t && this._contains(r[i])) s[o++] = r[i];
            return s
        };
        u._contains = function (e) {
            var t = e.timeline;
            while (t) {
                if (t === this) return !0;
                t = t.timeline
            }
            return !1
        };
        u.shiftChildren = function (e, t, n) {
            n = n || 0;
            var r = this._first;
            while (r) {
                r._startTime >= n && (r._startTime += e);
                r = r._next
            }
            if (t) for (var i in this._labels) this._labels[i] >= n && (this._labels[i] += e);
            return this._uncache(!0)
        };
        u._kill = function (e, t) {
            if (e == null && t == null) return this._enabled(!1, !1);
            var n = t == null ? this.getChildren(!0, !0, !1) : this.getTweensOf(t),
                r = n.length,
                i = !1;
            while (--r > -1) n[r]._kill(e, t) && (i = !0);
            return i
        };
        u.clear = function (e) {
            var t = this.getChildren(!1, !0, !0),
                n = t.length;
            this._time = this._totalTime = 0;
            while (--n > -1) t[n]._enabled(!1, !1);
            e != 0 && (this._labels = {});
            return this._uncache(!0)
        };
        u.invalidate = function () {
            var e = this._first;
            while (e) {
                e.invalidate();
                e = e._next
            }
            return this
        };
        u._enabled = function (e, n) {
            if (e == this._gc) {
                var r = this._first;
                while (r) {
                    r._enabled(e, !0);
                    r = r._next
                }
            }
            return t.prototype._enabled.call(this, e, n)
        };
        u.progress = function (e) {
            return arguments.length ? this.totalTime(this.duration() * e, !1) : this._time / this.duration()
        };
        u.duration = function (e) {
            if (!arguments.length) {
                this._dirty && this.totalDuration();
                return this._duration
            }
            this.duration() !== 0 && e !== 0 && this.timeScale(this._duration / e);
            return this
        };
        u.totalDuration = function (e) {
            if (!arguments.length) {
                if (this._dirty) {
                    var t = 0,
                        n = this._first,
                        r = -999999999999,
                        i, s;
                    while (n) {
                        i = n._next;
                        n._startTime < r && this._sortChildren ? this.insert(n, n._startTime - n._delay) : r = n._startTime;
                        if (n._startTime < 0) {
                            t -= n._startTime;
                            this.shiftChildren(-n._startTime, !1, -9999999999)
                        }
                        s = n._startTime + (n._dirty ? n.totalDuration() : n._totalDuration) / n._timeScale;
                        s > t && (t = s);
                        n = i
                    }
                    this._duration = this._totalDuration = t;
                    this._dirty = !1
                }
                return this._totalDuration
            }
            this.totalDuration() !== 0 && e !== 0 && this.timeScale(this._totalDuration / e);
            return this
        };
        u.usesFrames = function () {
            var t = this._timeline;
            while (t._timeline) t = t._timeline;
            return t === e._rootFramesTimeline
        };
        u.rawTime = function () {
            return this._paused || this._totalTime !== 0 && this._totalTime !== this._totalDuration ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
        };
        return r
    }, !0);
    _gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function (e, t, n) {
        var r = function (t) {
            e.call(this, t);
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._cycle = 0;
            this._yoyo = this.vars.yoyo == 1;
            this._dirty = !0
        }, i = [],
            s = new n(null, null, 1, 0),
            o = function (e) {
                while (e) {
                    if (e._paused) return !0;
                    e = e._timeline
                }
                return !1
            }, u = r.prototype = new e;
        u.constructor = r;
        u.kill()._gc = !1;
        r.version = 12;
        u.invalidate = function () {
            this._yoyo = this.vars.yoyo == 1;
            this._repeat = this.vars.repeat || 0;
            this._repeatDelay = this.vars.repeatDelay || 0;
            this._uncache(!0);
            return e.prototype.invalidate.call(this)
        };
        u.addCallback = function (e, n, r, i) {
            return this.insert(t.delayedCall(0, e, r, i), n)
        };
        u.removeCallback = function (e, t) {
            if (t == null) this._kill(null, e);
            else {
                var n = this.getTweensOf(e, !1),
                    r = n.length,
                    i = this._parseTimeOrLabel(t, !1);
                while (--r > -1) n[r]._startTime === i && n[r]._enabled(!1, !1)
            }
            return this
        };
        u.tweenTo = function (e, n) {
            n = n || {};
            var r = {
                ease: s,
                overwrite: 2,
                useFrames: this.usesFrames(),
                immediateRender: !1
            }, o, u;
            for (o in n) r[o] = n[o];
            r.time = this._parseTimeOrLabel(e, !1);
            u = new t(this, Math.abs(Number(r.time) - this._time) / this._timeScale || .001, r);
            r.onStart = function () {
                u.target.paused(!0);
                u.vars.time != u.target.time() && u.duration(Math.abs(u.vars.time - u.target.time()) / u.target._timeScale);
                n.onStart && n.onStart.apply(n.onStartScope || u, n.onStartParams || i)
            };
            return u
        };
        u.tweenFromTo = function (e, t, n) {
            n = n || {};
            n.startAt = {
                time: this._parseTimeOrLabel(e, !1)
            };
            var r = this.tweenTo(t, n);
            return r.duration(Math.abs(r.vars.time - r.vars.startAt.time) / this._timeScale || .001)
        };
        u.render = function (e, t, n) {
            this._gc && this._enabled(!0, !1);
            this._active = !this._paused;
            var r = this._dirty ? this.totalDuration() : this._totalDuration,
                s = this._time,
                o = this._totalTime,
                u = this._startTime,
                a = this._timeScale,
                f = this._rawPrevTime,
                l = this._paused,
                c = this._cycle,
                h, p, d, v, m;
            if (e >= r) {
                if (!this._locked) {
                    this._totalTime = r;
                    this._cycle = this._repeat
                }
                if (!this._reversed && !this._hasPausedChild()) {
                    p = !0;
                    m = "onComplete";
                    this._duration === 0 && (e === 0 || this._rawPrevTime < 0) && this._rawPrevTime !== e && (n = !0)
                }
                this._rawPrevTime = e;
                if (this._yoyo && (this._cycle & 1) !== 0) {
                    this._time = 0;
                    e = -0.000001
                } else {
                    this._time = this._duration;
                    e = this._duration + 1e-6
                }
            } else if (e <= 0) {
                this._locked || (this._totalTime = this._cycle = 0);
                this._time = 0;
                if (s !== 0 || this._duration === 0 && this._rawPrevTime > 0) {
                    m = "onReverseComplete";
                    p = this._reversed
                }
                if (e < 0) {
                    this._active = !1;
                    this._duration === 0 && this._rawPrevTime >= 0 && (n = !0)
                } else this._initted || (n = !0);
                this._rawPrevTime = e;
                e = -0.000001
            } else {
                this._time = this._rawPrevTime = e;
                if (!this._locked) {
                    this._totalTime = e;
                    if (this._repeat !== 0) {
                        var g = this._duration + this._repeatDelay;
                        this._cycle = this._totalTime / g >> 0;
                        this._cycle !== 0 && this._cycle === this._totalTime / g && this._cycle--;
                        this._time = this._totalTime - this._cycle * g;
                        this._yoyo && (this._cycle & 1) != 0 && (this._time = this._duration - this._time);
                        if (this._time > this._duration) {
                            this._time = this._duration;
                            e = this._duration + 1e-6
                        } else if (this._time < 0) {
                            this._time = 0;
                            e = -0.000001
                        } else e = this._time
                    }
                }
            } if (this._cycle !== c && !this._locked) {
                var y = this._yoyo && (c & 1) !== 0,
                    b = y === (this._yoyo && (this._cycle & 1) !== 0),
                    w = this._totalTime,
                    E = this._cycle,
                    S = this._rawPrevTime,
                    x = this._time;
                this._totalTime = c * this._duration;
                this._cycle < c ? y = !y : this._totalTime += this._duration;
                this._time = s;
                this._rawPrevTime = f;
                this._cycle = c;
                this._locked = !0;
                s = y ? 0 : this._duration;
                this.render(s, t, !1);
                t || this._gc || this.vars.onRepeat && this.vars.onRepeat.apply(this.vars.onRepeatScope || this, this.vars.onRepeatParams || i);
                if (b) {
                    s = y ? this._duration + 1e-6 : -0.000001;
                    this.render(s, !0, !1)
                }
                this._time = x;
                this._totalTime = w;
                this._cycle = E;
                this._rawPrevTime = S;
                this._locked = !1
            }
            if (this._time === s && !n) return;
            this._initted || (this._initted = !0);
            o === 0 && this.vars.onStart && this._totalTime !== 0 && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || i));
            if (this._time > s) {
                h = this._first;
                while (h) {
                    d = h._next;
                    if (this._paused && !l) break;
                    if (h._active || h._startTime <= this._time && !h._paused && !h._gc) h._reversed ? h.render((h._dirty ? h.totalDuration() : h._totalDuration) - (e - h._startTime) * h._timeScale, t, !1) : h.render((e - h._startTime) * h._timeScale, t, !1);
                    h = d
                }
            } else {
                h = this._last;
                while (h) {
                    d = h._prev;
                    if (this._paused && !l) break;
                    if (h._active || h._startTime <= s && !h._paused && !h._gc) h._reversed ? h.render((h._dirty ? h.totalDuration() : h._totalDuration) - (e - h._startTime) * h._timeScale, t, !1) : h.render((e - h._startTime) * h._timeScale, t, !1);
                    h = d
                }
            }
            this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || i));
            if (m && !this._locked && !this._gc) if (u === this._startTime || a != this._timeScale) if (this._time === 0 || r >= this.totalDuration()) {
                        if (p) {
                            this._timeline.autoRemoveChildren && this._enabled(!1, !1);
                            this._active = !1
                        }
                        t || this.vars[m] && this.vars[m].apply(this.vars[m + "Scope"] || this, this.vars[m + "Params"] || i)
                    }
        };
        u.getActive = function (e, t, n) {
            e == null && (e = !0);
            t == null && (t = !0);
            n == null && (n = !1);
            var r = [],
                i = this.getChildren(e, t, n),
                s = 0,
                u = i.length,
                a, f;
            for (a = 0; a < u; a++) {
                f = i[a];
                f._paused || f._timeline._time >= f._startTime && f._timeline._time < f._startTime + f._totalDuration / f._timeScale && (o(f._timeline) || (r[s++] = f))
            }
            return r
        };
        u.getLabelAfter = function (e) {
            e || e !== 0 && (e = this._time);
            var t = this.getLabelsArray(),
                n = t.length,
                r;
            for (r = 0; r < n; r++) if (t[r].time > e) return t[r].name;
            return null
        };
        u.getLabelBefore = function (e) {
            e == null && (e = this._time);
            var t = this.getLabelsArray(),
                n = t.length;
            while (--n > -1) if (t[n].time < e) return t[n].name;
            return null
        };
        u.getLabelsArray = function () {
            var e = [],
                t = 0,
                n;
            for (n in this._labels) e[t++] = {
                    time: this._labels[n],
                    name: n
            };
            e.sort(function (e, t) {
                return e.time - t.time
            });
            return e
        };
        u.progress = function (e) {
            return arguments.length ? this.totalTime(this.duration() * e + this._cycle * this._duration, !1) : this._time / this.duration()
        };
        u.totalProgress = function (e) {
            return arguments.length ? this.totalTime(this.totalDuration() * e, !1) : this._totalTime / this.totalDuration()
        };
        u.totalDuration = function (t) {
            if (!arguments.length) {
                if (this._dirty) {
                    e.prototype.totalDuration.call(this);
                    this._totalDuration = this._repeat === -1 ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat
                }
                return this._totalDuration
            }
            return this._repeat == -1 ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1))
        };
        u.time = function (e, t) {
            if (!arguments.length) return this._time;
            this._dirty && this.totalDuration();
            e > this._duration && (e = this._duration);
            this._yoyo && (this._cycle & 1) !== 0 ? e = this._duration - e + this._cycle * (this._duration + this._repeatDelay) : this._repeat != 0 && (e += this._cycle * (this._duration + this._repeatDelay));
            return this.totalTime(e, t)
        };
        u.repeat = function (e) {
            if (!arguments.length) return this._repeat;
            this._repeat = e;
            return this._uncache(!0)
        };
        u.repeatDelay = function (e) {
            if (!arguments.length) return this._repeatDelay;
            this._repeatDelay = e;
            return this._uncache(!0)
        };
        u.yoyo = function (e) {
            if (!arguments.length) return this._yoyo;
            this._yoyo = e;
            return this
        };
        u.currentLabel = function (e) {
            return arguments.length ? this.seek(e, !0) : this.getLabelBefore(this._time + 1e-8)
        };
        return r
    }, !0);
    _gsDefine("plugins.BezierPlugin", ["plugins.TweenPlugin"], function (e) {
        var t = function (t, n) {
            e.call(this, "bezier", -1);
            this._overwriteProps.pop();
            this._func = {};
            this._round = {}
        }, n = t.prototype = new e("bezier", 1),
            i = 180 / Math.PI,
            s = [],
            o = [],
            u = [],
            f = {}, c = function (t, n, r, i) {
                this.a = t;
                this.b = n;
                this.c = r;
                this.d = i;
                this.da = i - t;
                this.ca = r - t;
                this.ba = n - t
            }, h = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
            p = t.bezierThrough = function (e, t, n, i, c, p) {
                var d = {}, g = [],
                    y, b;
                c = typeof c == "string" ? "," + c + "," : h;
                t == null && (t = 1);
                for (b in e[0]) g.push(b);
                s.length = o.length = u.length = 0;
                y = g.length;
                while (--y > -1) {
                    b = g[y];
                    f[b] = c.indexOf("," + b + ",") !== -1;
                    d[b] = v(e, b, f[b], p)
                }
                y = s.length;
                while (--y > -1) {
                    s[y] = Math.sqrt(s[y]);
                    o[y] = Math.sqrt(o[y])
                }
                if (!i) {
                    y = g.length;
                    while (--y > -1) if (f[b]) {
                            a = d[g[y]];
                            l = a.length - 1;
                            for (j = 0; j < l; j++) {
                                r = a[j + 1].da / o[j] + a[j].da / s[j];
                                u[j] = (u[j] || 0) + r * r
                            }
                        }
                    y = u.length;
                    while (--y > -1) u[y] = Math.sqrt(u[y])
                }
                y = g.length;
                while (--y > -1) {
                    b = g[y];
                    m(d[b], t, n, i, f[b])
                }
                return d
            }, d = function (e, t, n) {
                t = t || "soft";
                var r = {}, i = t === "cubic" ? 3 : 2,
                    s = t === "soft",
                    o = [],
                    u, a, f, l, h, p, d, v, m, g, y;
                s && n && (e = [n].concat(e));
                if (e == null || e.length < i + 1) throw "invalid Bezier data";
                for (m in e[0]) o.push(m);
                p = o.length;
                while (--p > -1) {
                    m = o[p];
                    r[m] = h = [];
                    g = 0;
                    v = e.length;
                    for (d = 0; d < v; d++) {
                        u = n == null ? e[d][m] : typeof (y = e[d][m]) == "string" && y.charAt(1) === "=" ? n[m] + Number(y.charAt(0) + y.substr(2)) : Number(y);
                        s && d > 1 && d < v - 1 && (h[g++] = (u + h[g - 2]) / 2);
                        h[g++] = u
                    }
                    v = g - i + 1;
                    g = 0;
                    for (d = 0; d < v; d += i) {
                        u = h[d];
                        a = h[d + 1];
                        f = h[d + 2];
                        l = i === 2 ? 0 : h[d + 3];
                        h[g++] = y = i === 3 ? new c(u, a, f, l) : new c(u, (2 * a + u) / 3, (2 * a + f) / 3, f)
                    }
                    h.length = g
                }
                return r
            }, v = function (e, t, n, r) {
                var i = [],
                    u, a, f, l, h, p, d, v;
                if (r) {
                    e = [r].concat(e);
                    a = e.length;
                    while (--a > -1) typeof (v = e[a][t]) == "string" && v.charAt(1) === "=" && (e[a][t] = r[t] + Number(v.charAt(0) + v.substr(2)))
                }
                u = e.length - 2;
                if (u < 0) {
                    i[0] = new c(e[0][t], 0, 0, e[u < -1 ? 0 : 1][t]);
                    return i
                }
                for (a = 0; a < u; a++) {
                    l = e[a][t];
                    h = e[a + 1][t];
                    i[a] = new c(l, 0, 0, h);
                    if (n) {
                        p = e[a + 2][t];
                        s[a] = (s[a] || 0) + (h - l) * (h - l);
                        o[a] = (o[a] || 0) + (p - h) * (p - h)
                    }
                }
                i[a] = new c(e[a][t], 0, 0, e[a + 1][t]);
                return i
            }, m = function (e, t, n, r, i) {
                var a = e.length - 1,
                    f = 0,
                    l = e[0].a,
                    c, h, p, d, v, m, y, b, w, E, S, x, T;
                for (c = 0; c < a; c++) {
                    v = e[f];
                    h = v.a;
                    p = v.d;
                    d = e[f + 1].d;
                    if (i) {
                        S = s[c];
                        x = o[c];
                        T = (x + S) * t * .25 / (r ? .5 : u[c] || .5);
                        m = p - (p - h) * (r ? t * .5 : T / S);
                        y = p + (d - p) * (r ? t * .5 : T / x);
                        b = p - (m + (y - m) * (S * 3 / (S + x) + .5) / 4)
                    } else {
                        m = p - (p - h) * t * .5;
                        y = p + (d - p) * t * .5;
                        b = p - (m + y) / 2
                    }
                    m += b;
                    y += b;
                    v.c = w = m;
                    c != 0 ? v.b = l : v.b = l = v.a + (v.c - v.a) * .6;
                    v.da = p - h;
                    v.ca = w - h;
                    v.ba = l - h;
                    if (n) {
                        E = g(h, l, w, p);
                        e.splice(f, 1, E[0], E[1], E[2], E[3]);
                        f += 4
                    } else f++;
                    l = y
                }
                v = e[f];
                v.b = l;
                v.c = l + (v.d - l) * .4;
                v.da = v.d - v.a;
                v.ca = v.c - v.a;
                v.ba = l - v.a;
                if (n) {
                    E = g(v.a, l, v.c, v.d);
                    e.splice(f, 1, E[0], E[1], E[2], E[3])
                }
            }, g = t.cubicToQuadratic = function (e, t, n, r) {
                var i = {
                    a: e
                }, s = {}, o = {}, u = {
                        c: r
                    }, a = (e + t) / 2,
                    f = (t + n) / 2,
                    l = (n + r) / 2,
                    c = (a + f) / 2,
                    h = (f + l) / 2,
                    p = (h - c) / 8;
                i.b = a + (e - a) / 4;
                s.b = c + p;
                i.c = s.a = (i.b + s.b) / 2;
                s.c = o.a = (c + h) / 2;
                o.b = h - p;
                u.b = l + (r - l) / 4;
                o.c = u.a = (o.b + u.b) / 2;
                return [i, s, o, u]
            }, y = t.quadraticToCubic = function (e, t, n) {
                return new c(e, (2 * t + e) / 3, (2 * t + n) / 3, n)
            }, b = function (e, t) {
                t = t >> 0 || 6;
                var n = [],
                    r = [],
                    i = 0,
                    s = 0,
                    o = t - 1,
                    u = [],
                    a = [],
                    f, l, c, h;
                for (f in e) w(e[f], n, t);
                c = n.length;
                for (l = 0; l < c; l++) {
                    i += Math.sqrt(n[l]);
                    h = l % t;
                    a[h] = i;
                    if (h === o) {
                        s += i;
                        h = l / t >> 0;
                        u[h] = a;
                        r[h] = s;
                        i = 0;
                        a = []
                    }
                }
                return {
                    length: s,
                    lengths: r,
                    segments: u
                }
            }, w = function (e, t, n) {
                var r = 1 / n,
                    i = e.length,
                    s, o, u, a, f, l, c, h, p, d, v;
                while (--i > -1) {
                    d = e[i];
                    u = d.a;
                    a = d.d - u;
                    f = d.c - u;
                    l = d.b - u;
                    s = o = 0;
                    for (h = 1; h <= n; h++) {
                        c = r * h;
                        p = 1 - c;
                        s = o - (o = (c * c * a + 3 * p * (c * f + p * l)) * c);
                        v = i * n + h - 1;
                        t[v] = (t[v] || 0) + s * s
                    }
                }
            };
        n.constructor = t;
        t.API = 2;
        n._onInitTween = function (e, t, n) {
            this._target = e;
            t instanceof Array && (t = {
                values: t
            });
            this._props = [];
            this._timeRes = t.timeResolution == null ? 6 : parseInt(t.timeResolution);
            var r = t.values || [],
                i = {}, s = r[0],
                o = t.autoRotate || n.vars.orientToBezier,
                u, a, f, l, c;
            this._autoRotate = o ? o instanceof Array ? o : [
                ["x", "y", "rotation", o === !0 ? 0 : Number(o) || 0]
            ] : null;
            for (u in s) this._props.push(u);
            f = this._props.length;
            while (--f > -1) {
                u = this._props[f];
                this._overwriteProps.push(u);
                a = this._func[u] = typeof e[u] == "function";
                i[u] = a ? e[u.indexOf("set") || typeof e["get" + u.substr(3)] != "function" ? u : "get" + u.substr(3)]() : parseFloat(e[u]);
                c || i[u] !== r[0][u] && (c = i)
            }
            this._beziers = t.type !== "cubic" && t.type !== "quadratic" && t.type !== "soft" ? p(r, isNaN(t.curviness) ? 1 : t.curviness, !1, t.type === "thruBasic", t.correlate, c) : d(r, t.type, i);
            this._segCount = this._beziers[u].length;
            if (this._timeRes) {
                var h = b(this._beziers, this._timeRes);
                this._length = h.length;
                this._lengths = h.lengths;
                this._segments = h.segments;
                this._l1 = this._li = this._s1 = this._si = 0;
                this._l2 = this._lengths[0];
                this._curSeg = this._segments[0];
                this._s2 = this._curSeg[0];
                this._prec = 1 / this._curSeg.length
            }
            if (o = this._autoRotate) {
                o[0] instanceof Array || (this._autoRotate = o = [o]);
                f = o.length;
                while (--f > -1) for (l = 0; l < 3; l++) {
                        u = o[f][l];
                        this._func[u] = typeof e[u] == "function" ? e[u.indexOf("set") || typeof e["get" + u.substr(3)] != "function" ? u : "get" + u.substr(3)] : !1
                }
            }
            return !0
        };
        n.setRatio = function (e) {
            var t = this._segCount,
                n = this._func,
                r = this._target,
                s, o, u, a, f, l, c, h, p, d;
            if (!this._timeRes) {
                s = e < 0 ? 0 : e >= 1 ? t - 1 : t * e >> 0;
                l = (e - s * (1 / t)) * t
            } else {
                p = this._lengths;
                d = this._curSeg;
                e *= this._length;
                u = this._li;
                if (e > this._l2 && u < t - 1) {
                    h = t - 1;
                    while (u < h && (this._l2 = p[++u]) <= e);
                    this._l1 = p[u - 1];
                    this._li = u;
                    this._curSeg = d = this._segments[u];
                    this._s2 = d[this._s1 = this._si = 0]
                } else if (e < this._l1 && u > 0) {
                    while (u > 0 && (this._l1 = p[--u]) >= e);
                    u === 0 && e < this._l1 ? this._l1 = 0 : u++;
                    this._l2 = p[u];
                    this._li = u;
                    this._curSeg = d = this._segments[u];
                    this._s1 = d[(this._si = d.length - 1) - 1] || 0;
                    this._s2 = d[this._si]
                }
                s = u;
                e -= this._l1;
                u = this._si;
                if (e > this._s2 && u < d.length - 1) {
                    h = d.length - 1;
                    while (u < h && (this._s2 = d[++u]) <= e);
                    this._s1 = d[u - 1];
                    this._si = u
                } else if (e < this._s1 && u > 0) {
                    while (u > 0 && (this._s1 = d[--u]) >= e);
                    u === 0 && e < this._s1 ? this._s1 = 0 : u++;
                    this._s2 = d[u];
                    this._si = u
                }
                l = (u + (e - this._s1) / (this._s2 - this._s1)) * this._prec
            }
            o = 1 - l;
            u = this._props.length;
            while (--u > -1) {
                a = this._props[u];
                f = this._beziers[a][s];
                c = (l * l * f.da + 3 * o * (l * f.ca + o * f.ba)) * l + f.a;
                this._round[a] && (c = c + (c > 0 ? .5 : -0.5) >> 0);
                n[a] ? r[a](c) : r[a] = c
            }
            if (this._autoRotate) {
                var v = this._autoRotate,
                    m, g, y, b, w, E, S;
                u = v.length;
                while (--u > -1) {
                    a = v[u][2];
                    E = v[u][3] || 0;
                    S = v[u][4] == 1 ? 1 : i;
                    f = this._beziers[v[u][0]][s];
                    m = this._beziers[v[u][1]][s];
                    g = f.a + (f.b - f.a) * l;
                    b = f.b + (f.c - f.b) * l;
                    g += (b - g) * l;
                    b += (f.c + (f.d - f.c) * l - b) * l;
                    y = m.a + (m.b - m.a) * l;
                    w = m.b + (m.c - m.b) * l;
                    y += (w - y) * l;
                    w += (m.c + (m.d - m.c) * l - w) * l;
                    c = Math.atan2(w - y, b - g) * S + E;
                    n[a] ? n[a].call(r, c) : r[a] = c
                }
            }
        };
        n._roundProps = function (e, t) {
            var n = this._overwriteProps,
                r = n.length;
            while (--r > -1) if (e[n[r]] || e.bezier || e.bezierThrough) this._round[n[r]] = t
        };
        n._kill = function (t) {
            var n = this._props,
                r, i;
            for (r in _beziers) if (r in t) {
                    delete this._beziers[r];
                    delete this._func[r];
                    i = n.length;
                    while (--i > -1) n[i] === r && n.splice(i, 1)
                }
            return e.prototype._kill.call(this, t)
        };
        e.activate([t]);
        return t
    }, !0);
    _gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function (e, t) {
        "use strict";
        var n = function () {
            e.call(this, "css");
            this._overwriteProps.pop()
        }, r = n.prototype = new e("css");
        r.constructor = n;
        n.API = 2;
        n.suffixMap = {
            top: "px",
            right: "px",
            bottom: "px",
            left: "px",
            width: "px",
            height: "px",
            fontSize: "px",
            padding: "px",
            margin: "px"
        };
        var i = /[^\d\-\.]/g,
            s = /(\d|\-|\+|=|#|\.)*/g,
            o = /(\d|\.)+/g,
            u = /opacity *= *([^)]*)/,
            a = /opacity:([^;]*)/,
            f = /([A-Z])/g,
            l = /-([a-z])/gi,
            c = function (e, t) {
                return t.toUpperCase()
            }, h = /(Left|Right|Width)/i,
            p = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
            d = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
            v = Math.PI / 180,
            m = 180 / Math.PI,
            g = {}, y = document,
            b = y.createElement("div"),
            w = navigator.userAgent,
            E, S, x, T, N = function () {
                var e = w.indexOf("Android"),
                    t = y.createElement("div"),
                    n;
                x = w.indexOf("Safari") !== -1 && w.indexOf("Chrome") === -1 && (e === -1 || Number(w.substr(e + 8, 1)) > 3);
                /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(w);
                T = parseFloat(RegExp.$1);
                t.innerHTML = "<a style='top:1px;opacity:.55;'>a</a>";
                n = t.getElementsByTagName("a")[0];
                return n ? /^0.55/.test(n.style.opacity) : !1
            }(),
            C = function (e) {
                if (!e || e === "") return V.black;
                if (V[e]) return V[e];
                if (typeof e == "number") return [e >> 16, e >> 8 & 255, e & 255];
                if (e.charAt(0) === "#") {
                    if (e.length === 4) {
                        var t = e.charAt(1),
                            n = e.charAt(2),
                            r = e.charAt(3);
                        e = "#" + t + t + n + n + r + r
                    }
                    e = parseInt(e.substr(1), 16);
                    return [e >> 16, e >> 8 & 255, e & 255]
                }
                return e.match(o) || V.transparent
            }, k = function (e) {
                return u.test(typeof e == "string" ? e : (e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
            }, L = y.defaultView ? y.defaultView.getComputedStyle : function (e, t) {}, A = function (e, t, n, r) {
                if (!N && t === "opacity") return k(e);
                if (!r && e.style[t]) return e.style[t];
                if (n = n || L(e, null)) {
                    e = n.getPropertyValue(t.replace(f, "-$1").toLowerCase());
                    return e || n.length ? e : n[t]
                }
                if (e.currentStyle) {
                    n = e.currentStyle, r = n[t];
                    return !r && t === "backgroundPosition" ? n[t + "X"] + " " + n[t + "Y"] : r
                }
                return null
            }, O = function (e, t) {
                var n = {}, r;
                if (t = t || L(e, null)) if (r = t.length) while (--r > -1) n[t[r].replace(l, c)] = t.getPropertyValue(t[r]);
                    else for (r in t) n[r] = t[r];
                    else if (t = e.currentStyle || e.style) for (r in t) n[r.replace(l, c)] = t[r];
                N || (n.opacity = k(e));
                var i = F(e, t, !1);
                n.rotation = i.rotation * m;
                n.skewX = i.skewX * m;
                n.scaleX = i.scaleX;
                n.scaleY = i.scaleY;
                n.x = i.x;
                n.y = i.y;
                n.filters != null && delete n.filters;
                return n
            }, M = function (e, t, n, r) {
                var s = {}, o, u;
                for (u in t) if (u !== "cssText" && u !== "length" && isNaN(u) && e[u] != (o = t[u]) && o !== B) if (typeof o == "number" || typeof o == "string") {
                            s[u] = o !== "" && o !== "auto" || typeof e[u] != "string" || e[u].replace(i, "") === "" ? o : 0;
                            r && r.props.push(u)
                        }
                if (n) for (u in n) u !== "className" && (s[u] = n[u]);
                return s
            }, _ = {
                scaleX: 1,
                scaleY: 1,
                x: 1,
                y: 1,
                rotation: 1,
                shortRotation: 1,
                skewX: 1,
                skewY: 1,
                scale: 1
            }, D = "",
            P = "",
            H = function (e, t) {
                t = t || b;
                var n = t.style,
                    r, i;
                if (n[e] !== undefined) return e;
                e = e.substr(0, 1).toUpperCase() + e.substr(1);
                r = ["O", "Moz", "ms", "Ms", "Webkit"];
                i = 5;
                while (--i > -1 && n[r[i] + e] === undefined);
                if (i >= 0) {
                    P = i === 3 ? "ms" : r[i];
                    D = "-" + P.toLowerCase() + "-";
                    return P + e
                }
                return null
            }, B = H("transform"),
            j = D + "transform",
            F = function (e, t, n) {
                var r = e._gsTransform,
                    i;
                if (B) i = A(e, j, t, !0);
                else if (e.currentStyle) {
                    i = e.currentStyle.filter.match(p);
                    i = i && i.length === 4 ? i[0].substr(4) + "," + Number(i[2].substr(4)) + "," + Number(i[1].substr(4)) + "," + i[3].substr(4) + "," + (r ? r.x : 0) + "," + (r ? r.y : 0) : null
                }
                var s = (i || "").replace(/[^\d\-\.e,]/g, "").split(","),
                    o = s.length >= 6,
                    u = o ? Number(s[0]) : 1,
                    a = o ? Number(s[1]) : 0,
                    f = o ? Number(s[2]) : 0,
                    l = o ? Number(s[3]) : 1,
                    c = 1e-6,
                    h = n ? r || {
                        skewY: 0
                    } : {
                        skewY: 0
                    }, d = h.scaleX < 0;
                h.x = o ? Number(s[4]) : 0;
                h.y = o ? Number(s[5]) : 0;
                h.scaleX = Math.sqrt(u * u + a * a);
                h.scaleY = Math.sqrt(l * l + f * f);
                h.rotation = u || a ? Math.atan2(a, u) : h.rotation || 0;
                h.skewX = f || l ? Math.atan2(f, l) + h.rotation : h.skewX || 0;
                if (Math.abs(h.skewX) > Math.PI / 2) if (d) {
                        h.scaleX *= -1;
                        h.skewX += h.rotation <= 0 ? Math.PI : -Math.PI;
                        h.rotation += h.rotation <= 0 ? Math.PI : -Math.PI
                    } else {
                        h.scaleY *= -1;
                        h.skewX += h.skewX <= 0 ? Math.PI : -Math.PI
                    }
                h.rotation < c && h.rotation > -c && (u || a) && (h.rotation = 0);
                h.skewX < c && h.skewX > -c && (a || f) && (h.skewX = 0);
                n && (e._gsTransform = h);
                return h
            }, I = {
                width: ["Left", "Right"],
                height: ["Top", "Bottom"]
            }, q = ["marginLeft", "marginRight", "marginTop", "marginBottom"],
            R = function (e, t, n) {
                var r = parseFloat(e === "width" ? t.offsetWidth : t.offsetHeight),
                    i = I[e],
                    s = i.length,
                    n = n || L(t, null);
                while (--s > -1) {
                    r -= parseFloat(A(t, "padding" + i[s], n, !0)) || 0;
                    r -= parseFloat(A(t, "border" + i[s] + "Width", n, !0)) || 0
                }
                return r
            }, U = function (e, t, n, r, i) {
                if (r === "px" || !r) return n;
                if (r === "auto" || !n) return 0;
                var s = h.test(t),
                    o = e,
                    u = b.style,
                    a = n < 0;
                a && (n = -n);
                u.cssText = "border-style:solid; border-width:0; position:absolute; line-height:0;";
                if (r === "%" || r === "em" || !o.appendChild) {
                    o = e.parentNode || y.body;
                    u[s ? "width" : "height"] = n + r
                } else u[s ? "borderLeftWidth" : "borderTopWidth"] = n + r;
                o.appendChild(b);
                var f = parseFloat(b[s ? "offsetWidth" : "offsetHeight"]);
                o.removeChild(b);
                f === 0 && !i && (f = U(e, t, n, r, !0));
                return a ? -f : f
            }, z = function (e, t) {
                if (e == null || e === "" || e === "auto" || e === "auto auto") e = "0 0";
                t = t || {};
                var n = e.indexOf("left") !== -1 ? "0%" : e.indexOf("right") !== -1 ? "100%" : e.split(" ")[0],
                    r = e.indexOf("top") !== -1 ? "0%" : e.indexOf("bottom") !== -1 ? "100%" : e.split(" ")[1];
                r == null ? r = "0" : r === "center" && (r = "50%");
                n === "center" && (n = "50%");
                t.oxp = n.indexOf("%") !== -1;
                t.oyp = r.indexOf("%") !== -1;
                t.oxr = n.charAt(1) === "=";
                t.oyr = r.charAt(1) === "=";
                t.ox = parseFloat(n.replace(i, ""));
                t.oy = parseFloat(r.replace(i, ""));
                return t
            }, W = function (e, t) {
                return e == null ? t : typeof e == "string" && e.indexOf("=") === 1 ? Number(e.split("=").join("")) + t : Number(e)
            }, X = function (e, t) {
                var n = e.indexOf("rad") === -1 ? v : 1,
                    r = e.indexOf("=") === 1;
                e = Number(e.replace(i, "")) * n;
                return r ? e + t : e
            }, V = {
                aqua: [0, 255, 255],
                lime: [0, 255, 0],
                silver: [192, 192, 192],
                black: [0, 0, 0],
                maroon: [128, 0, 0],
                teal: [0, 128, 128],
                blue: [0, 0, 255],
                navy: [0, 0, 128],
                white: [255, 255, 255],
                fuchsia: [255, 0, 255],
                olive: [128, 128, 0],
                yellow: [255, 255, 0],
                orange: [255, 165, 0],
                gray: [128, 128, 128],
                purple: [128, 0, 128],
                green: [0, 128, 0],
                red: [255, 0, 0],
                pink: [255, 192, 203],
                cyan: [0, 255, 255],
                transparent: [255, 255, 255, 0]
            };
        r._onInitTween = function (e, t, r) {
            if (!e.nodeType) return !1;
            this._target = e;
            this._tween = r;
            this._classData = this._transform = null;
            E = t.autoRound;
            var i = this._style = e.style,
                s = L(e, ""),
                o, u, f;
            if (S && i.zIndex === "") {
                f = A(e, "zIndex", s);
                if (f === "auto" || f === "") i.zIndex = 0
            }
            if (typeof t == "string") {
                o = i.cssText;
                u = O(e, s);
                i.cssText = o + ";" + t;
                f = M(u, O(e));
                !N && a.test(t) && (f.opacity = parseFloat(RegExp.$1));
                t = f;
                i.cssText = o
            } else if (t.className) {
                o = e.className;
                this._classData = {
                    b: o,
                    e: t.className.charAt(1) !== "=" ? t.className : t.className.charAt(0) === "+" ? e.className + " " + t.className.substr(2) : e.className.split(t.className.substr(2)).join(""),
                    props: []
                };
                if (r._duration) {
                    u = O(e, s);
                    e.className = this._classData.e;
                    t = M(u, O(e), t, this._classData);
                    e.className = o
                } else t = {}
            }
            this._parseVars(t, e, s, t.suffixMap || n.suffixMap);
            return !0
        };
        r._parseVars = function (e, t, n, r) {
            var o = this._style,
                u, a, f, l, c, h, p, d, v, m, g, y;
            for (u in e) {
                a = e[u];
                if (u === "transform" || u === B) {
                    this._parseTransform(t, a, n, r);
                    continue
                }
                if (_[u] || u === "transformOrigin") {
                    this._parseTransform(t, e, n, r);
                    continue
                }
                if (u === "alpha" || u === "autoAlpha") u = "opacity";
                else {
                    if (u === "margin" || u === "padding") {
                        g = (a + "").split(" ");
                        v = g.length;
                        f = {};
                        f[u + "Top"] = g[0];
                        f[u + "Right"] = v > 1 ? g[1] : g[0];
                        f[u + "Bottom"] = v === 4 ? g[2] : g[0];
                        f[u + "Left"] = v === 4 ? g[3] : v === 2 ? g[1] : g[0];
                        this._parseVars(f, t, n, r);
                        continue
                    }
                    if (u === "backgroundPosition" || u === "backgroundSize") {
                        f = z(a);
                        m = z(l = A(t, u, n));
                        this._firstPT = f = {
                            _next: this._firstPT,
                            t: o,
                            p: u,
                            b: l,
                            f: !1,
                            n: "css_" + u,
                            type: 3,
                            s: m.ox,
                            c: f.oxr ? f.ox : f.ox - m.ox,
                            ys: m.oy,
                            yc: f.oyr ? f.oy : f.oy - m.oy,
                            sfx: f.oxp ? "%" : "px",
                            ysfx: f.oyp ? "%" : "px",
                            r: !f.oxp && e.autoRound !== !1
                        };
                        f.e = f.s + f.c + f.sfx + " " + (f.ys + f.yc) + f.ysfx;
                        continue
                    }
                    if (u === "border") {
                        g = (a + "").split(" ");
                        this._parseVars({
                            borderWidth: g[0],
                            borderStyle: g[1] || "none",
                            borderColor: g[2] || "#000000"
                        }, t, n, r);
                        continue
                    }
                    if (u === "bezier") {
                        this._parseBezier(a, t, n, r);
                        continue
                    }
                    if (u === "autoRound") continue
                }
                l = A(t, u, n);
                l = l != null ? l + "" : "";
                this._firstPT = f = {
                    _next: this._firstPT,
                    t: o,
                    p: u,
                    b: l,
                    f: !1,
                    n: "css_" + u,
                    sfx: "",
                    r: !1,
                    type: 0
                };
                if (u === "opacity" && e.autoAlpha != null) {
                    l === "1" && A(t, "visibility", n) === "hidden" && (l = f.b = "0");
                    this._firstPT = f._prev = {
                        _next: f,
                        t: o,
                        p: "visibility",
                        f: !1,
                        n: "css_visibility",
                        r: !1,
                        type: -1,
                        b: Number(l) !== 0 ? "visible" : "hidden",
                        i: "visible",
                        e: Number(a) === 0 ? "hidden" : "visible"
                    };
                    this._overwriteProps.push("css_visibility")
                }
                y = typeof a == "string";
                if (u === "color" || u === "fill" || u === "stroke" || u.indexOf("Color") !== -1 || y && !a.indexOf("rgb(")) {
                    c = C(l);
                    h = C(a);
                    f.e = f.i = (h.length > 3 ? "rgba(" : "rgb(") + h.join(",") + ")";
                    f.b = (c.length > 3 ? "rgba(" : "rgb(") + c.join(",") + ")";
                    f.s = Number(c[0]);
                    f.c = Number(h[0]) - f.s;
                    f.gs = Number(c[1]);
                    f.gc = Number(h[1]) - f.gs;
                    f.bs = Number(c[2]);
                    f.bc = Number(h[2]) - f.bs;
                    f.type = 1;
                    if (c.length > 3 || h.length > 3) if (N) {
                            f.as = c.length < 4 ? 1 : Number(c[3]);
                            f.ac = (h.length < 4 ? 1 : Number(h[3])) - f.as;
                            f.type = 2
                        } else {
                            if (h[3] == 0) {
                                f.e = f.i = "transparent";
                                f.type = -1
                            }
                            c[3] == 0 && (f.b = "transparent")
                        }
                } else {
                    p = l.replace(s, "");
                    if (l === "" || l === "auto") if (u === "width" || u === "height") {
                            m = R(u, t, n);
                            p = "px"
                        } else {
                            m = u !== "opacity" ? 0 : 1;
                            p = ""
                        } else m = l.indexOf(" ") === -1 ? parseFloat(l.replace(i, "")) : NaN;
                    if (y) {
                        v = a.charAt(1) === "=";
                        d = a.replace(s, "");
                        a = a.indexOf(" ") === -1 ? parseFloat(a.replace(i, "")) : NaN
                    } else {
                        v = !1;
                        d = ""
                    }
                    d === "" && (d = r[u] || p);
                    f.e = a || a === 0 ? (v ? a + m : a) + d : e[u];
                    if (p !== d && d !== "") if (a || a === 0) if (m || m === 0) {
                                m = U(t, u, m, p);
                                if (d === "%") {
                                    m /= U(t, u, 100, "%") / 100;
                                    m > 100 && (m = 100)
                                } else if (d === "em") m /= U(t, u, 1, "em");
                                else {
                                    a = U(t, u, a, d);
                                    d = "px"
                                }
                                v && (a || a === 0) && (f.e = a + m + d)
                            }
                    if (!m && m !== 0 || !a && a !== 0 || !(f.c = v ? a : a - m)) {
                        f.type = -1;
                        f.i = u === "display" && f.e === "none" ? f.b : f.e;
                        f.s = f.c = 0
                    } else {
                        f.s = m;
                        f.sfx = d;
                        if (u === "opacity") {
                            if (!N) {
                                f.type = 4;
                                f.p = "filter";
                                f.b = "alpha(opacity=" + f.s * 100 + ")";
                                f.e = "alpha(opacity=" + (f.s + f.c) * 100 + ")";
                                f.dup = e.autoAlpha != null;
                                this._style.zoom = 1
                            }
                        } else E !== !1 && (d === "px" || u === "zIndex") && (f.r = !0)
                    }
                }
                this._overwriteProps.push("css_" + u);
                f._next && (f._next._prev = f)
            }
        };
        r._parseTransform = function (e, t, n, r) {
            if (this._transform) return;
            var i = this._transform = F(e, n, !0),
                s = this._style,
                o = 1e-6,
                u, a, f, l, c, h;
            if (typeof t == "object") {
                u = {
                    scaleX: W(t.scaleX != null ? t.scaleX : t.scale, i.scaleX),
                    scaleY: W(t.scaleY != null ? t.scaleY : t.scale, i.scaleY),
                    x: W(t.x, i.x),
                    y: W(t.y, i.y)
                };
                if (t.shortRotation != null) {
                    u.rotation = typeof t.shortRotation == "number" ? t.shortRotation * v : X(t.shortRotation, i.rotation);
                    var p = (u.rotation - i.rotation) % (Math.PI * 2);
                    p !== p % Math.PI && (p += Math.PI * (p < 0 ? 2 : -2));
                    u.rotation = i.rotation + p
                } else u.rotation = t.rotation == null ? i.rotation : typeof t.rotation == "number" ? t.rotation * v : X(t.rotation, i.rotation);
                u.skewX = t.skewX == null ? i.skewX : typeof t.skewX == "number" ? t.skewX * v : X(t.skewX, i.skewX);
                u.skewY = t.skewY == null ? i.skewY : typeof t.skewY == "number" ? t.skewY * v : X(t.skewY, i.skewY);
                if (a = u.skewY - i.skewY) {
                    u.skewX += a;
                    u.rotation += a
                }
                u.skewY < o && u.skewY > -o && (u.skewY = 0);
                u.skewX < o && u.skewX > -o && (u.skewX = 0);
                u.rotation < o && u.rotation > -o && (u.rotation = 0);
                if ((h = t.transformOrigin) != null) if (B) {
                        f = B + "Origin";
                        this._firstPT = l = {
                            _next: this._firstPT,
                            t: s,
                            p: f,
                            s: 0,
                            c: 0,
                            n: f,
                            f: !1,
                            r: !1,
                            b: s[f],
                            e: h,
                            i: h,
                            type: -1,
                            sfx: ""
                        };
                        l._next && (l._next._prev = l)
                    } else z(h, i)
            } else {
                if (typeof t != "string" || !B) return;
                c = s[B];
                s[B] = t;
                u = F(e, null, !1);
                s[B] = c
            } if (!B) s.zoom = 1;
            else if (x) {
                S = !0;
                s.WebkitBackfaceVisibility === "" && (s.WebkitBackfaceVisibility = "hidden");
                if (s.zIndex === "") {
                    c = A(e, "zIndex", n);
                    if (c === "auto" || c === "") s.zIndex = 0
                }
            }
            for (f in _) if (i[f] !== u[f] || g[f] != null) if (f !== "shortRotation" && f !== "scale") {
                        this._firstPT = l = {
                            _next: this._firstPT,
                            t: i,
                            p: f,
                            s: i[f],
                            c: u[f] - i[f],
                            n: f,
                            f: !1,
                            r: !1,
                            b: i[f],
                            e: u[f],
                            type: 0,
                            sfx: 0
                        };
                        l._next && (l._next._prev = l);
                        this._overwriteProps.push("css_" + f)
                    }
        };
        r._parseBezier = function (e, t, n, r) {
            if (!window.com.greensock.plugins.BezierPlugin) {
                console.log("Error: BezierPlugin not loaded.");
                return
            }
            e instanceof Array && (e = {
                values: e
            });
            var i = e.values || [],
                s = i.length,
                o = [],
                u = this._bezier = {
                    _pt: []
                }, a = u._proxy = {}, f = 0,
                l = 0,
                c = {}, h = s - 1,
                p = g,
                d = u._plugin = new window.com.greensock.plugins.BezierPlugin,
                v, m, y, b, w, E;
            for (m = 0; m < s; m++) {
                w = {};
                this._transform = null;
                b = this._firstPT;
                this._parseVars(g = i[m], t, n, r);
                y = this._firstPT;
                if (m === 0) {
                    E = this._transform;
                    while (y !== b) {
                        a[y.p] = y.s;
                        u._pt[l++] = c[y.p] = y;
                        if (y.type === 1 || y.type === 2) {
                            a[y.p + "_g"] = y.gs;
                            a[y.p + "_b"] = y.bs;
                            y.type === 2 && (a[y.p + "_a"] = y.as)
                        } else y.type === 3 && (a[y.p + "_y"] = y.ys);
                        y = y._next
                    }
                    y = this._firstPT
                } else {
                    this._firstPT = b;
                    b._prev && (b._prev._next = null);
                    b._prev = null;
                    b = null
                }
                while (y !== b) {
                    if (c[y.p]) {
                        w[y.p] = y.s + y.c;
                        m === h && (c[y.p].e = y.e);
                        if (y.type === 1 || y.type === 2) {
                            w[y.p + "_g"] = y.gs + y.gc;
                            w[y.p + "_b"] = y.bs + y.bc;
                            y.type === 2 && (w[y.p + "_a"] = y.as + y.ac)
                        } else y.type === 3 && (w[y.p + "_y"] = y.ys + y.yc);
                        m === 0 && (y.c = y.ac = y.gc = y.bc = y.yc = 0)
                    }
                    y = y._next
                }
                o[f++] = w
            }
            this._transform = E;
            g = p;
            e.values = o;
            e.autoRotate === 0 && (e.autoRotate = !0);
            if (e.autoRotate && !(e.autoRotate instanceof Array)) {
                m = e.autoRotate == 1 ? 0 : Number(e.autoRotate) * Math.PI / 180;
                e.autoRotate = o[0].left != null ? [
                    ["left", "top", "rotation", m, !0]
                ] : o[0].x != null ? [
                    ["x", "y", "rotation", m, !0]
                ] : !1
            }
            if (u._autoRotate = e.autoRotate) E || (this._transform = F(t, n, !0));
            d._onInitTween(a, e, this._tween);
            e.values = i
        };
        r.setRatio = function (e) {
            var t = this._firstPT,
                n = this._bezier,
                r = 1e-6,
                i, o, a;
            if (n) {
                n._plugin.setRatio(e);
                var f = n._pt,
                    l = n._proxy;
                o = f.length;
                while (--o > -1) {
                    t = f[o];
                    t.s = l[t.p];
                    if (t.type === 1 || t.type === 2) {
                        t.gs = l[t.p + "_g"];
                        t.bs = l[t.p + "_b"];
                        t.type === 2 && (t.as = l[t.p + "_a"])
                    } else t.type === 3 && (t.ys = l[t.p + "_y"])
                }
                n._autoRotate && (this._transform.rotation = l.rotation)
            }
            if (e !== 1 || this._tween._time !== this._tween._duration && this._tween._time !== 0) if (e || this._tween._time !== this._tween._duration && this._tween._time !== 0) while (t) {
                        i = t.c * e + t.s;
                        t.r ? i = i > 0 ? i + .5 >> 0 : i - .5 >> 0 : i < r && i > -r && (i = 0);
                        if (!t.type) t.t[t.p] = i + t.sfx;
                        else if (t.type === 1) t.t[t.p] = "rgb(" + (i >> 0) + ", " + (t.gs + e * t.gc >> 0) + ", " + (t.bs + e * t.bc >> 0) + ")";
                        else if (t.type === 2) t.t[t.p] = "rgba(" + (i >> 0) + ", " + (t.gs + e * t.gc >> 0) + ", " + (t.bs + e * t.bc >> 0) + ", " + (t.as + e * t.ac) + ")";
                        else if (t.type === -1) t.t[t.p] = t.i;
                        else if (t.type === 3) {
                            a = t.ys + e * t.yc;
                            t.r && (a = a > 0 ? a + .5 >> 0 : a - .5 >> 0);
                            t.t[t.p] = i + t.sfx + " " + a + t.ysfx
                        } else {
                            t.dup && (t.t.filter = t.t.filter || "alpha(opacity=100)");
                            t.t.filter.indexOf("opacity") === -1 ? t.t.filter += " alpha(opacity=" + (i * 100 >> 0) + ")" : t.t.filter = t.t.filter.replace(u, "opacity=" + (i * 100 >> 0))
                        }
                        t = t._next
                } else while (t) {
                        t.t[t.p] = t.b;
                        if (t.type === 4 && t.s === 1) {
                            this._style.removeAttribute("filter");
                            A(this._target, "filter") && (t.t[t.p] = t.b)
                        }
                        t = t._next
                } else while (t) {
                        t.t[t.p] = t.e;
                        if (t.type === 4 && t.s + t.c === 1) {
                            this._style.removeAttribute("filter");
                            A(this._target, "filter") && (t.t[t.p] = t.e)
                        }
                        t = t._next
                }
            if (this._transform) {
                t = this._transform;
                if (B && !t.rotation && !t.skewX) this._style[B] = (t.x || t.y ? "translate(" + t.x + "px," + t.y + "px) " : "") + (t.scaleX !== 1 || t.scaleY !== 1 ? "scale(" + t.scaleX + "," + t.scaleY + ")" : "") || "translate(0px,0px)";
                else {
                    var c = B ? t.rotation : -t.rotation,
                        h = B ? c - t.skewX : c + t.skewX,
                        p = Math.cos(c) * t.scaleX,
                        v = Math.sin(c) * t.scaleX,
                        m = Math.sin(h) * -t.scaleY,
                        g = Math.cos(h) * t.scaleY,
                        y;
                    p < r && p > -r && (p = 0);
                    v < r && v > -r && (v = 0);
                    m < r && m > -r && (m = 0);
                    g < r && g > -r && (g = 0);
                    if (B) this._style[B] = "matrix(" + p + "," + v + "," + m + "," + g + "," + t.x + "," + t.y + ")";
                    else if (y = this._target.currentStyle) {
                        r = v;
                        v = -m;
                        m = -r;
                        var b = y.filter;
                        this._style.filter = "";
                        var w = this._target.offsetWidth,
                            E = this._target.offsetHeight,
                            S = y.position !== "absolute",
                            x = "progid:DXImageTransform.Microsoft.Matrix(M11=" + p + ", M12=" + v + ", M21=" + m + ", M22=" + g,
                            N = t.x,
                            C = t.y,
                            k, L;
                        if (t.ox != null) {
                            k = (t.oxp ? w * t.ox * .01 : t.ox) - w / 2;
                            L = (t.oyp ? E * t.oy * .01 : t.oy) - E / 2;
                            N = k - (k * p + L * v) + t.x;
                            C = L - (k * m + L * g) + t.y
                        }
                        if (!S) {
                            var O = T < 8 ? 1 : -1,
                                M, _, D;
                            k = t.ieOffsetX || 0;
                            L = t.ieOffsetY || 0;
                            t.ieOffsetX = Math.round((w - ((p < 0 ? -p : p) * w + (v < 0 ? -v : v) * E)) / 2 + N);
                            t.ieOffsetY = Math.round((E - ((g < 0 ? -g : g) * E + (m < 0 ? -m : m) * w)) / 2 + C);
                            for (o = 0; o < 4; o++) {
                                _ = q[o];
                                M = y[_];
                                i = M.indexOf("px") !== -1 ? parseFloat(M) : U(this._target, _, parseFloat(M), M.replace(s, "")) || 0;
                                i !== t[_] ? D = o < 2 ? -t.ieOffsetX : -t.ieOffsetY : D = o < 2 ? k - t.ieOffsetX : L - t.ieOffsetY;
                                this._style[_] = (t[_] = Math.round(i - D * (o === 0 || o === 2 ? 1 : O))) + "px"
                            }
                            x += ", sizingMethod='auto expand')"
                        } else {
                            k = w / 2, L = E / 2;
                            x += ", Dx=" + (k - (k * p + L * v) + N) + ", Dy=" + (L - (k * m + L * g) + C) + ")"
                        }
                        b.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1 ? this._style.filter = b.replace(d, x) : this._style.filter = x + " " + b;
                        (e === 0 || e === 1) && p === 1 && v === 0 && m === 0 && g === 1 && (!S || x.indexOf("Dx=0, Dy=0") !== -1) && (!u.test(b) || parseFloat(RegExp.$1) === 100) && this._style.removeAttribute("filter")
                    }
                }
            }
            if (this._classData) {
                t = this._classData;
                if (e !== 1 || this._tween._time !== this._tween._duration && this._tween._time !== 0) this._target.className !== t.b && (this._target.className = t.b);
                else {
                    var o = t.props.length;
                    while (--o > -1) this._style[t.props[o]] = "";
                    this._target.className = t.e
                }
            }
        };
        r._kill = function (t) {
            var n = t,
                r;
            if (t.autoAlpha || t.alpha) {
                n = {};
                for (r in t) n[r] = t[r];
                n.opacity = 1;
                n.autoAlpha && (n.visibility = 1)
            }
            return e.prototype._kill.call(this, n)
        };
        e.activate([n]);
        return n
    }, !0);
    _gsDefine("plugins.RoundPropsPlugin", ["plugins.TweenPlugin"], function (e) {
        var t = function (t, n) {
            e.call(this, "roundProps", -1);
            this._overwriteProps.length = 0
        }, n = t.prototype = new e("roundProps", -1);
        n.constructor = t;
        t.API = 2;
        n._onInitTween = function (e, t, n) {
            this._tween = n;
            return !0
        };
        n._onInitAllProps = function () {
            var e = this._tween,
                t = e.vars.roundProps instanceof Array ? e.vars.roundProps : e.vars.roundProps.split(","),
                n = t.length,
                r = {}, i = e._propLookup.roundProps,
                s, o, u;
            while (--n > -1) r[t[n]] = 1;
            n = t.length;
            while (--n > -1) {
                s = t[n];
                o = e._firstPT;
                while (o) {
                    u = o._next;
                    if (o.pg) o.t._roundProps(r, !0);
                    else if (o.n === s) {
                        this._add(o.t, s, o.s, o.c);
                        u && (u._prev = o._prev);
                        o._prev ? o._prev._next = u : _tween._firstPT === o && (e._firstPT = u);
                        o._next = o._prev = null;
                        e._propLookup[s] = i
                    }
                    o = u
                }
            }
            return !1
        };
        n._add = function (e, t, n, r) {
            this._addTween(e, t, n, n + r, t, !0);
            this._overwriteProps.push(t)
        };
        e.activate([t]);
        return t
    }, !0);
    _gsDefine("easing.Back", ["easing.Ease"], function (e) {
        var t = window.com.greensock,
            n = t._class,
            r = function (t, r) {
                var i = n("easing." + t, function () {}, !0),
                    s = i.prototype = new e;
                s.constructor = i;
                s.getRatio = r;
                return i
            }, i = function (t, r) {
                var i = n("easing." + t, function (e) {
                    this._p1 = e || e === 0 ? e : 1.70158;
                    this._p2 = this._p1 * 1.525
                }, !0),
                    s = i.prototype = new e;
                s.constructor = i;
                s.getRatio = r;
                s.config = function (e) {
                    return new i(e)
                };
                return i
            }, s = i("BackOut", function (e) {
                return (e -= 1) * e * ((this._p1 + 1) * e + this._p1) + 1
            }),
            o = i("BackIn", function (e) {
                return e * e * ((this._p1 + 1) * e - this._p1)
            }),
            u = i("BackInOut", function (e) {
                return (e *= 2) < 1 ? .5 * e * e * ((this._p2 + 1) * e - this._p2) : .5 * ((e -= 2) * e * ((this._p2 + 1) * e + this._p2) + 2)
            }),
            a = r("BounceOut", function (e) {
                return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
            }),
            f = r("BounceIn", function (e) {
                return (e = 1 - e) < 1 / 2.75 ? 1 - 7.5625 * e * e : e < 2 / 2.75 ? 1 - (7.5625 * (e -= 1.5 / 2.75) * e + .75) : e < 2.5 / 2.75 ? 1 - (7.5625 * (e -= 2.25 / 2.75) * e + .9375) : 1 - (7.5625 * (e -= 2.625 / 2.75) * e + .984375)
            }),
            l = r("BounceInOut", function (e) {
                var t = e < .5;
                t ? e = 1 - e * 2 : e = e * 2 - 1;
                e < 1 / 2.75 ? e = 7.5625 * e * e : e < 2 / 2.75 ? e = 7.5625 * (e -= 1.5 / 2.75) * e + .75 : e < 2.5 / 2.75 ? e = 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : e = 7.5625 * (e -= 2.625 / 2.75) * e + .984375;
                return t ? (1 - e) * .5 : e * .5 + .5
            }),
            c = r("CircOut", function (e) {
                return Math.sqrt(1 - (e -= 1) * e)
            }),
            h = r("CircIn", function (e) {
                return -(Math.sqrt(1 - e * e) - 1)
            }),
            p = r("CircInOut", function (e) {
                return (e *= 2) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
            }),
            d = Math.PI * 2,
            v = function (t, r, i) {
                var s = n("easing." + t, function (e, t) {
                    this._p1 = e || 1;
                    this._p2 = t || i;
                    this._p3 = this._p2 / d * (Math.asin(1 / this._p1) || 0)
                }, !0),
                    o = s.prototype = new e;
                o.constructor = s;
                o.getRatio = r;
                o.config = function (e, t) {
                    return new s(e, t)
                };
                return s
            }, m = v("ElasticOut", function (e) {
                return this._p1 * Math.pow(2, -10 * e) * Math.sin((e - this._p3) * d / this._p2) + 1
            }, .3),
            g = v("ElasticIn", function (e) {
                return -(this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * d / this._p2))
            }, .3),
            y = v("ElasticInOut", function (e) {
                return (e *= 2) < 1 ? -0.5 * this._p1 * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - this._p3) * d / this._p2) : this._p1 * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - this._p3) * d / this._p2) * .5 + 1
            }, .45),
            b = r("ExpoOut", function (e) {
                return 1 - Math.pow(2, -10 * e)
            }),
            w = r("ExpoIn", function (e) {
                return Math.pow(2, 10 * (e - 1)) - .001
            }),
            E = r("ExpoInOut", function (e) {
                return (e *= 2) < 1 ? .5 * Math.pow(2, 10 * (e - 1)) : .5 * (2 - Math.pow(2, -10 * (e - 1)))
            }),
            S = Math.PI / 2,
            x = r("SineOut", function (e) {
                return Math.sin(e * S)
            }),
            T = r("SineIn", function (e) {
                return -Math.cos(e * S) + 1
            }),
            N = r("SineInOut", function (e) {
                return -0.5 * (Math.cos(Math.PI * e) - 1)
            }),
            C = n("easing.SlowMo", function (e, t, n) {
                t = t || t === 0 ? t : .7;
                e == null ? e = .7 : e > 1 && (e = 1);
                this._p = e != 1 ? t : 0;
                this._p1 = (1 - e) / 2;
                this._p2 = e;
                this._p3 = this._p1 + this._p2;
                this._calcEnd = n === !0
            }, !0),
            k = C.prototype = new e;
        k.constructor = C;
        k.getRatio = function (e) {
            var t = e + (.5 - e) * this._p;
            return e < this._p1 ? this._calcEnd ? 1 - (e = 1 - e / this._p1) * e : t - (e = 1 - e / this._p1) * e * e * e * t : e > this._p3 ? this._calcEnd ? 1 - (e = (e - this._p3) / this._p1) * e : t + (e - t) * (e = (e - this._p3) / this._p1) * e * e * e : this._calcEnd ? 1 : t
        };
        C.ease = new C(.7, .7);
        k.config = C.config = function (e, t, n) {
            return new C(e, t, n)
        };
        var L = n("easing.SteppedEase", function (e) {
            e = e || 1;
            this._p1 = 1 / e;
            this._p2 = e + 1
        }, !0);
        k = L.prototype = new e;
        k.constructor = L;
        k.getRatio = function (e) {
            e < 0 ? e = 0 : e >= 1 && (e = .999999999);
            return (this._p2 * e >> 0) * this._p1
        };
        k.config = L.config = function (e) {
            return new L(e)
        };
        n("easing.Bounce", {
            easeOut: new a,
            easeIn: new f,
            easeInOut: new l
        }, !0);
        n("easing.Circ", {
            easeOut: new c,
            easeIn: new h,
            easeInOut: new p
        }, !0);
        n("easing.Elastic", {
            easeOut: new m,
            easeIn: new g,
            easeInOut: new y
        }, !0);
        n("easing.Expo", {
            easeOut: new b,
            easeIn: new w,
            easeInOut: new E
        }, !0);
        n("easing.Sine", {
            easeOut: new x,
            easeIn: new T,
            easeInOut: new N
        }, !0);
        return {
            easeOut: new s,
            easeIn: new o,
            easeInOut: new u
        }
    }, !0)
});
(function (e) {
    "use strict";
    var t = function (t) {
        var n = t.split("."),
            r = e,
            i;
        for (i = 0; i < n.length; i++) r[n[i]] = r = r[n[i]] || {};
        return r
    }, n = t("com.greensock"),
        r, i, s, o, u, a, f = {}, l = function (n, r, i, s) {
            this.sc = f[n] ? f[n].sc : [];
            f[n] = this;
            this.gsClass = null;
            this.def = i;
            var o = r || [],
                u = [];
            this.check = function (r) {
                var a = o.length,
                    c = 0,
                    h;
                while (--a > -1) if ((h = f[o[a]] || new l(o[a])).gsClass) u[a] = h.gsClass;
                    else {
                        c++;
                        r && h.sc.push(this)
                    }
                if (c === 0 && i) {
                    var p = ("com.greensock." + n).split("."),
                        d = p.pop(),
                        v = t(p.join("."))[d] = this.gsClass = i.apply(i, u);
                    if (s) {
                        (e.GreenSockGlobals || e)[d] = v;
                        typeof define == "function" && define.amd ? define((e.GreenSockAMDPath ? e.GreenSockAMDPath + "/" : "") + n.split(".").join("/"), [], function () {
                            return v
                        }) : typeof module != "undefined" && module.exports && (module.exports = v)
                    }
                    for (a = 0; a < this.sc.length; a++) this.sc[a].check(!1)
                }
            };
            this.check(!0)
        }, c = n._class = function (e, t, n) {
            new l(e, [], function () {
                return t
            }, n);
            return t
        };
    e._gsDefine = function (e, t, n, r) {
        return new l(e, t, n, r)
    };
    var h = [0, 0, 1, 1],
        p = [],
        d = c("easing.Ease", function (e, t, n, r) {
            this._func = e;
            this._type = n || 0;
            this._power = r || 0;
            this._params = t ? h.concat(t) : h
        }, !0);
    u = d.prototype;
    u._calcEnd = !1;
    u.getRatio = function (e) {
        if (this._func) {
            this._params[0] = e;
            return this._func.apply(null, this._params)
        }
        var t = this._type,
            n = this._power,
            r = t === 1 ? 1 - e : t === 2 ? e : e < .5 ? e * 2 : (1 - e) * 2;
        n === 1 ? r *= r : n === 2 ? r *= r * r : n === 3 ? r *= r * r * r : n === 4 && (r *= r * r * r * r);
        return t === 1 ? 1 - r : t === 2 ? r : e < .5 ? r / 2 : 1 - r / 2
    };
    r = ["Linear", "Quad", "Cubic", "Quart", "Quint"];
    i = r.length;
    while (--i > -1) {
        s = c("easing." + r[i], function () {}, !0);
        o = c("easing.Power" + i, function () {}, !0);
        s.easeOut = o.easeOut = new d(null, null, 1, i);
        s.easeIn = o.easeIn = new d(null, null, 2, i);
        s.easeInOut = o.easeInOut = new d(null, null, 3, i)
    }
    c("easing.Strong", n.easing.Power4, !0);
    n.easing.Linear.easeNone = n.easing.Linear.easeIn;
    u = c("events.EventDispatcher", function (e) {
        this._listeners = {};
        this._eventTarget = e || this
    }).prototype;
    u.addEventListener = function (e, t, n, r, i) {
        i = i || 0;
        var s = this._listeners[e],
            o = 0,
            u, a;
        s == null && (this._listeners[e] = s = []);
        a = s.length;
        while (--a > -1) {
            u = s[a];
            u.c === t ? s.splice(a, 1) : o === 0 && u.pr < i && (o = a + 1)
        }
        s.splice(o, 0, {
            c: t,
            s: n,
            up: r,
            pr: i
        })
    };
    u.removeEventListener = function (e, t) {
        var n = this._listeners[e];
        if (n) {
            var r = n.length;
            while (--r > -1) if (n[r].c === t) {
                    n.splice(r, 1);
                    return
                }
        }
    };
    u.dispatchEvent = function (e) {
        var t = this._listeners[e];
        if (t) {
            var n = t.length,
                r, i = this._eventTarget;
            while (--n > -1) {
                r = t[n];
                r.up ? r.c.call(r.s || i, {
                    type: e,
                    target: i
                }) : r.c.call(r.s || i)
            }
        }
    };
    var v = e.requestAnimationFrame,
        m = e.cancelAnimationFrame,
        g = Date.now || function () {
            return (new Date).getTime()
        };
    r = ["ms", "moz", "webkit", "o"];
    i = r.length;
    while (--i > -1 && !v) {
        v = e[r[i] + "RequestAnimationFrame"];
        m = e[r[i] + "CancelAnimationFrame"] || e[r[i] + "CancelRequestAnimationFrame"]
    }
    m || (m = function (t) {
        e.clearTimeout(t)
    });
    c("Ticker", function (t, n) {
        this.time = 0;
        this.frame = 0;
        var r = this,
            i = g(),
            s = n !== !1,
            o, u, a, f, l;
        this.tick = function () {
            r.time = (g() - i) / 1e3;
            if (!o || r.time >= l) {
                r.frame++;
                l = r.time + f - (r.time - l) - 5e-4;
                l <= r.time && (l = r.time + .001);
                r.dispatchEvent("tick")
            }
            a = u(r.tick)
        };
        this.fps = function (t) {
            if (!arguments.length) return o;
            o = t;
            f = 1 / (o || 60);
            l = this.time + f;
            u = o === 0 ? function (e) {} : !s || !v ? function (t) {
                return e.setTimeout(t, (l - r.time) * 1e3 + 1 >> 0 || 1)
            } : v;
            m(a);
            a = u(r.tick)
        };
        this.useRAF = function (e) {
            if (!arguments.length) return s;
            s = e;
            this.fps(o)
        };
        this.fps(t)
    });
    u = n.Ticker.prototype = new n.events.EventDispatcher;
    u.constructor = n.Ticker;
    var y = c("core.Animation", function (e, t) {
        this.vars = t || {};
        this._duration = this._totalDuration = e || 0;
        this._delay = Number(this.vars.delay) || 0;
        this._timeScale = 1;
        this._active = this.vars.immediateRender == 1;
        this.data = this.vars.data;
        this._reversed = this.vars.reversed == 1;
        if (!L) return;
        if (!a) {
            b.tick();
            a = !0
        }
        var n = this.vars.useFrames ? k : L;
        n.insert(this, n._time);
        this.vars.paused && this.paused(!0)
    }),
        b = y.ticker = new n.Ticker;
    u = y.prototype;
    u._dirty = u._gc = u._initted = u._paused = !1;
    u._totalTime = u._time = 0;
    u._rawPrevTime = -1;
    u._next = u._last = u._onUpdate = u._timeline = u.timeline = null;
    u._paused = !1;
    u.play = function (e, t) {
        arguments.length && this.seek(e, t);
        this.reversed(!1);
        return this.paused(!1)
    };
    u.pause = function (e, t) {
        arguments.length && this.seek(e, t);
        return this.paused(!0)
    };
    u.resume = function (e, t) {
        arguments.length && this.seek(e, t);
        return this.paused(!1)
    };
    u.seek = function (e, t) {
        return this.totalTime(Number(e), t != 0)
    };
    u.restart = function (e, t) {
        this.reversed(!1);
        this.paused(!1);
        return this.totalTime(e ? -this._delay : 0, t != 0)
    };
    u.reverse = function (e, t) {
        arguments.length && this.seek(e || this.totalDuration(), t);
        this.reversed(!0);
        return this.paused(!1)
    };
    u.render = function () {};
    u.invalidate = function () {
        return this
    };
    u._enabled = function (e, t) {
        this._gc = !e;
        this._active = e && !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration;
        t != 1 && (e && this.timeline == null ? this._timeline.insert(this, this._startTime - this._delay) : !e && this.timeline != null && this._timeline._remove(this, !0));
        return !1
    };
    u._kill = function (e, t) {
        return this._enabled(!1, !1)
    };
    u.kill = function (e, t) {
        this._kill(e, t);
        return this
    };
    u._uncache = function (e) {
        var t = e ? this : this.timeline;
        while (t) {
            t._dirty = !0;
            t = t.timeline
        }
        return this
    };
    u.eventCallback = function (e, t, n, r) {
        if (e == null) return null;
        if (e.substr(0, 2) === "on") {
            if (arguments.length === 1) return this.vars[e];
            if (t == null) delete this.vars[e];
            else {
                this.vars[e] = t;
                this.vars[e + "Params"] = n;
                this.vars[e + "Scope"] = r;
                if (n) {
                    var i = n.length;
                    while (--i > -1) if (n[i] === "{self}") {
                            n = this.vars[e + "Params"] = n.concat();
                            n[i] = this
                        }
                }
            }
            e === "onUpdate" && (this._onUpdate = t)
        }
        return this
    };
    u.delay = function (e) {
        if (!arguments.length) return this._delay;
        this._timeline.smoothChildTiming && this.startTime(this._startTime + e - this._delay);
        this._delay = e;
        return this
    };
    u.duration = function (e) {
        if (!arguments.length) {
            this._dirty = !1;
            return this._duration
        }
        this._duration = this._totalDuration = e;
        this._uncache(!0);
        this._timeline.smoothChildTiming && this._active && e != 0 && this.totalTime(this._totalTime * (e / this._duration), !0);
        return this
    };
    u.totalDuration = function (e) {
        this._dirty = !1;
        return arguments.length ? this.duration(e) : this._totalDuration
    };
    u.time = function (e, t) {
        if (!arguments.length) return this._time;
        this._dirty && this.totalDuration();
        e > this._duration && (e = this._duration);
        return this.totalTime(e, t)
    };
    u.totalTime = function (e, t) {
        if (!arguments.length) return this._totalTime;
        if (this._timeline) {
            e < 0 && (e += this.totalDuration());
            if (this._timeline.smoothChildTiming) {
                this._dirty && this.totalDuration();
                e > this._totalDuration && (e = this._totalDuration);
                this._startTime = (this._paused ? this._pauseTime : this._timeline._time) - (this._reversed ? this._totalDuration - e : e) / this._timeScale;
                this._timeline._dirty || this._uncache(!1);
                if (!this._timeline._active) {
                    var n = this._timeline;
                    while (n._timeline) {
                        n.totalTime(n._totalTime, !0);
                        n = n._timeline
                    }
                }
            }
            this._gc && this._enabled(!0, !1);
            this._totalTime != e && this.render(e, t, !1)
        }
        return this
    };
    u.startTime = function (e) {
        if (!arguments.length) return this._startTime;
        if (e != this._startTime) {
            this._startTime = e;
            this.timeline && this.timeline._sortChildren && this.timeline.insert(this, e - this._delay)
        }
        return this
    };
    u.timeScale = function (e) {
        if (!arguments.length) return this._timeScale;
        e = e || 1e-6;
        if (this._timeline && this._timeline.smoothChildTiming) {
            var t = this._pauseTime || this._pauseTime == 0 ? this._pauseTime : this._timeline._totalTime;
            this._startTime = t - (t - this._startTime) * this._timeScale / e
        }
        this._timeScale = e;
        return this._uncache(!1)
    };
    u.reversed = function (e) {
        if (!arguments.length) return this._reversed;
        if (e != this._reversed) {
            this._reversed = e;
            this.totalTime(this._totalTime, !0)
        }
        return this
    };
    u.paused = function (e) {
        if (!arguments.length) return this._paused;
        if (e != this._paused && this._timeline) {
            if (!e && this._timeline.smoothChildTiming) {
                this._startTime += this._timeline.rawTime() - this._pauseTime;
                this._uncache(!1)
            }
            this._pauseTime = e ? this._timeline.rawTime() : null;
            this._paused = e;
            this._active = !this._paused && this._totalTime > 0 && this._totalTime < this._totalDuration
        }
        this._gc && (e || this._enabled(!0, !1));
        return this
    };
    var w = c("core.SimpleTimeline", function (e) {
        y.call(this, 0, e);
        this.autoRemoveChildren = this.smoothChildTiming = !0
    });
    u = w.prototype = new y;
    u.constructor = w;
    u.kill()._gc = !1;
    u._first = u._last = null;
    u._sortChildren = !1;
    u.insert = function (e, t) {
        e._startTime = Number(t || 0) + e._delay;
        e._paused && this !== e._timeline && (e._pauseTime = e._startTime + (this.rawTime() - e._startTime) / e._timeScale);
        e.timeline && e.timeline._remove(e, !0);
        e.timeline = e._timeline = this;
        e._gc && e._enabled(!0, !0);
        var n = this._last;
        if (this._sortChildren) {
            var r = e._startTime;
            while (n && n._startTime > r) n = n._prev
        }
        if (n) {
            e._next = n._next;
            n._next = e
        } else {
            e._next = this._first;
            this._first = e
        }
        e._next ? e._next._prev = e : this._last = e;
        e._prev = n;
        this._timeline && this._uncache(!0);
        return this
    };
    u._remove = function (e, t) {
        if (e.timeline === this) {
            t || e._enabled(!1, !0);
            e.timeline = null;
            e._prev ? e._prev._next = e._next : this._first === e && (this._first = e._next);
            e._next ? e._next._prev = e._prev : this._last === e && (this._last = e._prev);
            this._timeline && this._uncache(!0)
        }
        return this
    };
    u.render = function (e, t, n) {
        var r = this._first,
            i;
        this._totalTime = this._time = this._rawPrevTime = e;
        while (r) {
            i = r._next;
            if (r._active || e >= r._startTime && !r._paused) r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (e - r._startTime) * r._timeScale, t, !1) : r.render((e - r._startTime) * r._timeScale, t, !1);
            r = i
        }
    };
    u.rawTime = function () {
        return this._totalTime
    };
    var E = c("TweenLite", function (e, t, n) {
        y.call(this, t, n);
        if (e == null) throw "Cannot tween an undefined reference.";
        this.target = e;
        this._overwrite = this.vars.overwrite == null ? C[E.defaultOverwrite] : typeof this.vars.overwrite == "number" ? this.vars.overwrite >> 0 : C[this.vars.overwrite];
        var r, i, s;
        if ((e instanceof Array || e.jquery) && typeof e[0] == "object") {
            this._targets = e.slice(0);
            this._propLookup = [];
            this._siblings = [];
            for (i = 0; i < this._targets.length; i++) {
                s = this._targets[i];
                if (s.jquery) {
                    this._targets.splice(i--, 1);
                    this._targets = this._targets.concat(s.constructor.makeArray(s));
                    continue
                }
                this._siblings[i] = A(s, this, !1);
                this._overwrite === 1 && this._siblings[i].length > 1 && O(s, this, null, 1, this._siblings[i])
            }
        } else {
            this._propLookup = {};
            this._siblings = A(e, this, !1);
            this._overwrite === 1 && this._siblings.length > 1 && O(e, this, null, 1, this._siblings)
        }(this.vars.immediateRender || t === 0 && this._delay === 0 && this.vars.immediateRender != 0) && this.render(-this._delay, !1, !0)
    }, !0);
    u = E.prototype = new y;
    u.constructor = E;
    u.kill()._gc = !1;
    u.ratio = 0;
    u._firstPT = u._targets = u._overwrittenProps = null;
    u._notifyPluginsOfEnabled = !1;
    E.version = 12;
    E.defaultEase = u._ease = new d(null, null, 1, 1);
    E.defaultOverwrite = "auto";
    E.ticker = b;
    var S = E._plugins = {}, x = E._tweenLookup = {}, T = 0,
        N = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            orientToBezier: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1
        }, C = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            "true": 1,
            "false": 0
        }, k = y._rootFramesTimeline = new w,
        L = y._rootTimeline = new w;
    L._startTime = b.time;
    k._startTime = b.frame;
    L._active = k._active = !0;
    y._updateRoot = function () {
        L.render((b.time - L._startTime) * L._timeScale, !1, !1);
        k.render((b.frame - k._startTime) * k._timeScale, !1, !1);
        if (!(b.frame % 120)) {
            var e, t, n;
            for (n in x) {
                t = x[n].tweens;
                e = t.length;
                while (--e > -1) t[e]._gc && t.splice(e, 1);
                t.length === 0 && delete x[n]
            }
        }
    };
    b.addEventListener("tick", y._updateRoot);
    var A = function (e, t, n) {
        var r = e._gsTweenID,
            i, s;
        x[r || (e._gsTweenID = r = "t" + T++)] || (x[r] = {
            target: e,
            tweens: []
        });
        if (t) {
            i = x[r].tweens;
            i[s = i.length] = t;
            if (n) while (--s > -1) i[s] === t && i.splice(s, 1)
        }
        return x[r].tweens
    }, O = function (e, t, n, r, i) {
            var s, o, u;
            if (r === 1 || r >= 4) {
                var a = i.length;
                for (s = 0; s < a; s++) if ((u = i[s]) !== t) u._gc || u._enabled(!1, !1) && (o = !0);
                    else if (r === 5) break;
                return o
            }
            var f = t._startTime + 1e-10,
                l = [],
                c = 0,
                h;
            s = i.length;
            while (--s > -1) if ((u = i[s]) !== t && !u._gc && !u._paused) if (u._timeline !== t._timeline) {
                        h = h || M(t, 0);
                        M(u, h) === 0 && (l[c++] = u)
                    } else u._startTime <= f && u._startTime + u.totalDuration() / u._timeScale + 1e-10 > f && (t._duration !== 0 && !! u._initted || !(f - u._startTime <= 2e-10)) && (l[c++] = u);
            s = c;
            while (--s > -1) {
                u = l[s];
                r === 2 && u._kill(n, e) && (o = !0);
                (r !== 2 || !u._firstPT && u._initted) && u._enabled(!1, !1) && (o = !0)
            }
            return o
        }, M = function (e, t) {
            var n = e._timeline,
                r = n._timeScale,
                i = e._startTime;
            while (n._timeline) {
                i += n._startTime;
                r *= n._timeScale;
                if (n._paused) return -100;
                n = n._timeline
            }
            i /= r;
            return i > t ? i - t : !e._initted && i - t < 2e-10 ? 1e-10 : (i += e.totalDuration() / e._timeScale / r) > t ? 0 : i - t - 1e-10
        };
    u._init = function () {
        if (this.vars.startAt) {
            this.vars.startAt.overwrite = 0;
            this.vars.startAt.immediateRender = !0;
            E.to(this.target, 0, this.vars.startAt)
        }
        var e, t, n;
        this.vars.ease instanceof d ? this._ease = this.vars.easeParams instanceof Array ? this.vars.ease.config.apply(this.vars.ease, this.vars.easeParams) : this.vars.ease : typeof this.vars.ease == "function" ? this._ease = new d(this.vars.ease, this.vars.easeParams) : this._ease = E.defaultEase;
        this._easeType = this._ease._type;
        this._easePower = this._ease._power;
        this._firstPT = null;
        if (this._targets) {
            e = this._targets.length;
            while (--e > -1) this._initProps(this._targets[e], this._propLookup[e] = {}, this._siblings[e], this._overwrittenProps ? this._overwrittenProps[e] : null) && (t = !0)
        } else t = this._initProps(this.target, this._propLookup, this._siblings, this._overwrittenProps);
        t && E._onPluginEvent("_onInitAllProps", this);
        this._overwrittenProps && this._firstPT == null && typeof this.target != "function" && this._enabled(!1, !1);
        if (this.vars.runBackwards) {
            n = this._firstPT;
            while (n) {
                n.s += n.c;
                n.c = -n.c;
                n = n._next
            }
        }
        this._onUpdate = this.vars.onUpdate;
        this._initted = !0
    };
    u._initProps = function (e, t, n, r) {
        var i, s, o, u, a, f;
        if (e == null) return !1;
        for (i in this.vars) {
            if (N[i]) {
                if (i === "onStartParams" || i === "onUpdateParams" || i === "onCompleteParams" || i === "onReverseCompleteParams" || i === "onRepeatParams") if (a = this.vars[i]) {
                        s = a.length;
                        while (--s > -1) if (a[s] === "{self}") {
                                a = this.vars[i] = a.concat();
                                a[s] = this
                            }
                    }
            } else if (S[i] && (u = new S[i])._onInitTween(e, this.vars[i], this)) {
                this._firstPT = f = {
                    _next: this._firstPT,
                    t: u,
                    p: "setRatio",
                    s: 0,
                    c: 1,
                    f: !0,
                    n: i,
                    pg: !0,
                    pr: u._priority
                };
                s = u._overwriteProps.length;
                while (--s > -1) t[u._overwriteProps[s]] = this._firstPT;
                if (u._priority || u._onInitAllProps) o = !0;
                if (u._onDisable || u._onEnable) this._notifyPluginsOfEnabled = !0
            } else {
                this._firstPT = t[i] = f = {
                    _next: this._firstPT,
                    t: e,
                    p: i,
                    f: typeof e[i] == "function",
                    n: i,
                    pg: !1,
                    pr: 0
                };
                f.s = f.f ? e[i.indexOf("set") || typeof e["get" + i.substr(3)] != "function" ? i : "get" + i.substr(3)]() : parseFloat(e[i]);
                f.c = typeof this.vars[i] == "number" ? this.vars[i] - f.s : typeof this.vars[i] == "string" ? parseFloat(this.vars[i].split("=").join("")) : 0
            }
            f && f._next && (f._next._prev = f)
        }
        if (r && this._kill(r, e)) return this._initProps(e, t, n, r);
        if (this._overwrite > 1 && this._firstPT && n.length > 1 && O(e, this, t, this._overwrite, n)) {
            this._kill(t, e);
            return this._initProps(e, t, n, r)
        }
        return o
    };
    u.render = function (e, t, n) {
        var r = this._time,
            i, s, o;
        if (e >= this._duration) {
            this._totalTime = this._time = this._duration;
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
            if (!this._reversed) {
                i = !0;
                s = "onComplete"
            }
            if (this._duration === 0) {
                (e === 0 || this._rawPrevTime < 0) && this._rawPrevTime !== e && (n = !0);
                this._rawPrevTime = e
            }
        } else if (e <= 0) {
            this._totalTime = this._time = 0;
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
            if (r !== 0 || this._duration === 0 && this._rawPrevTime > 0) {
                s = "onReverseComplete";
                i = this
                    ._reversed
            }
            if (e < 0) {
                this._active = !1;
                if (this._duration === 0) {
                    this._rawPrevTime >= 0 && (n = !0);
                    this._rawPrevTime = e
                }
            } else this._initted || (n = !0)
        } else {
            this._totalTime = this._time = e;
            if (this._easeType) {
                var u = e / this._duration,
                    a = this._easeType,
                    f = this._easePower;
                if (a === 1 || a === 3 && u >= .5) u = 1 - u;
                a === 3 && (u *= 2);
                f === 1 ? u *= u : f === 2 ? u *= u * u : f === 3 ? u *= u * u * u : f === 4 && (u *= u * u * u * u);
                a === 1 ? this.ratio = 1 - u : a === 2 ? this.ratio = u : e / this._duration < .5 ? this.ratio = u / 2 : this.ratio = 1 - u / 2
            } else this.ratio = this._ease.getRatio(e / this._duration)
        } if (this._time === r && !n) return;
        if (!this._initted) {
            this._init();
            !i && this._time && (this.ratio = this._ease.getRatio(this._time / this._duration))
        }
        this._active || this._paused || (this._active = !0);
        r === 0 && this.vars.onStart && (this._time !== 0 || this._duration === 0) && (t || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || p));
        o = this._firstPT;
        while (o) {
            o.f ? o.t[o.p](o.c * this.ratio + o.s) : o.t[o.p] = o.c * this.ratio + o.s;
            o = o._next
        }
        this._onUpdate && (t || this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || p));
        if (s && !this._gc) {
            if (i) {
                this._timeline.autoRemoveChildren && this._enabled(!1, !1);
                this._active = !1
            }
            t || this.vars[s] && this.vars[s].apply(this.vars[s + "Scope"] || this, this.vars[s + "Params"] || p)
        }
    };
    u._kill = function (e, t) {
        e === "all" && (e = null);
        if (e == null) if (t == null || t == this.target) return this._enabled(!1, !1);
        t = t || this._targets || this.target;
        var n, r, i, s, o, u, a, f;
        if ((t instanceof Array || t.jquery) && typeof t[0] == "object") {
            n = t.length;
            while (--n > -1) this._kill(e, t[n]) && (u = !0)
        } else {
            if (this._targets) {
                n = this._targets.length;
                while (--n > -1) if (t === this._targets[n]) {
                        o = this._propLookup[n] || {};
                        this._overwrittenProps = this._overwrittenProps || [];
                        r = this._overwrittenProps[n] = e ? this._overwrittenProps[n] || {} : "all";
                        break
                    }
            } else {
                if (t !== this.target) return !1;
                o = this._propLookup;
                r = this._overwrittenProps = e ? this._overwrittenProps || {} : "all"
            } if (o) {
                a = e || o;
                f = e != r && r != "all" && e != o && (e == null || e._tempKill != 1);
                for (i in a) {
                    if (s = o[i]) {
                        s.pg && s.t._kill(a) && (u = !0);
                        if (!s.pg || s.t._overwriteProps.length === 0) {
                            s._prev ? s._prev._next = s._next : s === this._firstPT && (this._firstPT = s._next);
                            s._next && (s._next._prev = s._prev);
                            s._next = s._prev = null
                        }
                        delete o[i]
                    }
                    f && (r[i] = 1)
                }
            }
        }
        return u
    };
    u.invalidate = function () {
        this._notifyPluginsOfEnabled && E._onPluginEvent("_onDisable", this);
        this._firstPT = null;
        this._overwrittenProps = null;
        this._onUpdate = null;
        this._initted = this._active = this._notifyPluginsOfEnabled = !1;
        this._propLookup = this._targets ? {} : [];
        return this
    };
    u._enabled = function (e, t) {
        if (e && this._gc) if (this._targets) {
                var n = this._targets.length;
                while (--n > -1) this._siblings[n] = A(this._targets[n], this, !0)
            } else this._siblings = A(this.target, this, !0);
        y.prototype._enabled.call(this, e, t);
        return this._notifyPluginsOfEnabled && this._firstPT ? E._onPluginEvent(e ? "_onEnable" : "_onDisable", this) : !1
    };
    E.to = function (e, t, n) {
        return new E(e, t, n)
    };
    E.from = function (e, t, n) {
        n.runBackwards = !0;
        n.immediateRender != 0 && (n.immediateRender = !0);
        return new E(e, t, n)
    };
    E.fromTo = function (e, t, n, r) {
        r.startAt = n;
        n.immediateRender && (r.immediateRender = !0);
        return new E(e, t, r)
    };
    E.delayedCall = function (e, t, n, r, i) {
        return new E(t, 0, {
            delay: e,
            onComplete: t,
            onCompleteParams: n,
            onCompleteScope: r,
            onReverseComplete: t,
            onReverseCompleteParams: n,
            onReverseCompleteScope: r,
            immediateRender: !1,
            useFrames: i,
            overwrite: 0
        })
    };
    E.set = function (e, t) {
        return new E(e, 0, t)
    };
    E.killTweensOf = E.killDelayedCallsTo = function (e, t) {
        var n = E.getTweensOf(e),
            r = n.length;
        while (--r > -1) n[r]._kill(t, e)
    };
    E.getTweensOf = function (e) {
        if (e == null) return;
        var t, n, r, i;
        if ((e instanceof Array || e.jquery) && typeof e[0] == "object") {
            t = e.length;
            n = [];
            while (--t > -1) n = n.concat(E.getTweensOf(e[t]));
            t = n.length;
            while (--t > -1) {
                i = n[t];
                r = t;
                while (--r > -1) i === n[r] && n.splice(t, 1)
            }
        } else {
            n = A(e).concat();
            t = n.length;
            while (--t > -1) n[t]._gc && n.splice(t, 1)
        }
        return n
    };
    var _ = c("plugins.TweenPlugin", function (e, t) {
        this._overwriteProps = (e || "").split(",");
        this._propName = this._overwriteProps[0];
        this._priority = t || 0
    }, !0);
    u = _.prototype;
    _.version = 12;
    _.API = 2;
    u._firstPT = null;
    u._addTween = function (e, t, n, r, i, s) {
        var o;
        if (r != null && (o = typeof r == "number" || r.charAt(1) !== "=" ? Number(r) - n : Number(r.split("=").join("")))) {
            this._firstPT = {
                _next: this._firstPT,
                t: e,
                p: t,
                s: n,
                c: o,
                f: typeof e[t] == "function",
                n: i || t,
                r: s
            };
            this._firstPT._next && (this._firstPT._next._prev = this._firstPT)
        }
    };
    u.setRatio = function (e) {
        var t = this._firstPT,
            n;
        while (t) {
            n = t.c * e + t.s;
            t.r && (n = n + (n > 0 ? .5 : -0.5) >> 0);
            t.f ? t.t[t.p](n) : t.t[t.p] = n;
            t = t._next
        }
    };
    u._kill = function (e) {
        if (e[this._propName] != null) this._overwriteProps = [];
        else {
            var t = this._overwriteProps.length;
            while (--t > -1) e[this._overwriteProps[t]] != null && this._overwriteProps.splice(t, 1)
        }
        var n = this._firstPT;
        while (n) {
            if (e[n.n] != null) {
                n._next && (n._next._prev = n._prev);
                if (n._prev) {
                    n._prev._next = n._next;
                    n._prev = null
                } else this._firstPT === n && (this._firstPT = n._next)
            }
            n = n._next
        }
        return !1
    };
    u._roundProps = function (e, t) {
        var n = this._firstPT;
        while (n) {
            if (e[this._propName] || n.n != null && e[n.n.split(this._propName + "_").join("")]) n.r = t;
            n = n._next
        }
    };
    E._onPluginEvent = function (e, t) {
        var n = t._firstPT,
            r;
        if (e === "_onInitAllProps") {
            var i, s, o, u;
            while (n) {
                u = n._next;
                i = s;
                while (i && i.pr > n.pr) i = i._next;
                (n._prev = i ? i._prev : o) ? n._prev._next = n : s = n;
                (n._next = i) ? i._prev = n : o = n;
                n = u
            }
            n = t._firstPT = s
        }
        while (n) {
            n.pg && typeof n.t[e] == "function" && n.t[e]() && (r = !0);
            n = n._next
        }
        return r
    };
    _.activate = function (e) {
        var t = e.length;
        while (--t > -1) e[t].API === _.API && (E._plugins[(new e[t])._propName] = e[t]);
        return !0
    };
    if (r = e._gsQueue) {
        for (i = 0; i < r.length; i++) r[i]();
        for (u in f) f[u].def || console.log("Warning: TweenLite encountered missing dependency: com.greensock." + u)
    }
})(window);