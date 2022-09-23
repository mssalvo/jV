/*!
 * jV ©
 * @version 1.0.0
 * @author salvatore mariniello - salvo.mariniello@gmail.com 
 * https://github.com/mssalvo/jV
 * MIT License
 * Copyright (c) 2022 Salvatore Mariniello
 * https://github.com/mssalvo/jV/blob/main/LICENSE
 * @requires Third-party software dependency
 * jQuery Foundation, licenza MIT https://jquery.com/
 * */

(function () {
    if (typeof window.console === 'undefined' || typeof window.console.log === 'undefined') {
        window.console = { log: function () { } };
    }
    window.jQuery || console.log('jV Info :: jQuery not istance! > check include jquery.js')
})();


class jV {
    constructor() {
        this.count = 0;
        this.getObject = undefined;
        this.supplTemplateName = undefined;
        this.supplBoxView = undefined;
        this.templateAppName = undefined;
        this.fnDone = undefined;
        this.eventHandlers = {};
        this.home = undefined;
        this.data = {};
        this.ajax_ = {
            type: "get",
            url: undefined,
            dataType: "json"
        };
        this.isPreload = true;
        this.preload = `<div id="jvpreloader">
<div class="jvloader">
    <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="3" stroke-miterlimit="10" />
    </svg>
</div>
</div>`;
        this.cssStyle = `<style id="jvStyle">
#jvpreloader {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999999999;
    background: #fff;
  }
.jvloader {
    position: absolute;
    width: 5rem;
    height: 10rem;
    top: 50%;
    margin: 0 auto;
    left: 0;
    right: 0;
    transform: translateY(-50%); }
.circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto; }
.path {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
    stroke-linecap: round; }
svg {
    overflow: hidden;
    vertical-align: middle; }  
 ${this.supplBoxView} { min-height:200px;position:relative;overflow: hidden;} 
</style>`;

        this.islog = false;
        this.current = 'index';
        this.space = ' ';
        this.txtSpace = ' ';
        this.divisor = '@@';
        this.pipe = '|';
        this.htmlTemplate = {};
        this.htmlAppTemplate = {};
        this._ = jQuery;
        this.fn = {
            pp: {
                trim: function (v) {
                    return typeof v !== "undefined" ? String(v).replace(/^\s+|\s+$/gm, '') : '';
                },
                length: function (v) {
                    return typeof v !== "undefined" ? String(v).length : '';
                },
                toLowerCase: function (v) {
                    return typeof v !== "undefined" ? String(v).toLowerCase() : '';
                },
                toUpperCase: function (v) {
                    return typeof v !== "undefined" ? String(v).toUpperCase() : '';
                },
                capitalizeAll: function (v) {
                    return typeof v !== "undefined" ? String(v).toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
                        return a.toUpperCase();
                    }) : '';
                },
                capitalizeLower: function (v) {
                    return typeof v !== "undefined" ? String(v).replace(/^\s+|\s+$/gm, '').charAt(0).toUpperCase() + String(v).replace(/^\s+|\s+$/gm, '').substr(1).toLowerCase() : '';
                },
                capitalize: function (v) {
                    return typeof v !== "undefined" ? String(v).replace(/^\s+|\s+$/gm, '').charAt(0).toUpperCase() + String(v).replace(/^\s+|\s+$/gm, '').substr(1) : '';
                },
                toBoolean: function (v) {
                    v = typeof v !== "undefined" ? String(v).toLowerCase().split(' ').join('').split('0').join('') : '';
                    v = isNaN(v) ? v : Math.max(Number(v), 0);
                    return String(v) === '1' ? true : String(v) === 'true' ? true : String(v) !== '' && String(v) !== '0' && String(v) !== 'false' && String(v) !== 'off' && String(v) !== 'not' && String(v) !== 'no' && String(v) !== 'f' ? true : false;
                },
                toFixed: function (v) {
                    return typeof v !== "undefined" ? !isNaN(v) ? Number(v).toFixed() : v : '';
                },
                toFixed2D: function (v) {
                    return typeof v !== "undefined" ? !isNaN(v) ? Number(v).toFixed(2) : v : '';
                },
                toFixed3D: function (v) {
                    return typeof v !== "undefined" ? !isNaN(v) ? Number(v).toFixed(3) : v : '';
                },
                toFixed4D: function (v) {
                    return typeof v !== "undefined" ? !isNaN(v) ? Number(v).toFixed(4) : v : '';
                },
                toFixed5D: function (v) {
                    return typeof v !== "undefined" ? !isNaN(v) ? Number(v).toFixed(5) : v : '';
                }
            }
        };
        this.onBeforeRow = function (a, b) { return true; };
        this.onAfterRow = function () { };
        this.settingTagOption = function (m, e, o) {

            switch (m) {
                case 'html':
                    this._(e).html(o);
                    break;
                case 'append':
                    this._(e).html(o);
                    break;
                case 'text':
                    this._(e).text(o);
                    break;
                case 'selected':
                    this._(e).prop(m, o);
                    break;
                default:
                    if (this._(e).attr(m))
                        this._(e).attr(m, this._(e).attr(m) + o);
                    else
                        this._(e).attr(m, o);
            }

            return this;
        };
    }
    trim(a) {
        return a.replace(/^\s+|\s+$/gm, '');
    };
    removeProperty(ob, reg) {
        if (ob && ob.attributes) {
            var u = [];
            for (var j = 0; j < ob.attributes.length; j++) {
                (function (i, a) {
                    if (a.attributes[i] && reg.test(a.attributes[i].name)) {
                        u.push(a.attributes[i].name);

                    }
                })(j, ob)

            }
            for (var y = 0; y < u.length; y++) {
                (function (i, a) {
                    a.removeAttribute(u[i]);
                })(y, ob)
            }

        }

        return this;
    };
    propert(prop) {
        var p = prop.split(".");
        if (p.length) {
            return { key: p[0], val: p[1] }
        } else {
            return { key: p[0], val: p[0] }
        }
    };
    settingTagInput(m, e, o) {
        switch (m) {
            case 'value':
                this._(e).val(o)
                break;
            case 'checked':
                this._(e).prop(m, o)
                break;
            case 'disabled':
                this._(e).prop(m, o)
                break;
            default:
                if (this._(e).attr(m))
                    this._(e).attr(m, this._(e).attr(m) + o)
                else
                    this._(e).attr(m, o)

        }
        return this;
    };
    settingTag(m, e, o) {
        switch (m) {
            case 'html':
                this._(e).html(o);
                break;
            case 'after':
                this._(e).after(/^<(\w+)\s*\/?>(?:.* <\/\1>|)/.test(o ? o : document.createTextNode(o)));
                break;
            case 'before':
                this._(e).before(/^<(\w+)\s*\/?>(?:.* <\/\1>|)/.test(o) ? o : document.createTextNode(o));
                break;
            case 'append':
                this._(e).append(o);
                break;
            case 'text':
                this._(e).text(o);
                break;
            case 'checked':
                this._(e).prop(m, o);
                break;
            default:
                if (this._(e).attr(m))
                    this._(e).attr(m, this._(e).attr(m) + o);
                else
                    this._(e).attr(m, o);

        }
        return this;
    };
    isAttributeForProp(attrs) {
        for (var a in attrs) {
            if (attrs[a] && /(for-property|for-property\-.*)+$/.test(attrs[a].name)) {
                return 1;
            }
        }
        return 0;
    };
    isAttributeWrite(attrs) {
        for (var a in attrs) {
            if (attrs[a] && /(jv-write|jv-write-.*)+$/.test(attrs[a].name)) {
                return 1;
            }
        }
        return 0;
    };
    getHtmlTemplate(k) {
        return this.htmlTemplate[k];
    };
    setHtmlTemplate(k, v) {
        this.htmlTemplate[k] = v;
    };
    getAppTemplate(k) {
        return this.htmlAppTemplate[k];
    };
    setAppTemplate(k, v) {
        this.htmlAppTemplate[k] = v;
    };
    searchHtlmTemplate(o) {
        var t_ = this;
        Array.prototype.forEach.call((o || document).querySelectorAll('[jv-template]'), function (el, i) {
            t_.setHtmlTemplate(el.getAttribute('jv-template'), el.innerHTML);
            t_._(el).hide();
        });
        return t_;
    };
    searchTemplateApp(o) {
        var t_ = this;
        Array.prototype.forEach.call((o || document).querySelectorAll('[jv-app]'), function (el, i) {
            t_.setAppTemplate(el.getAttribute('jv-app'), el);
        });
        return t_;
    };
    updateObject(elm_, elementForEach, t, data) {
        var t_ = this;
        if (elm_) {
            for (var att = 0; att < elm_.attributes.length; att++) {
                (function (att, elm_, t, data) {
                    if (elm_.attributes[att] && /(for-property|for-property\-.*)+$/.test(elm_.attributes[att].name)) {
                        var mt_ = elm_.attributes[att].name.split('for-property-');
                        var exps = elm_.attributes[att].value.split(',');

                        if (exps) {
                            for (var e in exps) {
                                if (elm_['nodeType'] === 1) {
                                    var propert = exps[e].split('.')[0];

                                    switch (propert) {

                                        case elementForEach:
                                            if (elm_['nodeName'] === 'INPUT') {
                                                if (mt_[1]) {
                                                    t_.settingTagInput(mt_[1], elm_, t_.getObjVal(exps, e, data, elementForEach, t));
                                                } else {
                                                    elm_['value'] = t_.getObjVal(exps, e, data, elementForEach, t);
                                                }
                                            } else if (elm_['nodeName'] === 'OPTION') {
                                                if (mt_[1]) {
                                                    t_.settingTagOption(mt_[1], elm_, t_.getObjVal(exps, e, data, elementForEach, t));

                                                } else {
                                                    t_._(elm_).html(t_.getObjVal(exps, e, data, elementForEach, t));
                                                }
                                            } else {
                                                if (mt_[1]) {

                                                    t_.settingTag(mt_[1], elm_, t_.getObjVal(exps, e, data, elementForEach, t));

                                                } else {

                                                    t_._(elm_).append(t_.getObjVal(exps, e, data, elementForEach, t));
                                                }
                                            }
                                            break;

                                        default:
                                            if (exps[e].split('.').length < 2) {
                                                if (elm_['nodeName'] === 'INPUT') {
                                                    if (mt_[1] && mt_[1] === "value") {
                                                        elm_[mt_[1]] = t_.data[exps[e].split('.')[0]];
                                                    } else if (mt_[1]) {

                                                        t_.settingTagInput(mt_[1], elm_, data[exps[e].split('.')[0]]);
                                                    } else {
                                                        elm_['value'] = data[exps[e].split('.')[0]];
                                                    }
                                                } else if (elm_['nodeName'] === 'OPTION') {
                                                    if (mt_[1]) {

                                                        t_.settingTagOption(mt_[1], elm_, data[exps[e].split('.')[0]]);

                                                    } else {
                                                        t_._(elm_).html(data[exps[e].split('.')[0]]);
                                                    }
                                                } else {
                                                    if (mt_[1]) {

                                                        t_.settingTag(mt_[1], elm_, data[exps[e].split('.')[0]]);

                                                    } else {
                                                        t_._(elm_).append(data[exps[e].split('.')[0]]);
                                                    }
                                                }
                                            } else if (exps[e].split('.').length > 1) {

                                                if (elm_['nodeName'] === 'INPUT') {

                                                    if (mt_[1]) {
                                                        t_.settingTagInput(mt_[1], elm_, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                    } else {
                                                        elm_['value'] = data[exps[e].split('.')[0]][exps[e].split('.')[1]];
                                                    }
                                                } else if (elm_['nodeName'] === 'OPTION') {
                                                    if (mt_[1]) {

                                                        t_.settingTagOption(mt_[1], elm_, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);


                                                    } else {
                                                        t_._(elm_).html(data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                    }
                                                } else {

                                                    if (mt_[1]) {

                                                        t_.settingTag(mt_[1], elm_, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);

                                                    } else if (!t_.isUndefined(data[exps[e].split('.')[0]])) {
                                                        t_._(elm_).append(data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                    }
                                                }

                                            }

                                    }
                                }
                            }
                        }
                    }

                })(att, elm_, t, data)
            }

            this.removeProperty(elm_, new RegExp(/(for-property|for-property\-.*)+$/));
        }
    };
    getValProp(exp, obj, n, isObj) {
        var chars = [];
        var t_ = this;
        var props = exp.split(t_.divisor);
        for (var p in props) {
            var strp_ = props[p], fnp = undefined;
            if (String(strp_).indexOf(t_.pipe) !== -1) {
                strp_ = props[p].split(t_.pipe)[0];
                fnp = props[p].split(t_.pipe)[1].split(' ').join('');
            }
            if (strp_ === t_.current)
                chars.push(n);
            if (strp_ === t_.space)
                chars.push(t_.txtSpace);
            if (strp_.indexOf(' ') !== -1 && strp_.length > 2 && strp_.indexOf("$") !== -1)
                chars.push(strp_.split("$").join('.'));
            if (strp_.split(' ').join('') !== '' && isObj && typeof obj[strp_] !== "undefined")
                try {
                    var j = strp_.split(' ').join('');
                    var val = eval('(' + 'obj' + '.' + j + ')');
                    if (typeof val !== "undefined" && typeof fnp !== "undefined")
                        chars.push(typeof t_.fn['pp'][fnp] === "function" ? t_.fn['pp'][fnp].apply(this, [val, obj, n]) : val);
                    if (typeof val !== "undefined" && typeof fnp === "undefined")
                        chars.push(val);
                    if (!isObj && typeof obj !== "undefined")
                        if (typeof fnp !== "undefined")
                            chars.push(typeof t_.fn['pp'][fnp] === "function" ? t_.fn['pp'][fnp].apply(this, [obj, t_.data, n]) : obj);
                    if (!isObj && typeof obj !== "undefined" && typeof fnp === "undefined")
                        chars.push(obj);
                } catch (err) {
                    console.log(j, err);
                }
        }
        return chars.join('');
    };
    getObjVal(exp, e, a, b, n) {
        var t_ = this, u = exp[e].split('.');
        if (u.length < 2) {
            if (String(exp[e]).indexOf(t_.divisor) !== -1) {
                return t_.getValProp(exp[e], a[b][n], n, false);
            } else if (exp[e] === t_.current)
                return n;
            else if (exp[e] === t_.space)
                return t_.txtSpace;
            else if (String(exp[e]).indexOf(t_.pipe) !== -1) {
                var fn_ = exp[e].split(t_.pipe)[1].split(' ').join('');
                return typeof t_.fn['pp'][fn_] === "function" ? t_.fn['pp'][fn_].apply(this, [a[b][n], a[b], n]) : a[b][n];
            } else
                return a[b][n];
        } else {

            if (String(u[1]).indexOf(t_.divisor) !== -1) {
                return t_.getValProp(u[1], a[b][n], n, true);
            }
            if (u[1] === t_.current)
                return n;
            if (u[1] === t_.space)
                return t_.txtSpace;

            var prop = exp[e].split('.').slice(1).join('.'), fnp = undefined;
            if (String(prop).indexOf(t_.pipe) !== -1) {
                fnp = prop.split(t_.pipe)[1].split(' ').join('');
                prop = prop.split(t_.pipe)[0].split(' ').join('');
            }

            var propObj = a[b][n];

            if (typeof propObj !== "undefined")
                var val = eval('(' + 'propObj' + '.' + prop + ')');
            if (typeof val !== "undefined" && typeof fnp !== "undefined")
                return typeof t_.fn['pp'][fnp] === "function" ? t_.fn['pp'][fnp].apply(this, [val, propObj, n]) : val;
            if (typeof val !== "undefined" && typeof fnp === "undefined")
                return val;
            return "";

        }
    };
    valueProperty(exps) {
        var t_ = this;
        var chars = [];

        if (typeof exps !== "undefined" && exps !== "") {
            ++t_.count;
            if (String(exps).indexOf(t_.divisor) !== -1) {
                var props = exps.split(t_.divisor);
                for (var p in props) {
                    var strp_ = props[p], fnp = undefined;
                    if (String(strp_).indexOf(t_.pipe) !== -1) {
                        strp_ = props[p].split(t_.pipe)[0];
                        fnp = props[p].split(t_.pipe)[1].split(' ').join('');
                    }
                    if (strp_ === t_.current)
                        chars.push(t_.count);
                    else if (strp_ === t_.space)
                        chars.push(t_.txtSpace);
                    else if (strp_.indexOf(' ') !== -1 && strp_.length > 2)
                        chars.push(strp_);
                    else if (strp_.split(' ').join('') !== '') {
                        try {
                            var j = strp_.split(" ").join("");
                            var val = eval('(' + 't_.data' + '.' + j + ')');
                            if (typeof val !== "undefined" && typeof fnp !== "undefined")
                                chars.push(typeof t_.fn['pp'][fnp] === "function" ? t_.fn['pp'][fnp].apply(this, [val, t_.data]) : val);
                            if (typeof val !== "undefined" && typeof fnp === "undefined")
                                chars.push(val);
                        } catch (err) {
                            console.log(j, err);
                        }
                    }
                }
                return chars.join('');
            } else {
                try {
                    exps = exps.split(" ").join("");
                    var strp_ = exps, fnp_ = undefined;
                    if (String(exps).indexOf(t_.pipe) !== -1) {
                        strp_ = exps.split(t_.pipe)[0];
                        fnp_ = exps.split(t_.pipe)[1].split(' ').join('');
                    }
                    var val_ = eval('(' + 't_.data' + '.' + strp_ + ')');
                    if (typeof val_ !== "undefined" && typeof fnp_ !== "undefined")
                        return typeof t_.fn['pp'][fnp_] === "function" ? t_.fn['pp'][fnp_].apply(this, [val_, t_.data]) : val_;
                    if (typeof val_ !== "undefined")
                        return val_;
                } catch (err) {
                    console.log(exps, err);
                }
                return "";
            }
        }
        return "";
    };
    updateProperty(elm_) {
        var t_ = this;
        if (elm_) {
            for (var att = 0; att < elm_.attributes.length; att++) {
                (function (elm_, attribute) {
                    if (attribute && /(jv-write|jv-write-.*)+$/.test(attribute.name)) {
                        var mt_ = attribute.name.split('jv-write-')
                        var exps = attribute.value.split(',');
                        if (exps) {
                            for (var e in exps) {
                                if (elm_['nodeType'] === 1) {
                                    if (elm_['nodeName'] === 'INPUT') {
                                        if (mt_[1]) {
                                            t_.settingTagInput(mt_[1], elm_, t_.valueProperty(exps[e]));

                                        } else {
                                            elm_['value'] = t_.valueProperty(exps[e]);
                                        }
                                    } else if (elm_['nodeName'] === 'OPTION') {
                                        if (mt_[1]) {
                                            t_.settingTagOption(mt_[1], elm_, t_.valueProperty(exps[e]));
                                        } else {
                                            t_._(elm_).html(t_.valueProperty(exps[e]));
                                        }
                                    } else {
                                        if (mt_[1]) {
                                            t_.settingTag(mt_[1], elm_, t_.valueProperty(exps[e]));
                                        } else {
                                            t_._(elm_).append(t_.valueProperty(exps[e]));
                                        }
                                    }
                                }
                            }
                        }
                    }
                })(elm_, elm_.attributes[att])
            }
            t_.removeProperty(elm_, new RegExp(/(jv-write|jv-write-.*)+$/));
        }
    };
    writeProperty(o) {
        var t_ = this;
        var forProperty = [];
        Array.prototype.forEach.call(o.getElementsByTagName('*'), function (el, i) {
            if (t_.isAttributeWrite(el.attributes)) {
                forProperty['jv-write-' + i] = { obj: el };
            }
        });
        var ar_ = forProperty;
        for (var x in ar_) {
            (function (a) {
                t_.updateProperty(a);
            })(ar_[x]['obj'])
        }
        return true;
    };
    isUndefined(t) {
        return null === t ? !0 : t ? "undefined" === typeof t : !0;
    };
    isArrayNative(a) {
        return !!a && (typeof a === "object" || typeof a === "function") && "length" in a && !("setInterval" in a) && (Object.prototype.toString.call(a) === "[object Array]" || "callee" in a || "item" in a);
    };
    array(b) {
        if (!this.isArrayNative(b))
            return [b];
        if (b.item) {
            var a = b.length, c = new Array(a);
            while (a--)
                c[a] = b[a];
            return c;
        }
        return Array.prototype.slice.call(b);
    };
    set(val, n) {
        var l = val.split('.');
        switch (l.length) {
            case 1:
                return this.data[l[0]];

            case 2:
                return this.data[l[0]][n][l[1]];

            case 3:
                return this.data[l[0]][n][l[1]][l[2]];
            default:
                return [];
        }

        return this;
    };
    isforEach(o) {
        var elementsForEach = [], t_ = this;

        Array.prototype.forEach.call(o.querySelectorAll('[jv-foreach]'), function (el, i) {
            elementsForEach[el.getAttribute('jv-foreach')] = { attr: el.getAttribute('jv-foreach'), exp: [], obj: el };
            el.removeAttribute('jv-foreach');
            t_.isforEach(el);
        });

        if (typeof (t_.onBeforeRow) === "undefined" || typeof (t_.onBeforeRow) !== "function")
            t_.onBeforeRow = function (a, b) {
                return true;
            }

        var ary = elementsForEach;
        for (var x in ary) {
            var ctx_data = {}, key = x.split('.').pop();
            ctx_data[key] = [];
            if (x.split('.').length > 1) {
                ctx_data[key] = eval('(' + 't_.data' + '.' + x + ')');

            } else {
                ctx_data[key] = t_.set(x, 0);
            }

            for (var t in ctx_data[key]) {

                var clone = t_._(ary[x]['obj']).clone().get(0);
                var elmts = t_.array(clone.getElementsByTagName('*'));
                if (t_.onBeforeRow(clone, ctx_data[key][t], t)) {
                    if (!elmts.length) {
                        ary[x]['exp'] = [clone];
                    } else {
                        ary[x]['exp'] = elmts;
                    }
                    for (var y in ary[x]['exp']) {
                        var elm_ = ary[x]['exp'][y];
                        if (t_.isAttributeForProp(elm_.attributes)) {
                            (function (a, b, c, data) {
                                t_.updateObject(a, b, c, data);
                            })(ary[x]['exp'][y], key, t, ctx_data)
                        }
                    }

                    t_._(ary[x]['obj']).parent().append(clone);
                    t_.writeProperty(clone);
                    t_.initHtmlEvent(clone);

                    t_.removeProperty(clone, new RegExp(/(for-property|for-property\-.*)+$/));

                    if (typeof (t_.onAfterRow) !== "undefined" || typeof (t_.onAfterRow) === "function")
                        t_.onAfterRow(clone, ctx_data[key][t], t);
                }

            }
            t_._(ary[x]['obj']).remove();
        }

        return t_;
    };
    setData(data) {
        var t_ = this;
        if (typeof data !== "undefined")
            t_.data = t_.isArray(data) ? { data: data } : data;
        else
            console.log("the setData function [data] is undefined!");
        return t_;
    };
    setTemplateName(supplTemplateName) {
        var t_ = this;
        if (typeof supplTemplateName !== "undefined")
            t_.supplTemplateName = supplTemplateName;
        else
            console.log("function setTemplateName [supplTemplateName] is undefined!");
        return t_;
    };
    setBoxView(supplBoxView) {
        var t_ = this;
        if (typeof supplBoxView !== "undefined")
            t_.supplBoxView = supplBoxView;
        else
            console.log("function setBoxView [supplBoxView] is undefined!");
        return t_;
    };
    setAppName(templateAppName) {
        var t_ = this;
        if (typeof templateAppName !== "undefined")
            t_.templateAppName = templateAppName;
        else
            console.log("function setAppName [templateAppName] is undefined!")
        return t_;
    };
    produceView(templateName, data, objV) {
        var t_ = this;
        t_.searchHtlmTemplate(document).data = data;
        var exl = t_._(t_.getHtmlTemplate(templateName)).get();
        t_._(objV).html(exl);
        t_.isforEach(objV);
        t_.writeProperty(document);
        t_.initHtmlEvent(objV);
        return this;
    };
    setIsPreload(b) {
        var t_ = this;
        if (typeof b !== "undefined")
            t_.isPreload = b;
        else
            console.log("function setIsPreload [isPreload] is undefined!")
        return t_;
    };
    setHtmlPreload(html) {
        var t_ = this;
        if (typeof html !== "undefined")
            t_.preload = html;
        else
            console.log("function setHtmlPreload [html] is undefined!")
        return t_;
    };
    setCssPreload(css) {
        var t_ = this;
        if (typeof html !== "undefined")
            t_.cssStyle = html;
        else
            console.log("function setCssPreload [css] is undefined!")
        return t_;
    };
    isArray(obj) {
        return obj.constructor.toString().indexOf("Array") > -1;
    };
    getHtml() {
        var t_ = this;
        if (typeof t_.getObject !== "undefined")
            return t_.getObject.innerHTML;
        else
            return "";
    };
    dataFilter(o) { return o; };
    setDataFilter(f) {
        var t_ = this;
        if (typeof f !== "undefined" && typeof f === "function")
            t_.dataFilter = f;

        return t_;
    };
    setAjaxSetting(obj) {
        var t_ = this;
        if (typeof obj !== "undefined")
            t_.ajax_ = obj;

        return t_;
    };
    setUrl(url) {
        var t_ = this;
        if (typeof url !== "undefined" && typeof url === "string")
            t_.ajax_.url = url;

        return t_;
    };
    find(o) {
        var t_ = this;
        if (t_.isPreload) {
            t_._(t_.supplBoxView).html(t_.preload).append(t_.cssStyle);
        }
        t_._.ajax(t_.ajax_).done(function (data, textStatus, xhr) {
            if (o && o.obj) {
                t_.setData(data[o.obj]);
            }

            else {
                t_.setData(t_.dataFilter(data));
            }


            if (typeof t_.templateAppName !== "undefined") {
                t_.executeApp();
            }
            else {
                t_.executeView();
            }

        })
            .fail(function (xhr, textStatus, thrownError) {
                console.log(xhr.status);
                console.log(textStatus);
                console.log(thrownError);
            })
            .always(function (data_xhr, textStatus, xhr_errorThrown) {
                if (t_.islog)
                    console.log("[jV:find request ajax] always: complete ", t_.ajax_, textStatus);
                
            });

        return t_;
    }
    createView(o) {
        var t_ = this;

        if (typeof o !== "undefined") {
            if (typeof o.dataFilter !== "undefined" && typeof o.dataFilter === "function") {
                t_.dataFilter = o.dataFilter;
            }
            if (typeof o.jvTemplate !== "undefined") {
                t_.setTemplateName(o.jvTemplate)
            }
            if (typeof o.data !== "undefined") {
                t_.setData(o.data);
            }
            if (typeof o.box !== "undefined") {
                t_.setBoxView(o.box);
            }
            if (typeof o.jvApp !== "undefined") {
                t_.setAppName(o.jvApp);
            }
            if (typeof o.isPreload !== "undefined") {
                t_.setIsPreload(o.isPreload);
            }
            if (typeof o.htmlPreload !== "undefined") {
                t_.setHtmlPreload(o.htmlPreload);
            }
            if (typeof o.cssPreload !== "undefined") {
                t_.setCssPreload(o.cssPreload);
            }

        }
        if (typeof o !== "undefined" && typeof o.url !== "undefined") {
            t_.ajax_.url = o.url;
            return t_.find(o);

        } else if (typeof t_.ajax_.url !== "undefined" && typeof t_.ajax_.url === "string") {
            return t_.find(o);
        } else {

            if (typeof t_.templateAppName !== "undefined") { return t_.executeApp(); }
            else { return t_.executeView(); }
        }
    };
    executeView() {
        var t_ = this;

        var objBox = t_.supplBoxView;
        if (typeof t_.supplBoxView === "undefined")
            objBox = t_._("<div class='jv-support-view' style='display:none'></div>").get(0);
        if (typeof t_.supplTemplateName !== "undefined") {
            if (typeof t_.supplBoxView === "string")
                objBox = t_._(t_.supplBoxView).get(0);
            if (t_.data !== "undefined") {
                t_.searchHtlmTemplate(document);
                var exl = t_._(t_.getHtmlTemplate(t_.supplTemplateName)).get();
                t_._(objBox).html(exl);
                t_.isforEach(objBox);
                t_.writeProperty(objBox);
                t_.initHtmlEvent(objBox);
                t_.getObject = objBox;
            }
            if (typeof t_.data === "undefined")
                console.log('jV Info[ Method:getView] object data is undefined! > exit!!');
        }
        if (typeof t_.supplTemplateName === "undefined") {
            console.log('jV Info[ Method:getView] templateName is undefined! > exit!!');
        }
        if (typeof t_.fnDone !== "undefined" && typeof t_.fnDone === "function")
            t_.fnDone.apply(t_, [exl]);


        return t_;
    };
    executeApp() {
        var t_ = this;

        if (typeof t_.templateAppName !== "undefined") {

            if (t_.data !== "undefined") {
                t_.searchTemplateApp(document);
                var exl = t_.getAppTemplate(t_.templateAppName);
                t_.isforEach(exl);
                t_.writeProperty(exl);
                t_.initHtmlEvent(exl);
                t_.getObject = exl;
            }
            if (typeof t_.data === "undefined")
                console.log('jV Info[ Method:getView] object data is undefined! > exit!!');
        }
        if (typeof t_.templateAppName === "undefined") {
            console.log('jV Info[ Method:getView] templateAppName is undefined! > exit!!');
        }
        if (typeof t_.fnDone !== "undefined" && typeof t_.fnDone === "function")
            t_.fnDone.apply(t_, [exl]);

        return t_;
    };
    viewLog(b) {
        var t_ = this;
        t_.islog = b;
        return t_;
    };
    viewDone(fn) {
        var t_ = this;
        this.fnDone = fn;
        return t_;
    };
    viewEvent(name, fn) {
        var t_ = this;

        if (typeof name !== "undefined" && name !== 'pp') {
            t_.fn[name] = fn;
        } else
            console.log("INFO!! it is not possible to associate a function with the name (pp) - change function name! - the function [pp] could not be subscribed!! ");

        return t_;
    };
    viewPipe(name, fn) {
        var t_ = this;
        if (typeof name !== "undefined")
            t_.fn['pp'][name] = fn;
        else
            console.log("the jVPipe function could not be subscribed, name is undefined!");
        return t_;
    };
    initHtmlEvent(o) {
        var t_ = this, __proto = t_;
        var evs = t_.searchHtmlEvent(o);
        // jv-event="click:testfunc"
        for (var k in evs) {
            var par = k.split("-")[0],
                evt = t_.trim(jV.expEvent.exec(par)[0]),
                ctr = 'fn',
                action = jV.expAction.exec(par)[1],
                types = ctr.split(" ").join(""),
                action = action.split(" ").join(""),
                obj = evs[k],
                events = evt.split(" ");
            obj.removeAttribute('jv-event');
            for (var s in events) {
                (function (t, act, arg, t_) {
                    t_.bind(obj, events[s], __proto[t][(function (a) {
                        return a;
                    })(act)], obj, arg, t_);
                })(types, action, t_.home, t_)
            }

        }
    };
    searchHtmlEvent(o) {
        var evts = [];
        Array.prototype.forEach.call(o.querySelectorAll("[jv-event]"), function (el, i) {
            evts[el.getAttribute("jv-event") + "-" + i] = el;
        })
        return evts;
    };
    addListener(node, event, handler, capture = false) {
        var t_ = this;
        if (!(event in t_.eventHandlers)) {
            t_.eventHandlers[event] = [];
        }
        t_.eventHandlers[event].push({ node: node, handler: handler, capture: capture });
        node.addEventListener(event, handler, capture);
    };
    removeAllListeners(targetNode, event) {
        var t_ = this;
        if (typeof t_.eventHandlers[event] !== "undefined") {
            t_.eventHandlers[event]
                .filter(({ node }) => node === targetNode)
                .forEach(({ node, handler, capture }) => node.removeEventListener(event, handler, capture));
            t_.eventHandlers[event] = t_.eventHandlers[event].filter(
                ({ node }) => node !== targetNode,
            );
        }
    };
    event(o, e, f, b) {
        var t_ = this;
        if (o.attachEvent) {
            o.attachEvent("on" + e, f)
        } else if (o.addEventListener) {
            t_.removeAllListeners(o, e);
            t_.addListener(o, e, f, b);
        } else {
            o["on" + e] = f
        }
        return t_;
    };
    bindPro(f, o) {
        if (f.bind === Function.prototype.bind && Function.prototype.bind)
            return Function.prototype.bind.apply(f, Array.prototype.slice.call(arguments, 1));

        var n = Array.prototype.slice.call(arguments, 2);

        return function () {
            return f.apply(o, n.concat(Array.prototype.slice.call(arguments)))
        }
    };
    bind(o, e, f, a, arg, t_) {
        var t__ = this;
        var n = (new String(e)).split(" ");
        for (var r = 0; r < n.length; r++) {
            t__.event(o, n[r], t__.bindPro(f, a, arg, t_), true)
        }
        return t__;
    };


} 

jV.get = {};
jV.expControll = new RegExp(/:\ *(\w+)\s*\@(:\1@|)/);
jV.expEvent = new RegExp(/^([a-z \ *]|:\1:)+/);
jV.expAction = new RegExp(/:\ *(\w+)\s*\/?(:.*\1.|)/);
jV.istance = function (n) {
    if (typeof (n) === "undefined")
        n = new Date().getTime();
    if (typeof (jV.get[n]) === "undefined")
        jV.get[n] = new jV();
    return jV.get[n];
};
