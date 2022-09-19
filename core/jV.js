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
jV.bind = function (o, e, f, a, arg, t_) {
    var n = (new String(e)).split(" ");
    for (var r = 0; r < n.length; r++) {
        this.event(o, n[r], this.bindPro(f, a, arg, t_), true)
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
    var t_ = this;
    Array.prototype.forEach.call((o || document).querySelectorAll('[jv-template]'), function (el, i) {
        t_.setHtmlTemplate(el.getAttribute('jv-template'), el.innerHTML);
        t_._(el).hide();
    });
    return t_;
};
jV.prototype.searchTemplateApp = function (o) {
    var t_ = this;
    Array.prototype.forEach.call((o || document).querySelectorAll('[jv-app]'), function (el, i) {
        t_.setAppTemplate(el.getAttribute('jv-app'), el);
    });
    return t_;
};
jV.prototype.updateObject = function (elemExp, elementForEach, t, data) {
    var t_ = this;
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
                                                t_.settingTagInput(matchAttr[1], elemExp, t_.getObjVal(exps, e, data, elementForEach, t));
                                            } else {
                                                elemExp['value'] = t_.getObjVal(exps, e, data, elementForEach, t);
                                            }
                                        } else if (elemExp['nodeName'] === 'OPTION') {
                                            if (matchAttr[1]) {
                                                t_.settingTagOption(matchAttr[1], elemExp, t_.getObjVal(exps, e, data, elementForEach, t));

                                            } else {
                                                t_._(elemExp).html(t_.getObjVal(exps, e, data, elementForEach, t));
                                            }
                                        } else {
                                            if (matchAttr[1]) {

                                                t_.settingTag(matchAttr[1], elemExp, t_.getObjVal(exps, e, data, elementForEach, t));

                                            } else {

                                                t_._(elemExp).append(t_.getObjVal(exps, e, data, elementForEach, t));
                                            }
                                        }
                                        break;

                                    default:
                                        if (exps[e].split('.').length < 2) {
                                            if (elemExp['nodeName'] === 'INPUT') {
                                                if (matchAttr[1] && matchAttr[1] === "value") {
                                                    elemExp[matchAttr[1]] = t_.data[exps[e].split('.')[0]];
                                                } else if (matchAttr[1]) {

                                                    t_.settingTagInput(matchAttr[1], elemExp, data[exps[e].split('.')[0]]);
                                                } else {
                                                    elemExp['value'] = data[exps[e].split('.')[0]];
                                                }
                                            } else if (elemExp['nodeName'] === 'OPTION') {
                                                if (matchAttr[1]) {

                                                    t_.settingTagOption(matchAttr[1], elemExp, data[exps[e].split('.')[0]]);

                                                } else {
                                                    t_._(elemExp).html(data[exps[e].split('.')[0]]);
                                                }
                                            } else {
                                                if (matchAttr[1]) {

                                                    t_.settingTag(matchAttr[1], elemExp, data[exps[e].split('.')[0]]);

                                                } else {
                                                    t_._(elemExp).append(data[exps[e].split('.')[0]]);
                                                }
                                            }
                                        } else if (exps[e].split('.').length > 1) {

                                            if (elemExp['nodeName'] === 'INPUT') {

                                                if (matchAttr[1]) {
                                                    t_.settingTagInput(matchAttr[1], elemExp, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                } else {
                                                    elemExp['value'] = data[exps[e].split('.')[0]][exps[e].split('.')[1]];
                                                }
                                            } else if (elemExp['nodeName'] === 'OPTION') {
                                                if (matchAttr[1]) {

                                                    t_.settingTagOption(matchAttr[1], elemExp, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);


                                                } else {
                                                    t_._(elemExp).html(data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
                                                }
                                            } else {

                                                if (matchAttr[1]) {

                                                    t_.settingTag(matchAttr[1], elemExp, data[exps[e].split('.')[0]][exps[e].split('.')[1]]);

                                                } else if (!t_.isUndefined(data[exps[e].split('.')[0]])) {
                                                    t_._(elemExp).append(data[exps[e].split('.')[0]][exps[e].split('.')[1]]);
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
    var t_ = this;
    var props = exp.split(t_.divisor);
    for (var p in props) {
        var stringProp = props[p], fnp = undefined;
        if (String(stringProp).indexOf(t_.pipe) !== -1) {
            stringProp = props[p].split(t_.pipe)[0];
            fnp = props[p].split(t_.pipe)[1].split(' ').join('');
        }
        if (stringProp === t_.current)
            chars.push(n);
        if (stringProp === t_.space)
            chars.push(t_.txtSpace);
        if (stringProp.indexOf(' ') !== -1 && stringProp.length > 2 && stringProp.indexOf("$") !== -1)
            chars.push(stringProp.split("$").join('.'));
        if (stringProp.split(' ').join('') !== '' && isObj && typeof obj[stringProp] !== "undefined")
            try {
                var j = stringProp.split(' ').join('');
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

jV.prototype.getObjVal = function (exp, e, a, b, n) {
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

jV.prototype.valueProperty = function (exps) {
    var t_ = this;
    var chars = [];

    if (typeof exps !== "undefined" && exps !== "") {
        ++t_.count;
        if (String(exps).indexOf(t_.divisor) !== -1) {
            var props = exps.split(t_.divisor);
            for (var p in props) {
                var stringProp = props[p], fnp = undefined;
                if (String(stringProp).indexOf(t_.pipe) !== -1) {
                    stringProp = props[p].split(t_.pipe)[0];
                    fnp = props[p].split(t_.pipe)[1].split(' ').join('');
                }
                if (stringProp === t_.current)
                    chars.push(t_.count);
                else if (stringProp === t_.space)
                    chars.push(t_.txtSpace);
                else if (stringProp.indexOf(' ') !== -1 && stringProp.length > 2)
                    chars.push(stringProp);
                else if (stringProp.split(' ').join('') !== '') {
                    try {
                        var j = stringProp.split(" ").join("");
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
                var stringProp_ = exps, fnp_ = undefined;
                if (String(exps).indexOf(t_.pipe) !== -1) {
                    stringProp_ = exps.split(t_.pipe)[0];
                    fnp_ = exps.split(t_.pipe)[1].split(' ').join('');
                }
                var val_ = eval('(' + 't_.data' + '.' + stringProp_ + ')');
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
jV.prototype.updateProperty = function (elemExp) {
    var t_ = this;
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
                                        t_.settingTagInput(matchAttr[1], elemExp, t_.valueProperty(exps[e]));

                                    } else {
                                        elemExp['value'] = t_.valueProperty(exps[e]);
                                    }
                                } else if (elemExp['nodeName'] === 'OPTION') {
                                    if (matchAttr[1]) {
                                        t_.settingTagOption(matchAttr[1], elemExp, t_.valueProperty(exps[e]));
                                    } else {
                                        t_._(elemExp).html(t_.valueProperty(exps[e]));
                                    }
                                } else {
                                    if (matchAttr[1]) {
                                        t_.settingTag(matchAttr[1], elemExp, t_.valueProperty(exps[e]));
                                    } else {
                                        t_._(elemExp).append(t_.valueProperty(exps[e]));
                                    }
                                }
                            }
                        }
                    }
                }
            })(elemExp, elemExp.attributes[att])
        }
        t_.removeProperty(elemExp, new RegExp(/(jv-write|jv-write-.*)+$/));
    }
};
jV.prototype.writeProperty = function (o) {
    var t_ = this;
    var forProperty = [];
    Array.prototype.forEach.call(o.getElementsByTagName('*'), function (el, i) {
        if (t_.isAttributeWrite(el.attributes)) {
            forProperty['jv-write-' + i] = { obj: el };
        }
    });
    var fork = forProperty;
    for (var x in fork) {
        (function (a) {
            t_.updateProperty(a);
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

    var fork = elementsForEach;
    for (var x in fork) {
        var ctx_data = {}, key = x.split('.').pop();
        ctx_data[key] = [];
        if (x.split('.').length > 1) {
            ctx_data[key] = eval('(' + 't_.data' + '.' + x + ')');

        } else {
            ctx_data[key] = t_.set(x, 0);
        }

        for (var t in ctx_data[key]) {

            var clone = t_._(fork[x]['obj']).clone().get(0);
            var aryExp = t_.array(clone.getElementsByTagName('*'));
            if (t_.onBeforeRow(clone, ctx_data[key][t], t)) {
                if (!aryExp.length) {
                    fork[x]['exp'] = [clone];
                } else {
                    fork[x]['exp'] = aryExp;
                }
                for (var y in fork[x]['exp']) {
                    var elemExp = fork[x]['exp'][y];
                    if (t_.isAttributeForProp(elemExp.attributes)) {
                        (function (a, b, c, data) {
                            t_.updateObject(a, b, c, data);
                        })(fork[x]['exp'][y], key, t, ctx_data)
                    }
                }

                t_._(fork[x]['obj']).parent().append(clone);
                t_.writeProperty(clone);
                t_.initHtmlEvent(clone);

                t_.removeProperty(clone, new RegExp(/(for-property|for-property\-.*)+$/));

                if (typeof (t_.onAfterRow) !== "undefined" || typeof (t_.onAfterRow) === "function")
                    t_.onAfterRow(clone, ctx_data[key][t], t);
            }

        }
        t_._(fork[x]['obj']).remove();
    }

    return t_;
};
jV.prototype.setData = function (data) {
    var t_ = this;
    if (typeof data !== "undefined")
        t_.data = t_.isArray(data) ? { data: data } : data;
    else
        console.log("the setData function [data] is undefined!");
    return t_;
};
jV.prototype.setTemplateName = function (supplTemplateName) {
    var t_ = this;
    if (typeof supplTemplateName !== "undefined")
        t_.supplTemplateName = supplTemplateName;
    else
        console.log("function setTemplateName [supplTemplateName] is undefined!");
    return t_;
};
jV.prototype.setBoxView = function (supplBoxView) {
    var t_ = this;
    if (typeof supplBoxView !== "undefined")
        t_.supplBoxView = supplBoxView;
    else
        console.log("function setBoxView [supplBoxView] is undefined!");
    return t_;
};
jV.prototype.setAppName = function (templateAppName) {
    var t_ = this;
    if (typeof templateAppName !== "undefined")
        t_.templateAppName = templateAppName;
    else
        console.log("function setBoxView [supplBoxView] is undefined!")
    return t_;
};
jV.prototype.produceView = function (templateName, data, objV) {
    var t_ = this;
    t_.searchHtlmTemplate(document).data = data;
    var exl = t_._(t_.getHtmlTemplate(templateName)).get();
    t_._(objV).html(exl);
    t_.isforEach(objV);
    t_.writeProperty(document);
    t_.initHtmlEvent(objV);
    return this;
};
jV.prototype.isArray = function (obj) {
    return obj.constructor.toString().indexOf("Array") > -1;
};
jV.prototype.getHtml = function () {
    var t_ = this;
    if (typeof t_.getObject !== "undefined")
        return t_.getObject.innerHTML;
    else
        return "";
};
jV.prototype.dataFilter = function (o) {return o;};
jV.prototype.setDataFilter = function (f) {
    var t_ = this;
    if (typeof f !== "undefined" && typeof f === "function")
        t_.dataFilter = f;
    
    return t_;
};
jV.prototype.setAjaxSetting = function (obj) {
    var t_ = this;
    if (typeof obj !== "undefined")
    t_.ajax_ = obj;
    
    return t_;
};
jV.prototype.setUrl = function (url) {
    var t_ = this;
    if (typeof url !== "undefined" && typeof url === "string")
    t_.ajax_.url = url;
    
    return t_;
};
jV.prototype.find = function (o) {
    var t_ = this;
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
           if(t_.islog)
            console.log("[jV:find request ajax] always: complete ",t_.ajax_, textStatus);
        });

    return t_;
}
jV.prototype.createView = function (o) {
    var t_ = this;

    if (typeof o !== "undefined") {
        if (typeof o.dataFilter !== "undefined" && typeof o.dataFilter==="function") {
            t_.dataFilter=o.dataFilter;
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

    }
    if (typeof o !== "undefined" && typeof o.url !== "undefined") {
        t_.ajax_.url=o.url;
        return t_.find(o);

    }else if(typeof t_.ajax_.url !== "undefined" && typeof t_.ajax_.url === "string"){
        return t_.find(o);
    } else {

        if (typeof t_.templateAppName !== "undefined") { return t_.executeApp(); }
        else { return t_.executeView(); }
    }
};

jV.prototype.executeView = function () {
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
jV.prototype.onBeforeRow = function (a, b) { return true; };
jV.prototype.onAfterRow = function () { };
jV.prototype.executeApp = function () {
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
jV.prototype.viewLog = function (b) {
    var t_ = this;
    t_.islog=b;
    return t_;
};
jV.prototype.viewDone = function (fn) {
    var t_ = this;
    this.fnDone = fn;
    return t_;
};

jV.prototype.viewEvent = function (name, fn) {
    var t_ = this;

    if (typeof name !== "undefined" && name !== 'pp') {
        t_.fn[name] = fn;
    } else
        console.log("INFO!! it is not possible to associate a function with the name (pp) - change function name! - the function [pp] could not be subscribed!! ");

    return t_;
};

jV.prototype.viewPipe = function (name, fn) {
    var t_ = this;
    if (typeof name !== "undefined")
        t_.fn['pp'][name] = fn;
    else
        console.log("the jVPipe function could not be subscribed, name is undefined!");
    return t_;
};
jV.prototype.initHtmlEvent = function (o) {
    var t_ = this, __proto = t_;
    var jvEvent = jV.searchHtmlEvent(o);
    // jv-event="click:testfunc"
    for (var k in jvEvent) {
        var par = k.split("-")[0],
            evt = t_.trim(jV.expEvent.exec(par)[0]),
            ctr = 'fn',
            action = jV.expAction.exec(par)[1],
            types = ctr.split(" ").join(""),
            action = action.split(" ").join(""),
            obj = jvEvent[k],
            nEvent = evt.split(" ");
        obj.removeAttribute('jv-event');
        for (var s in nEvent) {
            (function (t, act, arg, t_) {
                jV.bind(obj, nEvent[s], __proto[t][(function (a) {
                    return a;
                })(act)], obj, arg, t_);
            })(types, action, t_.home, t_)
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
