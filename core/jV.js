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

function jV() {
    this.count = 0;
    this.getObject = undefined;
    this.supplTemplateName = undefined;
    this.supplBoxView = undefined;
    this.templateAppName = undefined;
    this.fnDone = undefined;
}
jV.prototype.home = undefined;
jV.prototype.data = {};
jV.prototype.ajax_ = {
    type:"get",
    url: undefined,
    dataType:"json"
};
jV.prototype.islog = false;
jV.prototype.current = 'index';
jV.prototype.space = ' ';
jV.prototype.txtSpace = ' ';
jV.prototype.divisor = '@@';
jV.prototype.pipe = '|';
jV.prototype.htmlTemplate = {};
jV.prototype.htmlAppTemplate = {};
jV.prototype._ = jQuery;
jV.expControll = new RegExp(/:\ *(\w+)\s*\@(:\1@|)/);
jV.expEvent = new RegExp(/^([a-z \ *]|:\1:)+/);
jV.expAction = new RegExp(/:\ *(\w+)\s*\/?(:.*\1.|)/);
jV.get = {};
jV.prototype.fn = {
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
jV.prototype.trim = function (a) {
    return a.replace(/^\s+|\s+$/gm, '');
};

jV.eventHandlers = {};

jV.addListener = function (node, event, handler, capture = false) {
    if (!(event in jV.eventHandlers)) {
        jV.eventHandlers[event] = [];
    }
    jV.eventHandlers[event].push({node: node, handler: handler, capture: capture});
    node.addEventListener(event, handler, capture);
};
jV.removeAllListeners = function (targetNode, event) {
    if (typeof jV.eventHandlers[event] !== "undefined") {
        jV.eventHandlers[event]
                .filter(({ node }) => node === targetNode)
                .forEach(({ node, handler, capture }) => node.removeEventListener(event, handler, capture));

                jV.eventHandlers[event] = jV.eventHandlers[event].filter(
                ({ node }) => node !== targetNode,
                );
    }
};

jV.event = function (o, e, f, b) {
    if (o.attachEvent) {
        o.attachEvent("on" + e, f)
    } else if (o.addEventListener) {
        jV.removeAllListeners(o, e);
        jV.addListener(o,e,f,b);  
    } else {
        o["on" + e] = f
    }
    return this
};

jV.bindPro = function (f, o) {
    if (f.bind === Function.prototype.bind && Function.prototype.bind)
        return Function.prototype.bind.apply(f, Array.prototype.slice.call(arguments, 1));

    var n = Array.prototype.slice.call(arguments, 2);

    return function () {
        return f.apply(o, n.concat(Array.prototype.slice.call(arguments)))
    }
};
jV.bind = function (o, e, f, a, arg, this_) {
    var n = (new String(e)).split(" ");
    for (var r = 0; r < n.length; r++) {
        this.event(o, n[r], this.bindPro(f, a, arg, this_), true)
    }
    return this
};
jV.prototype.removeProperty = function (ob, reg) {
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
jV.prototype.propert = function (prop) {
    var p = prop.split(".");
    if (p.length) {
        return { key: p[0], val: p[1] }
    } else {
        return { key: p[0], val: p[0] }
    }
};
jV.prototype.settingTagInput = function (m, e, o) {
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
jV.prototype.settingTag = function (m, e, o) {
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

jV.prototype.settingTagOption = function (m, e, o) {

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
jV.prototype.isAttributeForProp = function (attrs) {
    for (var a in attrs) {
        if (attrs[a] && /(for-property|for-property\-.*)+$/.test(attrs[a].name)) {
            return 1;
        }
    }
    return 0;
};
jV.prototype.isAttributeWrite = function (attrs) {
    for (var a in attrs) {
        if (attrs[a] && /(jv-write|jv-write-.*)+$/.test(attrs[a].name)) {
            return 1;
        }
    }
    return 0;
};
jV.prototype.getHtmlTemplate = function (k) {
    return this.htmlTemplate[k];
};
jV.prototype.setHtmlTemplate = function (k, v) {
    this.htmlTemplate[k] = v;
};
jV.prototype.getAppTemplate = function (k) {
    return this.htmlAppTemplate[k];
};
jV.prototype.setAppTemplate = function (k, v) {
    this.htmlAppTemplate[k] = v;
};
jV.prototype.searchHtlmTemplate = function (o) {
    var this_ = this;
    Array.prototype.forEach.call((o || document).querySelectorAll('[jv-template]'), function (el, i) {
        this_.setHtmlTemplate(el.getAttribute('jv-template'), el.innerHTML);
        this_._(el).hide();
    });
    return this_;
};
jV.prototype.searchTemplateApp = function (o) {
    var this_ = this;
    Array.prototype.forEach.call((o || document).querySelectorAll('[jv-app]'), function (el, i) {
        this_.setAppTemplate(el.getAttribute('jv-app'), el);
    });
    return this_;
};
jV.prototype.updateObject = function (elemExp, elementForEach, t, data) {
    var this_ = this;
    if (elemExp) {
        for (var att = 0; att < elemExp.attributes.length; att++) {
            (function (att, elemExp, t, data) {
                if (elemExp.attributes[att] && /(for-property|for-property\-.*)+$/.test(elemExp.attributes[att].name)) {
                    var matchAttr = elemExp.attributes[att].name.split('for-property-');
                    var exps = elemExp.attributes[att].value.split(',');

                    if (exps) {
                        for (var e in exps) {
                            if (elemExp['nodeType'] === 1) {
                                var propert = exps[e].split('.')[0];

                                switch (propert) {

                                    case elementForEach:
                                        if (elemExp['nodeName'] === 'INPUT') {
                                            if (matchAttr[1]) {
                                                this_.settingTagInput(matchAttr[1], elemExp, this_.getObjVal(exps, e, data, elementForEach, t));
                                            } else {
                                                elemExp['value'] = this_.getObjVal(exps, e, data, elementForEach, t);
                                            }
                                        } else if (elemExp['nodeName'] === 'OPTION') {
                                            if (matchAttr[1]) {
                                                this_.settingTagOption(matchAttr[1], elemExp, this_.getObjVal(exps, e, data, elementForEach, t));

                                            } else {
                                                this_._(elemExp).html(this_.getObjVal(exps, e, data, elementForEach, t));
                                            }
                                        } else {
                                            if (matchAttr[1]) {

                                                this_.settingTag(matchAttr[1], elemExp, this_.getObjVal(exps, e, data, elementForEach, t));

                                            } else {

                                                this_._(elemExp).append(this_.getObjVal(exps, e, data, elementForEach, t));
                                            }
                                        }
                                        break;

                                    default:
                                        if (exps[e].split('.').length < 2) {
                                            if (elemExp['nodeName'] === 'INPUT') {
                                                if (matchAttr[1] && matchAttr[1] === "value") {
                                                    elemExp[matchAttr[1]] = this_.data[exps[e].split('.')[0]];
                                                } else if (matchAttr[1]) {

                                                    this_.settingTagInput(matchAttr[1], elemExp, data[exps[e].split('.')[0]]);
                                                } else {
                                                    elemExp['value'] = data[exps[e].split('.')[0]];
                                                }
                                            } else if (elemExp['nodeName'] === 'OPTION') {
                                                if (matchAttr[1]) {

                                                    this_.settingTagOption(matchAttr[1], elemExp, data[exps[e].split('.')[0]]);

                                                } else {
                                                    this_._(elemExp).html(data[exps[e].split('.')[0]]);
                                                }
                                            } else {
                                                if (matchAttr[1]) {

                                                    this_.settingTag(matchAttr[1], elemExp, data[exps[e].split('.')[0]]);

                                                } else {
                                                    this_._(elemExp).append(data[exps[e].split('.')[0]]);
                                                }
                                            }
                                        } else if (exps[e].split('.').length > 1) {

                                            if (elemExp['nodeName'] === 'INPUT') {

                                                if (matchAttr[1]) {
                                                    this_.settingTagInput(matchAttr[1], elemExp, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                } else {
                                                    elemExp['value'] = data[exps[e].split('.')[0]][exps[e].split('.')[1]];
                                                }
                                            } else if (elemExp['nodeName'] === 'OPTION') {
                                                if (matchAttr[1]) {

                                                    this_.settingTagOption(matchAttr[1], elemExp, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);


                                                } else {
                                                    this_._(elemExp).html(data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                }
                                            } else {

                                                if (matchAttr[1]) {

                                                    this_.settingTag(matchAttr[1], elemExp, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);

                                                } else if (!this_.isUndefined(data[exps[e].split('.')[0]])) {
                                                    this_._(elemExp).append(data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                }
                                            }

                                        }

                                }
                            }
                        }
                    }
                }

            })(att, elemExp, t, data)
        }

        this.removeProperty(elemExp, new RegExp(/(for-property|for-property\-.*)+$/));
    }
};

jV.prototype.getValProp = function (exp, obj, n, isObj) {
    var chars = [];
    var this_ = this;
    var props = exp.split(this_.divisor);
    for (var p in props) {
        var stringProp = props[p], fnp = undefined;
        if (String(stringProp).indexOf(this_.pipe) !== -1) {
            stringProp = props[p].split(this_.pipe)[0];
            fnp = props[p].split(this_.pipe)[1].split(' ').join('');
        }
        if (stringProp === this_.current)
            chars.push(n);
        if (stringProp === this_.space)
            chars.push(this_.txtSpace);
        if (stringProp.indexOf(' ') !== -1 && stringProp.length > 2 && stringProp.indexOf("$") !== -1)
            chars.push(stringProp.split("$").join('.'));
        if (stringProp.split(' ').join('') !== '' && isObj && typeof obj[stringProp] !== "undefined")
            try {
                var j = stringProp.split(' ').join('');
                var val = eval('(' + 'obj' + '.' + j + ')');
                if (typeof val !== "undefined" && typeof fnp !== "undefined")
                    chars.push(typeof this_.fn['pp'][fnp] === "function" ? this_.fn['pp'][fnp].apply(this, [val, obj, n]) : val);
                if (typeof val !== "undefined" && typeof fnp === "undefined")
                    chars.push(val);
                if (!isObj && typeof obj !== "undefined")
                    if (typeof fnp !== "undefined")
                        chars.push(typeof this_.fn['pp'][fnp] === "function" ? this_.fn['pp'][fnp].apply(this, [obj, this_.data, n]) : obj);
                if (!isObj && typeof obj !== "undefined" && typeof fnp === "undefined")
                    chars.push(obj);
            } catch (err) {
                console.log(j, err);
            }
    }
    return chars.join('');
};

jV.prototype.getObjVal = function (exp, e, a, b, n) {
    var this_ = this, u = exp[e].split('.');
    if (u.length < 2) {
        if (String(exp[e]).indexOf(this_.divisor) !== -1) {
            return this_.getValProp(exp[e], a[b][n], n, false);
        } else if (exp[e] === this_.current)
            return n;
        else if (exp[e] === this_.space)
            return this_.txtSpace;
        else if (String(exp[e]).indexOf(this_.pipe) !== -1) {
            var fn_ = exp[e].split(this_.pipe)[1].split(' ').join('');
            return typeof this_.fn['pp'][fn_] === "function" ? this_.fn['pp'][fn_].apply(this, [a[b][n], a[b], n]) : a[b][n];
        } else
            return a[b][n];
    } else {

        if (String(u[1]).indexOf(this_.divisor) !== -1) {
            return this_.getValProp(u[1], a[b][n], n, true);
        }
        if (u[1] === this_.current)
            return n;
        if (u[1] === this_.space)
            return this_.txtSpace;

        var prop = exp[e].split('.').slice(1).join('.'), fnp = undefined;
        if (String(prop).indexOf(this_.pipe) !== -1) {
            fnp = prop.split(this_.pipe)[1].split(' ').join('');
            prop = prop.split(this_.pipe)[0].split(' ').join('');
        }

        var propObj = a[b][n];

        if (typeof propObj !== "undefined")
            var val = eval('(' + 'propObj' + '.' + prop + ')');
        if (typeof val !== "undefined" && typeof fnp !== "undefined")
            return typeof this_.fn['pp'][fnp] === "function" ? this_.fn['pp'][fnp].apply(this, [val, propObj, n]) : val;
        if (typeof val !== "undefined" && typeof fnp === "undefined")
            return val;
        return "";

    }
};

jV.prototype.valueProperty = function (exps) {
    var this_ = this;
    var chars = [];

    if (typeof exps !== "undefined" && exps !== "") {
        ++this_.count;
        if (String(exps).indexOf(this_.divisor) !== -1) {
            var props = exps.split(this_.divisor);
            for (var p in props) {
                var stringProp = props[p], fnp = undefined;
                if (String(stringProp).indexOf(this_.pipe) !== -1) {
                    stringProp = props[p].split(this_.pipe)[0];
                    fnp = props[p].split(this_.pipe)[1].split(' ').join('');
                }
                if (stringProp === this_.current)
                    chars.push(this_.count);
                else if (stringProp === this_.space)
                    chars.push(this_.txtSpace);
                else if (stringProp.indexOf(' ') !== -1 && stringProp.length > 2)
                    chars.push(stringProp);
                else if (stringProp.split(' ').join('') !== '') {
                    try {
                        var j = stringProp.split(" ").join("");
                        var val = eval('(' + 'this_.data' + '.' + j + ')');
                        if (typeof val !== "undefined" && typeof fnp !== "undefined")
                            chars.push(typeof this_.fn['pp'][fnp] === "function" ? this_.fn['pp'][fnp].apply(this, [val, this_.data]) : val);
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
                var stringProp_ = exps, fnp_ = undefined;
                if (String(exps).indexOf(this_.pipe) !== -1) {
                    stringProp_ = exps.split(this_.pipe)[0];
                    fnp_ = exps.split(this_.pipe)[1].split(' ').join('');
                }
                var val_ = eval('(' + 'this_.data' + '.' + stringProp_ + ')');
                if (typeof val_ !== "undefined" && typeof fnp_ !== "undefined")
                    return typeof this_.fn['pp'][fnp_] === "function" ? this_.fn['pp'][fnp_].apply(this, [val_, this_.data]) : val_;
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
jV.prototype.updateProperty = function (elemExp) {
    var this_ = this;
    if (elemExp) {
        for (var att = 0; att < elemExp.attributes.length; att++) {
            (function (elemExp, attribute) {
                if (attribute && /(jv-write|jv-write-.*)+$/.test(attribute.name)) {
                    var matchAttr = attribute.name.split('jv-write-')
                    var exps = attribute.value.split(',');
                    if (exps) {
                        for (var e in exps) {
                            if (elemExp['nodeType'] === 1) {
                                if (elemExp['nodeName'] === 'INPUT') {
                                    if (matchAttr[1]) {
                                        this_.settingTagInput(matchAttr[1], elemExp, this_.valueProperty(exps[e]));

                                    } else {
                                        elemExp['value'] = this_.valueProperty(exps[e]);
                                    }
                                } else if (elemExp['nodeName'] === 'OPTION') {
                                    if (matchAttr[1]) {
                                        this_.settingTagOption(matchAttr[1], elemExp, this_.valueProperty(exps[e]));
                                    } else {
                                        this_._(elemExp).html(this_.valueProperty(exps[e]));
                                    }
                                } else {
                                    if (matchAttr[1]) {
                                        this_.settingTag(matchAttr[1], elemExp, this_.valueProperty(exps[e]));
                                    } else {
                                        this_._(elemExp).append(this_.valueProperty(exps[e]));
                                    }
                                }
                            }
                        }
                    }
                }
            })(elemExp, elemExp.attributes[att])
        }
        this_.removeProperty(elemExp, new RegExp(/(jv-write|jv-write-.*)+$/));
    }
};
jV.prototype.writeProperty = function (o) {
    var this_ = this;
    var forProperty = [];
    Array.prototype.forEach.call(o.getElementsByTagName('*'), function (el, i) {
        if (this_.isAttributeWrite(el.attributes)) {
            forProperty['jv-write-' + i] = { obj: el };
        }
    });
    var fork = forProperty;
    for (var x in fork) {
        (function (a) {
            this_.updateProperty(a);
        })(fork[x]['obj'])
    }
    return true;
};
jV.prototype.isUndefined = function (t) {
    return null === t ? !0 : t ? "undefined" === typeof t : !0;
};
jV.prototype.isArrayNative = function (a) {
    return !!a && (typeof a === "object" || typeof a === "function") && "length" in a && !("setInterval" in a) && (Object.prototype.toString.call(a) === "[object Array]" || "callee" in a || "item" in a);
};
jV.prototype.array = function (b) {
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
jV.searchHtmlEvent = function (o) {
    var jVEvent = [];
    Array.prototype.forEach.call(o.querySelectorAll("[jv-event]"), function (el, i) {
        jVEvent[el.getAttribute("jv-event") + "-" + i] = el;
    })
    return jVEvent;
};
jV.prototype.set = function (val, n) {
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

jV.prototype.isforEach = function (o) {
    var elementsForEach = [], this_ = this;
    
    Array.prototype.forEach.call(o.querySelectorAll('[jv-foreach]'), function (el, i) {
        elementsForEach[el.getAttribute('jv-foreach')] = { attr: el.getAttribute('jv-foreach'), exp: [], obj: el };
        el.removeAttribute('jv-foreach');
        this_.isforEach(el);
    });

    if (typeof (this_.onBeforeRow) === "undefined" || typeof (this_.onBeforeRow) !== "function")
        this_.onBeforeRow = function (a, b) {
            return true;
        }

    var fork = elementsForEach;
    for (var x in fork) {
        var ctx_data = {}, key = x.split('.').pop();
        ctx_data[key] = [];
        if (x.split('.').length > 1) {
            ctx_data[key] = eval('(' + 'this_.data' + '.' + x + ')');

        } else {
            ctx_data[key] = this_.set(x, 0);
        }

        for (var t in ctx_data[key]) {

            var clone = this_._(fork[x]['obj']).clone().get(0);
            var aryExp = this_.array(clone.getElementsByTagName('*'));
            if (this_.onBeforeRow(clone, ctx_data[key][t], t)) {
                if (!aryExp.length) {
                    fork[x]['exp'] = [clone];
                } else {
                    fork[x]['exp'] = aryExp;
                }
                for (var y in fork[x]['exp']) {
                    var elemExp = fork[x]['exp'][y];
                    if (this_.isAttributeForProp(elemExp.attributes)) {
                        (function (a, b, c, data) {
                            this_.updateObject(a, b, c, data);
                        })(fork[x]['exp'][y], key, t, ctx_data)
                    }
                }

                this_._(fork[x]['obj']).parent().append(clone);
                this_.writeProperty(clone);
                this_.initHtmlEvent(clone);

                this_.removeProperty(clone, new RegExp(/(for-property|for-property\-.*)+$/));

                if (typeof (this_.onAfterRow) !== "undefined" || typeof (this_.onAfterRow) === "function")
                    this_.onAfterRow(clone, ctx_data[key][t], t);
            }

        }
        this_._(fork[x]['obj']).remove();
    }

    return this_;
};
jV.prototype.setData = function (data) {
    var this__ = this;
    if (typeof data !== "undefined")
        this__.data = this__.isArray(data) ? { data: data } : data;
    else
        console.log("the setData function [data] is undefined!");
    return this__;
};
jV.prototype.setTemplateName = function (supplTemplateName) {
    var this__ = this;
    if (typeof supplTemplateName !== "undefined")
        this__.supplTemplateName = supplTemplateName;
    else
        console.log("function setTemplateName [supplTemplateName] is undefined!");
    return this__;
};
jV.prototype.setBoxView = function (supplBoxView) {
    var this__ = this;
    if (typeof supplBoxView !== "undefined")
        this__.supplBoxView = supplBoxView;
    else
        console.log("function setBoxView [supplBoxView] is undefined!");
    return this__;
};
jV.prototype.setAppName = function (templateAppName) {
    var this__ = this;
    if (typeof templateAppName !== "undefined")
        this__.templateAppName = templateAppName;
    else
        console.log("function setBoxView [supplBoxView] is undefined!")
    return this__;
};
jV.prototype.produceView = function (templateName, data, objV) {
    var this__ = this;
    this__.searchHtlmTemplate(document).data = data;
    var exl = this__._(this__.getHtmlTemplate(templateName)).get();
    this__._(objV).html(exl);
    this__.isforEach(objV);
    this__.writeProperty(document);
    this__.initHtmlEvent(objV);
    return this;
};
jV.prototype.isArray = function (obj) {
    return obj.constructor.toString().indexOf("Array") > -1;
};
jV.prototype.getHtml = function () {
    var this__ = this;
    if (typeof this__.getObject !== "undefined")
        return this__.getObject.innerHTML;
    else
        return "";
};
jV.prototype.dataFilter = function (o) {return o;};
jV.prototype.setDataFilter = function (f) {
    var this__ = this;
    if (typeof f !== "undefined" && typeof f === "function")
        this__.dataFilter = f;
    
    return this__;
};
jV.prototype.setAjaxSetting = function (obj) {
    var this__ = this;
    if (typeof obj !== "undefined")
        this__.ajax_ = obj;
    
    return this__;
};
jV.prototype.setUrl = function (url) {
    var this__ = this;
    if (typeof url !== "undefined" && typeof url === "string")
        this__.ajax_.url = url;
    
    return this__;
};
jV.prototype.find = function (o) {
    var this__ = this;
    this__._.ajax(this__.ajax_).done(function (data, textStatus, xhr) {
        if (o && o.obj) {
            this__.setData(data[o.obj]);
        }

        else {
            this__.setData(this__.dataFilter(data));
        }


        if (typeof this__.templateAppName !== "undefined") {
            this__.executeApp();
        }
        else {
            this__.executeView();
        }

    })
        .fail(function (xhr, textStatus, thrownError) {
            console.log(xhr.status);
            console.log(textStatus);
            console.log(thrownError);
        })
        .always(function (data_xhr, textStatus, xhr_errorThrown) {
           if(this__.islog)
            console.log("[jV:find request ajax] always: complete ",this__.ajax_, textStatus);
        });

    return this__;
}
jV.prototype.createView = function (o) {
    var this__ = this;

    if (typeof o !== "undefined") {
        if (typeof o.dataFilter !== "undefined" && typeof o.dataFilter==="function") {
            this__.dataFilter=o.dataFilter;
        }     
        if (typeof o.jvTemplate !== "undefined") {
            this__.setTemplateName(o.jvTemplate)
        }
        if (typeof o.data !== "undefined") {
            this__.setData(o.data);
        }
        if (typeof o.box !== "undefined") {
            this__.setBoxView(o.box);
        }
        if (typeof o.jvApp !== "undefined") {
            this__.setAppName(o.jvApp);
        }

    }
    if (typeof o !== "undefined" && typeof o.url !== "undefined") {
        this__.ajax_.url=o.url;
        return this__.find(o);

    }else if(typeof this__.ajax_.url !== "undefined" && typeof this__.ajax_.url === "string"){
        return this__.find(o);
    } else {

        if (typeof this__.templateAppName !== "undefined") { return this__.executeApp(); }
        else { return this__.executeView(); }
    }
};

jV.prototype.executeView = function () {
    var this__ = this;
     
    var objBox = this__.supplBoxView;
    if (typeof this__.supplBoxView === "undefined")
    objBox = this__._("<div class='jv-support-view' style='display:none'></div>").get(0);
    if (typeof this__.supplTemplateName !== "undefined") {
        if (typeof this__.supplBoxView === "string")
        objBox = this__._(this__.supplBoxView).get(0);
        if (this__.data !== "undefined") {
            this__.searchHtlmTemplate(document);
            var exl = this__._(this__.getHtmlTemplate(this__.supplTemplateName)).get();
            this__._(objBox).html(exl);
            this__.isforEach(objBox);
            this__.writeProperty(objBox);
            this__.initHtmlEvent(objBox);
            this__.getObject = objBox;
        }
        if (typeof this__.data === "undefined")
            console.log('jV Info[ Method:getView] object data is undefined! > exit!!');
    }
    if (typeof this__.supplTemplateName === "undefined") {
        console.log('jV Info[ Method:getView] templateName is undefined! > exit!!');
    }
    if (typeof this__.fnDone !== "undefined" && typeof this__.fnDone === "function")
        this__.fnDone.apply(this__, [exl]);


    return this__;
};
jV.prototype.onBeforeRow = function (a, b) { return true; };
jV.prototype.onAfterRow = function () { };
jV.prototype.executeApp = function () {
    var this__ = this;

    if (typeof this__.templateAppName !== "undefined") {

        if (this__.data !== "undefined") {
            this__.searchTemplateApp(document);
            var exl = this__.getAppTemplate(this__.templateAppName);
            this__.isforEach(exl);
            this__.writeProperty(exl);
            this__.initHtmlEvent(exl);
            this__.getObject = exl;
        }
        if (typeof this__.data === "undefined")
            console.log('jV Info[ Method:getView] object data is undefined! > exit!!');
    }
    if (typeof this__.templateAppName === "undefined") {
        console.log('jV Info[ Method:getView] templateAppName is undefined! > exit!!');
    }
    if (typeof this__.fnDone !== "undefined" && typeof this__.fnDone === "function")
        this__.fnDone.apply(this__, [exl]);

    return this__;
};
jV.prototype.viewLog = function (b) {
    var this__ = this;
    this__.islog=b;
    return this__;
};
jV.prototype.viewDone = function (fn) {
    var this__ = this;
    this.fnDone = fn;
    return this__;
};

jV.prototype.viewEvent = function (name, fn) {
    var th_ = this;

    if (typeof name !== "undefined" && name !== 'pp') {
        th_.fn[name] = fn;
    } else
        console.log("INFO!! it is not possible to associate a function with the name (pp) - change function name! - the function [pp] could not be subscribed!! ");

    return th_;
};

jV.prototype.viewPipe = function (name, fn) {
    var th_ = this;
    if (typeof name !== "undefined")
        th_.fn['pp'][name] = fn;
    else
        console.log("the viewPipe function could not be subscribed, name is undefined!");
    return th_;
};
jV.prototype.initHtmlEvent = function (o) {
    var this_ = this, __proto = this_;
    var jvEvent = jV.searchHtmlEvent(o);
    /* jv-event="click:testfunc" */
    for (var k in jvEvent) {
        var par = k.split("-")[0],
            evt = this_.trim(jV.expEvent.exec(par)[0]),
            ctr = 'fn',
            action = jV.expAction.exec(par)[1],
            types = ctr.split(" ").join(""),
            action = action.split(" ").join(""),
            obj = jvEvent[k],
            nEvent = evt.split(" ");
        obj.removeAttribute('jv-event');
        for (var s in nEvent) {
            (function (t, act, arg, this_) {
                jV.bind(obj, nEvent[s], __proto[t][(function (a) {
                    return a;
                })(act)], obj, arg, this_);
            })(types, action, this_.home, this_)
        }

    }
};
jV.istance = function (n) {
    if (typeof (n) === "undefined")
        n = new Date().getTime();
    if (typeof (jV.get[n]) === "undefined")
        jV.get[n] = new jV();
    return jV.get[n];
};
