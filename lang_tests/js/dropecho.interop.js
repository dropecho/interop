(function ($hx_exports, $global) { "use strict";
var $hxClasses = {},$hxEnums = $hxEnums || {},$_;
class EReg {
	constructor(r,opt) {
		this.r = new RegExp(r,opt.split("u").join(""));
	}
	match(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	matched(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	matchedLeft() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return HxOverrides.substr(this.r.s,0,this.r.m.index);
	}
	matchedRight() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		let sz = this.r.m.index + this.r.m[0].length;
		return HxOverrides.substr(this.r.s,sz,this.r.s.length - sz);
	}
	matchedPos() {
		if(this.r.m == null) {
			throw haxe_Exception.thrown("No string matched");
		}
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	matchSub(s,pos,len) {
		if(len == null) {
			len = -1;
		}
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0 ? s : HxOverrides.substr(s,0,pos + len));
			let b = this.r.m != null;
			if(b) {
				this.r.s = s;
			}
			return b;
		} else {
			let b = this.match(len < 0 ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len));
			if(b) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b;
		}
	}
	split(s) {
		let d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	replace(s,by) {
		return s.replace(this.r,by);
	}
	map(s,f) {
		let offset = 0;
		let buf_b = "";
		while(true) {
			if(offset >= s.length) {
				break;
			} else if(!this.matchSub(s,offset)) {
				buf_b += Std.string(HxOverrides.substr(s,offset,null));
				break;
			}
			let p = this.matchedPos();
			buf_b += Std.string(HxOverrides.substr(s,offset,p.pos - offset));
			buf_b += Std.string(f(this));
			if(p.len == 0) {
				buf_b += Std.string(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else {
				offset = p.pos + p.len;
			}
			if(!this.r.global) {
				break;
			}
		}
		if(!this.r.global && offset > 0 && offset < s.length) {
			buf_b += Std.string(HxOverrides.substr(s,offset,null));
		}
		return buf_b;
	}
	static escape(s) {
		return s.replace(EReg.escapeRe,"\\$&");
	}
}
$hxClasses["EReg"] = EReg;
EReg.__name__ = "EReg";
Object.assign(EReg.prototype, {
	__class__: EReg
	,r: null
});
class EnumValue {
	static match(this1,pattern) {
		return false;
	}
}
class HxOverrides {
	static dateStr(date) {
		let m = date.getMonth() + 1;
		let d = date.getDate();
		let h = date.getHours();
		let mi = date.getMinutes();
		let s = date.getSeconds();
		return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
	}
	static strDate(s) {
		switch(s.length) {
		case 8:
			let k = s.split(":");
			let d = new Date();
			d["setTime"](0);
			d["setUTCHours"](k[0]);
			d["setUTCMinutes"](k[1]);
			d["setUTCSeconds"](k[2]);
			return d;
		case 10:
			let k1 = s.split("-");
			return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
		case 19:
			let k2 = s.split(" ");
			let y = k2[0].split("-");
			let t = k2[1].split(":");
			return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
		default:
			throw haxe_Exception.thrown("Invalid date format : " + s);
		}
	}
	static cca(s,index) {
		let x = s.charCodeAt(index);
		if(x != x) {
			return undefined;
		}
		return x;
	}
	static substr(s,pos,len) {
		if(len == null) {
			len = s.length;
		} else if(len < 0) {
			if(pos == 0) {
				len = s.length + len;
			} else {
				return "";
			}
		}
		return s.substr(pos,len);
	}
	static indexOf(a,obj,i) {
		let len = a.length;
		if(i < 0) {
			i += len;
			if(i < 0) {
				i = 0;
			}
		}
		while(i < len) {
			if(((a[i]) === obj)) {
				return i;
			}
			++i;
		}
		return -1;
	}
	static lastIndexOf(a,obj,i) {
		let len = a.length;
		if(i >= len) {
			i = len - 1;
		} else if(i < 0) {
			i += len;
		}
		while(i >= 0) {
			if(((a[i]) === obj)) {
				return i;
			}
			--i;
		}
		return -1;
	}
	static remove(a,obj) {
		let i = a.indexOf(obj);
		if(i == -1) {
			return false;
		}
		a.splice(i,1);
		return true;
	}
	static iter(a) {
		return { cur : 0, arr : a, hasNext : function() {
			return this.cur < this.arr.length;
		}, next : function() {
			return this.arr[this.cur++];
		}};
	}
	static keyValueIter(a) {
		return new haxe_iterators_ArrayKeyValueIterator(a);
	}
	static now() {
		return Date.now();
	}
}
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = "HxOverrides";
class IntIterator {
	constructor(min,max) {
		this.min = min;
		this.max = max;
	}
	hasNext() {
		return this.min < this.max;
	}
	next() {
		return this.min++;
	}
}
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = "IntIterator";
Object.assign(IntIterator.prototype, {
	__class__: IntIterator
	,min: null
	,max: null
});
class Lambda {
	static array(it) {
		let a = [];
		let i = $getIterator(it);
		while(i.hasNext()) {
			let i1 = i.next();
			a.push(i1);
		}
		return a;
	}
	static list(it) {
		let l = new haxe_ds_List();
		let i = $getIterator(it);
		while(i.hasNext()) {
			let i1 = i.next();
			l.add(i1);
		}
		return l;
	}
	static map(it,f) {
		let _g = [];
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			_g.push(f(x1));
		}
		return _g;
	}
	static mapi(it,f) {
		let i = 0;
		let _g = [];
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			_g.push(f(i++,x1));
		}
		return _g;
	}
	static flatten(it) {
		let _g = [];
		let e = $getIterator(it);
		while(e.hasNext()) {
			let e1 = e.next();
			let x = $getIterator(e1);
			while(x.hasNext()) {
				let x1 = x.next();
				_g.push(x1);
			}
		}
		return _g;
	}
	static flatMap(it,f) {
		let _g = [];
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			_g.push(f(x1));
		}
		let _g1 = [];
		let e = $getIterator(_g);
		while(e.hasNext()) {
			let e1 = e.next();
			let x = $getIterator(e1);
			while(x.hasNext()) {
				let x1 = x.next();
				_g1.push(x1);
			}
		}
		return _g1;
	}
	static has(it,elt) {
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			if(x1 == elt) {
				return true;
			}
		}
		return false;
	}
	static exists(it,f) {
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			if(f(x1)) {
				return true;
			}
		}
		return false;
	}
	static foreach(it,f) {
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			if(!f(x1)) {
				return false;
			}
		}
		return true;
	}
	static iter(it,f) {
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			f(x1);
		}
	}
	static filter(it,f) {
		let _g = [];
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			if(f(x1)) {
				_g.push(x1);
			}
		}
		return _g;
	}
	static fold(it,f,first) {
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			first = f(x1,first);
		}
		return first;
	}
	static foldi(it,f,first) {
		let i = 0;
		let x = $getIterator(it);
		while(x.hasNext()) {
			let x1 = x.next();
			first = f(x1,first,i);
			++i;
		}
		return first;
	}
	static count(it,pred) {
		let n = 0;
		if(pred == null) {
			let _ = $getIterator(it);
			while(_.hasNext()) {
				let _1 = _.next();
				++n;
			}
		} else {
			let x = $getIterator(it);
			while(x.hasNext()) {
				let x1 = x.next();
				if(pred(x1)) {
					++n;
				}
			}
		}
		return n;
	}
	static empty(it) {
		return !$getIterator(it).hasNext();
	}
	static indexOf(it,v) {
		let i = 0;
		let v2 = $getIterator(it);
		while(v2.hasNext()) {
			let v21 = v2.next();
			if(v == v21) {
				return i;
			}
			++i;
		}
		return -1;
	}
	static find(it,f) {
		let v = $getIterator(it);
		while(v.hasNext()) {
			let v1 = v.next();
			if(f(v1)) {
				return v1;
			}
		}
		return null;
	}
	static findIndex(it,f) {
		let i = 0;
		let v = $getIterator(it);
		while(v.hasNext()) {
			let v1 = v.next();
			if(f(v1)) {
				return i;
			}
			++i;
		}
		return -1;
	}
	static concat(a,b) {
		let l = [];
		let x = $getIterator(a);
		while(x.hasNext()) {
			let x1 = x.next();
			l.push(x1);
		}
		let x1 = $getIterator(b);
		while(x1.hasNext()) {
			let x = x1.next();
			l.push(x);
		}
		return l;
	}
}
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = "Lambda";
Math.__name__ = "Math";
class Reflect {
	static hasField(o,field) {
		return Object.prototype.hasOwnProperty.call(o,field);
	}
	static field(o,field) {
		try {
			return o[field];
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return null;
		}
	}
	static setField(o,field,value) {
		o[field] = value;
	}
	static getProperty(o,field) {
		let tmp;
		if(o == null) {
			return null;
		} else {
			let tmp1;
			if(o.__properties__) {
				tmp = o.__properties__["get_" + field];
				tmp1 = tmp;
			} else {
				tmp1 = false;
			}
			if(tmp1) {
				return o[tmp]();
			} else {
				return o[field];
			}
		}
	}
	static setProperty(o,field,value) {
		let tmp;
		let tmp1;
		if(o.__properties__) {
			tmp = o.__properties__["set_" + field];
			tmp1 = tmp;
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			o[tmp](value);
		} else {
			o[field] = value;
		}
	}
	static callMethod(o,func,args) {
		return func.apply(o,args);
	}
	static fields(o) {
		let a = [];
		if(o != null) {
			let hasOwnProperty = Object.prototype.hasOwnProperty;
			for( var f in o ) {
			if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
				a.push(f);
			}
			}
		}
		return a;
	}
	static isFunction(f) {
		if(typeof(f) == "function") {
			return !(f.__name__ || f.__ename__);
		} else {
			return false;
		}
	}
	static compare(a,b) {
		if(a == b) {
			return 0;
		} else if(a > b) {
			return 1;
		} else {
			return -1;
		}
	}
	static compareMethods(f1,f2) {
		if(f1 == f2) {
			return true;
		}
		if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
			return false;
		}
		if(f1.scope == f2.scope && f1.method == f2.method) {
			return f1.method != null;
		} else {
			return false;
		}
	}
	static isObject(v) {
		if(v == null) {
			return false;
		}
		let t = typeof(v);
		if(!(t == "string" || t == "object" && v.__enum__ == null)) {
			if(t == "function") {
				return (v.__name__ || v.__ename__) != null;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	static isEnumValue(v) {
		if(v != null) {
			return v.__enum__ != null;
		} else {
			return false;
		}
	}
	static deleteField(o,field) {
		if(!Object.prototype.hasOwnProperty.call(o,field)) {
			return false;
		}
		delete(o[field]);
		return true;
	}
	static copy(o) {
		if(o == null) {
			return null;
		}
		let o2 = { };
		let _g = 0;
		let _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			let f = _g1[_g];
			++_g;
			o2[f] = Reflect.field(o,f);
		}
		return o2;
	}
	static makeVarArgs(f) {
		return function() {
			let a = Array.prototype.slice;
			let a1 = arguments;
			let a2 = a.call(a1);
			return f(a2);
		};
	}
}
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = "Reflect";
class Std {
	static is(v,t) {
		return js_Boot.__instanceof(v,t);
	}
	static isOfType(v,t) {
		return js_Boot.__instanceof(v,t);
	}
	static downcast(value,c) {
		if(js_Boot.__downcastCheck(value,c)) {
			return value;
		} else {
			return null;
		}
	}
	static instance(value,c) {
		if(js_Boot.__downcastCheck(value,c)) {
			return value;
		} else {
			return null;
		}
	}
	static string(s) {
		return js_Boot.__string_rec(s,"");
	}
	static int(x) {
		return x | 0;
	}
	static parseInt(x) {
		if(x != null) {
			let _g = 0;
			let _g1 = x.length;
			while(_g < _g1) {
				let i = _g++;
				let c = x.charCodeAt(i);
				if(c <= 8 || c >= 14 && c != 32 && c != 45) {
					let nc = x.charCodeAt(i + 1);
					let v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
					if(isNaN(v)) {
						return null;
					} else {
						return v;
					}
				}
			}
		}
		return null;
	}
	static parseFloat(x) {
		return parseFloat(x);
	}
	static random(x) {
		if(x <= 0) {
			return 0;
		} else {
			return Math.floor(Math.random() * x);
		}
	}
}
$hxClasses["Std"] = Std;
Std.__name__ = "Std";
class StringBuf {
	constructor() {
		this.b = "";
	}
	get_length() {
		return this.b.length;
	}
	add(x) {
		this.b += Std.string(x);
	}
	addChar(c) {
		this.b += String.fromCodePoint(c);
	}
	addSub(s,pos,len) {
		this.b += len == null ? HxOverrides.substr(s,pos,null) : HxOverrides.substr(s,pos,len);
	}
	toString() {
		return this.b;
	}
}
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = "StringBuf";
Object.assign(StringBuf.prototype, {
	__class__: StringBuf
	,b: null
	,__properties__: {get_length: "get_length"}
});
class haxe_SysTools {
	static quoteUnixArg(argument) {
		if(argument == "") {
			return "''";
		}
		if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
			return argument;
		}
		return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
	}
	static quoteWinArg(argument,escapeMetaCharacters) {
		if(!new EReg("^[^ \t\\\\\"]+$","").match(argument)) {
			let result_b = "";
			let needquote = argument.indexOf(" ") != -1 || argument.indexOf("\t") != -1 || argument == "";
			if(needquote) {
				result_b += "\"";
			}
			let bs_buf = new StringBuf();
			let _g = 0;
			let _g1 = argument.length;
			while(_g < _g1) {
				let i = _g++;
				let _g1 = HxOverrides.cca(argument,i);
				if(_g1 == null) {
					let c = _g1;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCodePoint(c);
				} else {
					switch(_g1) {
					case 34:
						let bs = bs_buf.b;
						result_b += bs == null ? "null" : "" + bs;
						result_b += bs == null ? "null" : "" + bs;
						bs_buf = new StringBuf();
						result_b += "\\\"";
						break;
					case 92:
						bs_buf.b += "\\";
						break;
					default:
						let c = _g1;
						if(bs_buf.b.length > 0) {
							result_b += Std.string(bs_buf.b);
							bs_buf = new StringBuf();
						}
						result_b += String.fromCodePoint(c);
					}
				}
			}
			result_b += Std.string(bs_buf.b);
			if(needquote) {
				result_b += Std.string(bs_buf.b);
				result_b += "\"";
			}
			argument = result_b;
		}
		if(escapeMetaCharacters) {
			let result_b = "";
			let _g = 0;
			let _g1 = argument.length;
			while(_g < _g1) {
				let i = _g++;
				let c = HxOverrides.cca(argument,i);
				if(haxe_SysTools.winMetaCharacters.indexOf(c) >= 0) {
					result_b += String.fromCodePoint(94);
				}
				result_b += String.fromCodePoint(c);
			}
			return result_b;
		} else {
			return argument;
		}
	}
}
$hxClasses["haxe.SysTools"] = haxe_SysTools;
haxe_SysTools.__name__ = "haxe.SysTools";
class StringTools {
	static urlEncode(s) {
		return encodeURIComponent(s);
	}
	static urlDecode(s) {
		return decodeURIComponent(s.split("+").join(" "));
	}
	static htmlEscape(s,quotes) {
		let buf_b = "";
		let _g_offset = 0;
		let _g_s = s;
		while(_g_offset < _g_s.length) {
			let s = _g_s;
			let index = _g_offset++;
			let c = s.charCodeAt(index);
			if(c >= 55296 && c <= 56319) {
				c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
			}
			let c1 = c;
			if(c1 >= 65536) {
				++_g_offset;
			}
			let code = c1;
			switch(code) {
			case 34:
				if(quotes) {
					buf_b += "&quot;";
				} else {
					buf_b += String.fromCodePoint(code);
				}
				break;
			case 38:
				buf_b += "&amp;";
				break;
			case 39:
				if(quotes) {
					buf_b += "&#039;";
				} else {
					buf_b += String.fromCodePoint(code);
				}
				break;
			case 60:
				buf_b += "&lt;";
				break;
			case 62:
				buf_b += "&gt;";
				break;
			default:
				buf_b += String.fromCodePoint(code);
			}
		}
		return buf_b;
	}
	static htmlUnescape(s) {
		return s.split("&gt;").join(">").split("&lt;").join("<").split("&quot;").join("\"").split("&#039;").join("'").split("&amp;").join("&");
	}
	static contains(s,value) {
		return s.includes(value);
	}
	static startsWith(s,start) {
		return s.startsWith(start);
	}
	static endsWith(s,end) {
		return s.endsWith(end);
	}
	static isSpace(s,pos) {
		let c = HxOverrides.cca(s,pos);
		if(!(c > 8 && c < 14)) {
			return c == 32;
		} else {
			return true;
		}
	}
	static ltrim(s) {
		let l = s.length;
		let r = 0;
		while(r < l && StringTools.isSpace(s,r)) ++r;
		if(r > 0) {
			return HxOverrides.substr(s,r,l - r);
		} else {
			return s;
		}
	}
	static rtrim(s) {
		let l = s.length;
		let r = 0;
		while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
		if(r > 0) {
			return HxOverrides.substr(s,0,l - r);
		} else {
			return s;
		}
	}
	static trim(s) {
		return StringTools.ltrim(StringTools.rtrim(s));
	}
	static lpad(s,c,l) {
		if(c.length <= 0) {
			return s;
		}
		let buf_b = "";
		l -= s.length;
		while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
		buf_b += s == null ? "null" : "" + s;
		return buf_b;
	}
	static rpad(s,c,l) {
		if(c.length <= 0) {
			return s;
		}
		let buf_b = "";
		buf_b += s == null ? "null" : "" + s;
		while(buf_b.length < l) buf_b += c == null ? "null" : "" + c;
		return buf_b;
	}
	static replace(s,sub,by) {
		return s.split(sub).join(by);
	}
	static hex(n,digits) {
		let s = "";
		let hexChars = "0123456789ABCDEF";
		while(true) {
			s = hexChars.charAt(n & 15) + s;
			n >>>= 4;
			if(!(n > 0)) {
				break;
			}
		}
		if(digits != null) {
			while(s.length < digits) s = "0" + s;
		}
		return s;
	}
	static fastCodeAt(s,index) {
		return s.charCodeAt(index);
	}
	static unsafeCodeAt(s,index) {
		return s.charCodeAt(index);
	}
	static iterator(s) {
		return new haxe_iterators_StringIterator(s);
	}
	static keyValueIterator(s) {
		return new haxe_iterators_StringKeyValueIterator(s);
	}
	static isEof(c) {
		return c != c;
	}
	static quoteUnixArg(argument) {
		if(argument == "") {
			return "''";
		} else if(!new EReg("[^a-zA-Z0-9_@%+=:,./-]","").match(argument)) {
			return argument;
		} else {
			return "'" + StringTools.replace(argument,"'","'\"'\"'") + "'";
		}
	}
	static quoteWinArg(argument,escapeMetaCharacters) {
		let argument1 = argument;
		if(!new EReg("^[^ \t\\\\\"]+$","").match(argument1)) {
			let result_b = "";
			let needquote = argument1.indexOf(" ") != -1 || argument1.indexOf("\t") != -1 || argument1 == "";
			if(needquote) {
				result_b += "\"";
			}
			let bs_buf = new StringBuf();
			let _g = 0;
			let _g1 = argument1.length;
			while(_g < _g1) {
				let i = _g++;
				let _g1 = HxOverrides.cca(argument1,i);
				if(_g1 == null) {
					let c = _g1;
					if(bs_buf.b.length > 0) {
						result_b += Std.string(bs_buf.b);
						bs_buf = new StringBuf();
					}
					result_b += String.fromCodePoint(c);
				} else {
					switch(_g1) {
					case 34:
						let bs = bs_buf.b;
						result_b += Std.string(bs);
						result_b += Std.string(bs);
						bs_buf = new StringBuf();
						result_b += "\\\"";
						break;
					case 92:
						bs_buf.b += "\\";
						break;
					default:
						let c = _g1;
						if(bs_buf.b.length > 0) {
							result_b += Std.string(bs_buf.b);
							bs_buf = new StringBuf();
						}
						result_b += String.fromCodePoint(c);
					}
				}
			}
			result_b += Std.string(bs_buf.b);
			if(needquote) {
				result_b += Std.string(bs_buf.b);
				result_b += "\"";
			}
			argument1 = result_b;
		}
		if(escapeMetaCharacters) {
			let result_b = "";
			let _g = 0;
			let _g1 = argument1.length;
			while(_g < _g1) {
				let i = _g++;
				let c = HxOverrides.cca(argument1,i);
				if(haxe_SysTools.winMetaCharacters.indexOf(c) >= 0) {
					result_b += String.fromCodePoint(94);
				}
				result_b += String.fromCodePoint(c);
			}
			return result_b;
		} else {
			return argument1;
		}
	}
	static utf16CodePointAt(s,index) {
		let c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		return c;
	}
}
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = "StringTools";
var ValueType = $hxEnums["ValueType"] = { __ename__:"ValueType",__constructs__:null
	,TNull: {_hx_name:"TNull",_hx_index:0,__enum__:"ValueType"}
	,TInt: {_hx_name:"TInt",_hx_index:1,__enum__:"ValueType"}
	,TFloat: {_hx_name:"TFloat",_hx_index:2,__enum__:"ValueType"}
	,TBool: {_hx_name:"TBool",_hx_index:3,__enum__:"ValueType"}
	,TObject: {_hx_name:"TObject",_hx_index:4,__enum__:"ValueType"}
	,TFunction: {_hx_name:"TFunction",_hx_index:5,__enum__:"ValueType"}
	,TClass: ($_=function(c) { return {_hx_index:6,c:c,__enum__:"ValueType"}; },$_._hx_name="TClass",$_.__params__ = ["c"],$_)
	,TEnum: ($_=function(e) { return {_hx_index:7,e:e,__enum__:"ValueType"}; },$_._hx_name="TEnum",$_.__params__ = ["e"],$_)
	,TUnknown: {_hx_name:"TUnknown",_hx_index:8,__enum__:"ValueType"}
};
ValueType.__constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TClass,ValueType.TEnum,ValueType.TUnknown];
ValueType.__empty_constructs__ = [ValueType.TNull,ValueType.TInt,ValueType.TFloat,ValueType.TBool,ValueType.TObject,ValueType.TFunction,ValueType.TUnknown];
class Type {
	static getClass(o) {
		return js_Boot.getClass(o);
	}
	static getEnum(o) {
		if(o == null) {
			return null;
		}
		return $hxEnums[o.__enum__];
	}
	static getSuperClass(c) {
		return c.__super__;
	}
	static getClassName(c) {
		return c.__name__;
	}
	static getEnumName(e) {
		return e.__ename__;
	}
	static resolveClass(name) {
		return $hxClasses[name];
	}
	static resolveEnum(name) {
		return $hxEnums[name];
	}
	static createInstance(cl,args) {
		let ctor = Function.prototype.bind.apply(cl,[null].concat(args));
		return new (ctor);
	}
	static createEmptyInstance(cl) {
		return Object.create(cl.prototype);
	}
	static createEnum(e,constr,params) {
		let f = Reflect.field(e,constr);
		if(f == null) {
			throw haxe_Exception.thrown("No such constructor " + constr);
		}
		if(Reflect.isFunction(f)) {
			if(params == null) {
				throw haxe_Exception.thrown("Constructor " + constr + " need parameters");
			}
			return f.apply(e,params);
		}
		if(params != null && params.length != 0) {
			throw haxe_Exception.thrown("Constructor " + constr + " does not need parameters");
		}
		return f;
	}
	static createEnumIndex(e,index,params) {
		let c;
		let _g = e.__constructs__[index];
		if(_g == null) {
			c = null;
		} else {
			let ctor = _g;
			c = ctor._hx_name;
		}
		if(c == null) {
			throw haxe_Exception.thrown(index + " is not a valid enum constructor index");
		}
		return Type.createEnum(e,c,params);
	}
	static getInstanceFields(c) {
		let result = [];
		while(c != null) {
			let _g = 0;
			let _g1 = Object.getOwnPropertyNames(c.prototype);
			while(_g < _g1.length) {
				let name = _g1[_g];
				++_g;
				switch(name) {
				case "__class__":case "__properties__":case "constructor":
					break;
				default:
					if(result.indexOf(name) == -1) {
						result.push(name);
					}
				}
			}
			c = c.__super__;
		}
		return result;
	}
	static getClassFields(c) {
		let a = Object.getOwnPropertyNames(c);
		HxOverrides.remove(a,"__id__");
		HxOverrides.remove(a,"hx__closures__");
		HxOverrides.remove(a,"__name__");
		HxOverrides.remove(a,"__interfaces__");
		HxOverrides.remove(a,"__isInterface__");
		HxOverrides.remove(a,"__properties__");
		HxOverrides.remove(a,"__instanceFields__");
		HxOverrides.remove(a,"__super__");
		HxOverrides.remove(a,"__meta__");
		HxOverrides.remove(a,"prototype");
		HxOverrides.remove(a,"name");
		HxOverrides.remove(a,"length");
		return a;
	}
	static getEnumConstructs(e) {
		let _this = e.__constructs__;
		let result = new Array(_this.length);
		let _g = 0;
		let _g1 = _this.length;
		while(_g < _g1) {
			let i = _g++;
			result[i] = _this[i]._hx_name;
		}
		return result;
	}
	static typeof(v) {
		switch(typeof(v)) {
		case "boolean":
			return ValueType.TBool;
		case "function":
			if(v.__name__ || v.__ename__) {
				return ValueType.TObject;
			}
			return ValueType.TFunction;
		case "number":
			if(Math.ceil(v) == v % 2147483648.0) {
				return ValueType.TInt;
			}
			return ValueType.TFloat;
		case "object":
			if(v == null) {
				return ValueType.TNull;
			}
			let e = v.__enum__;
			if(e != null) {
				return ValueType.TEnum($hxEnums[e]);
			}
			let c = js_Boot.getClass(v);
			if(c != null) {
				return ValueType.TClass(c);
			}
			return ValueType.TObject;
		case "string":
			return ValueType.TClass(String);
		case "undefined":
			return ValueType.TNull;
		default:
			return ValueType.TUnknown;
		}
	}
	static enumEq(a,b) {
		if(a == b) {
			return true;
		}
		try {
			let e = a.__enum__;
			if(e == null || e != b.__enum__) {
				return false;
			}
			if(a._hx_index != b._hx_index) {
				return false;
			}
			let enm = $hxEnums[e];
			let params = enm.__constructs__[a._hx_index].__params__;
			let _g = 0;
			while(_g < params.length) {
				let f = params[_g];
				++_g;
				if(!Type.enumEq(a[f],b[f])) {
					return false;
				}
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return false;
		}
		return true;
	}
	static enumConstructor(e) {
		return $hxEnums[e.__enum__].__constructs__[e._hx_index]._hx_name;
	}
	static enumParameters(e) {
		let enm = $hxEnums[e.__enum__];
		let params = enm.__constructs__[e._hx_index].__params__;
		if(params != null) {
			let _g = [];
			let _g1 = 0;
			while(_g1 < params.length) {
				let p = params[_g1];
				++_g1;
				_g.push(e[p]);
			}
			return _g;
		} else {
			return [];
		}
	}
	static enumIndex(e) {
		return e._hx_index;
	}
	static allEnums(e) {
		return e.__empty_constructs__.slice();
	}
}
$hxClasses["Type"] = Type;
Type.__name__ = "Type";
class dropecho_interop_AbstractArray {
	static _new(a) {
		let this1;
		if(a != null) {
			this1 = a;
		} else {
			this1 = [];
		}
		return this1;
	}
	static get(this1,i) {
		return this1[i];
	}
	static set(this1,i,v) {
		return this1[i] = v;
	}
	static fromAny(d) {
		let arr = js_Boot.__cast(d , Array);
		let _g = [];
		let _g1 = 0;
		while(_g1 < arr.length) {
			let v = arr[_g1];
			++_g1;
			_g.push(v);
		}
		return dropecho_interop_AbstractArray._new(_g);
	}
}
class dropecho_interop_Action_$0 {
	static fromHaxe(f) {
		return f;
	}
	static toHaxe(this1) {
		return this1;
	}
	static call(this1) {
		this1();
	}
}
class dropecho_interop_Action_$1 {
	static fromHaxe(f) {
		return f;
	}
	static toHaxe(this1) {
		return this1;
	}
	static call(this1,p1) {
		this1(p1);
	}
}
class dropecho_interop_Action_$2 {
	static fromHaxe(f) {
		return f;
	}
	static toHaxe(this1) {
		return this1;
	}
	static call(this1,p1,p2) {
		this1(p1,p2);
	}
}
class dropecho_interop_Func_$0 {
	static fromHaxe(f) {
		return f;
	}
	static toHaxe(this1) {
		return this1;
	}
	static call(this1) {
		return this1();
	}
}
class dropecho_interop_Func_$1 {
	static fromHaxe(f) {
		return f;
	}
	static toHaxe(this1) {
		let _e = this1;
		return function(p1) {
			return _e(p1);
		};
	}
	static call(this1,p1) {
		return this1(p1);
	}
}
class dropecho_interop_Func_$2 {
	static fromHaxe(f) {
		return f;
	}
	static toHaxe(this1) {
		return this1;
	}
	static call(this1,p1,p2) {
		return this1(p1,p2);
	}
}
class dropecho_interop_AbstractMap {
	static _new(s) {
		let this1;
		if(s != null) {
			this1 = s;
		} else {
			let this2 = { };
			this1 = this2;
		}
		return this1;
	}
	static get(this1,key) {
		return this1[Std.string(key)];
	}
	static set(this1,key,value) {
		this1[Std.string(key)] = value;
		return value;
	}
	static fromDynamic(map) {
		return dropecho_interop_AbstractMap._new(map);
	}
	static fromDynamicAccess(map) {
		return dropecho_interop_AbstractMap._new(map);
	}
	static fromMap(map) {
		let abs = dropecho_interop_AbstractMap._new();
		let _g = map.keyValueIterator();
		while(_g.hasNext()) {
			let _g1 = _g.next();
			let k = _g1.key;
			let v = _g1.value;
			abs[Std.string(k)] = v;
		}
		return abs;
	}
	static fromIMap(map) {
		let abs = dropecho_interop_AbstractMap._new();
		let _g = map.keyValueIterator();
		while(_g.hasNext()) {
			let _g1 = _g.next();
			let k = _g1.key;
			let v = _g1.value;
			abs[Std.string(k)] = v;
		}
		return abs;
	}
}
class dropecho_interop_Extender {
	static extendThis(base,extension) {
		if(extension == null) {
			return;
		}
		let _g = 0;
		let _g1 = Reflect.fields(base);
		while(_g < _g1.length) {
			let f = _g1[_g];
			++_g;
			let def = Reflect.field(base,f);
			let opt = Reflect.field(extension,f);
			base[f] = opt != null ? opt : def;
		}
	}
	static defaults(base,extension) {
		if(base == null) {
			throw haxe_Exception.thrown("Base cannot be null.");
		}
		if(extension == null) {
			return base;
		}
		let extensions = [];
		if(((extension) instanceof Array)) {
			extensions = extension.filter(function(x) {
				return x != null;
			});
		} else {
			extensions.push(extension);
		}
		let _g = 0;
		while(_g < extensions.length) {
			let ex = extensions[_g];
			++_g;
			let fields = Reflect.fields(ex);
			let exType = js_Boot.getClass(ex);
			let typeFields;
			if(exType != null) {
				let _this = Type.getInstanceFields(exType);
				let result = new Array(_this.length);
				let _g = 0;
				let _g1 = _this.length;
				while(_g < _g1) {
					let i = _g++;
					let f = _this[i];
					let typeFields;
					if(f.startsWith("get_") || f.startsWith("set_")) {
						let parts = f.split("_");
						parts.shift();
						typeFields = parts.join("_");
					} else {
						typeFields = f;
					}
					result[i] = typeFields;
				}
				typeFields = result;
			} else {
				typeFields = [];
			}
			if(fields.length == 0) {
				fields = typeFields;
			}
			let baseFields = [];
			let baseClass = js_Boot.getClass(base);
			if(baseClass != null) {
				baseFields = Type.getInstanceFields(baseClass);
			}
			let _g1 = 0;
			while(_g1 < fields.length) {
				let ff = fields[_g1];
				++_g1;
				let exField = Reflect.field(ex,ff);
				let baseField = Reflect.field(base,ff);
				let bfIsArray = dropecho_interop_Extender.isArray(baseField);
				let bfIsMap = dropecho_interop_Extender.isMap(baseField);
				let bfIsObject = !bfIsArray && !bfIsMap && dropecho_interop_Extender.isObject(baseField);
				if(bfIsArray) {
					let copy = dropecho_interop_AbstractArray.fromAny(exField);
					let _g = 0;
					let _g1 = copy;
					while(_g < _g1.length) {
						let v = _g1[_g];
						++_g;
						baseField.push(v);
					}
				} else if(bfIsMap) {
					let abs = dropecho_interop_AbstractMap._new();
					let _g = exField.keyValueIterator();
					while(_g.hasNext()) {
						let _g1 = _g.next();
						let k = _g1.key;
						let v = _g1.value;
						abs[Std.string(k)] = v;
					}
					let copy = abs;
					let access = copy;
					let _g_access = access;
					let _g_keys = Reflect.fields(access);
					let _g_index = 0;
					while(_g_index < _g_keys.length) {
						let key = _g_keys[_g_index++];
						let _g1_value = _g_access[key];
						let _g1_key = key;
						let k = _g1_key;
						let v = _g1_value;
						baseField.set(k,v);
					}
				} else if(bfIsObject) {
					dropecho_interop_Extender.defaults(baseField,exField);
				} else {
					try {
						base[ff] = exField;
					} catch( _g ) {
						haxe_NativeStackTrace.lastError = _g;
						let ex = haxe_Exception.caught(_g).unwrap();
						haxe_Log.trace("FAILED SETTING PROP: " + ff + " error: " + Std.string(ex),{ fileName : "src/dropecho/interop/Extender.hx", lineNumber : 85, className : "dropecho.interop.Extender", methodName : "defaults"});
					}
				}
			}
		}
		return base;
	}
	static isObject(obj) {
		let stdis = Reflect.isObject(obj);
		let type = js_Boot.getClass(obj);
		let name = type != null ? type.__name__ : "";
		let refis = name != "String";
		if(stdis) {
			return refis;
		} else {
			return false;
		}
	}
	static isArray(obj) {
		return ((obj) instanceof Array);
	}
	static isMap(obj) {
		if(((obj) instanceof Map)) {
			return true;
		}
		let type = js_Boot.getClass(obj);
		let name = type != null ? type.__name__ : "";
		if(name == null) {
			name = "";
		}
		let isMap = name.startsWith("haxe.ds.") && name.endsWith("Map");
		return isMap;
	}
}
$hxClasses["dropecho.interop.Extender"] = dropecho_interop_Extender;
dropecho_interop_Extender.__name__ = "dropecho.interop.Extender";
class dropecho_interop_test_TestArray {
	constructor() {
		this.array = dropecho_interop_AbstractArray._new();
		this.nested = dropecho_interop_AbstractArray._new();
	}
}
$hxClasses["dropecho.interop.test.TestArray"] = $hx_exports["TestArray"] = dropecho_interop_test_TestArray;
dropecho_interop_test_TestArray.__name__ = "dropecho.interop.test.TestArray";
Object.assign(dropecho_interop_test_TestArray.prototype, {
	__class__: dropecho_interop_test_TestArray
	,array: null
	,nested: null
});
class dropecho_interop_test_TestClassConfig {
	constructor() {
	}
}
$hxClasses["dropecho.interop.test.TestClassConfig"] = $hx_exports["TestClassConfig"] = dropecho_interop_test_TestClassConfig;
dropecho_interop_test_TestClassConfig.__name__ = "dropecho.interop.test.TestClassConfig";
Object.assign(dropecho_interop_test_TestClassConfig.prototype, {
	__class__: dropecho_interop_test_TestClassConfig
	,i: null
	,f: null
});
class dropecho_interop_test_TestThisClass {
	constructor(opts) {
		this.subarr = dropecho_interop_AbstractArray._new();
		this.a = [];
		this.m = dropecho_interop_AbstractMap._new();
		dropecho_interop_Extender.defaults(this,opts);
		let b_0 = 1;
		let b_1 = 2;
		let b_2 = 3;
		let x = b_1;
	}
	test() {
		return this.subarr[0].i + this.i;
	}
}
$hxClasses["dropecho.interop.test.TestThisClass"] = $hx_exports["TestThisClass"] = dropecho_interop_test_TestThisClass;
dropecho_interop_test_TestThisClass.__name__ = "dropecho.interop.test.TestThisClass";
Object.assign(dropecho_interop_test_TestThisClass.prototype, {
	__class__: dropecho_interop_test_TestThisClass
	,i: null
	,f: null
	,m: null
	,a: null
	,subarr: null
});
class dropecho_interop_test_TestAnotherClass {
}
$hxClasses["dropecho.interop.test.TestAnotherClass"] = dropecho_interop_test_TestAnotherClass;
dropecho_interop_test_TestAnotherClass.__name__ = "dropecho.interop.test.TestAnotherClass";
class dropecho_interop_test_TestFunc {
	constructor() {
		this.Action0 = function() {
			haxe_Log.trace("wee",{ fileName : "src/dropecho/interop/test/TestFunc.hx", lineNumber : 15, className : "dropecho.interop.test.TestFunc", methodName : "new"});
		};
		this.Func0 = function() {
			return 32;
		};
		this.Func1 = function(v) {
			return v;
		};
	}
}
$hxClasses["dropecho.interop.test.TestFunc"] = $hx_exports["TestFunc"] = dropecho_interop_test_TestFunc;
dropecho_interop_test_TestFunc.__name__ = "dropecho.interop.test.TestFunc";
Object.assign(dropecho_interop_test_TestFunc.prototype, {
	__class__: dropecho_interop_test_TestFunc
	,Action0: null
	,Action1: null
	,Action2: null
	,Func0: null
	,Func1: null
	,Func2: null
});
class dropecho_interop_test_TestMap {
	constructor() {
		this.map = dropecho_interop_AbstractMap._new();
		this.nested = dropecho_interop_AbstractMap._new();
	}
	createDynAcces() {
		this.dyn = { };
		this.dyn["test"] = 1;
		return this.dyn;
	}
}
$hxClasses["dropecho.interop.test.TestMap"] = $hx_exports["TestMap"] = dropecho_interop_test_TestMap;
dropecho_interop_test_TestMap.__name__ = "dropecho.interop.test.TestMap";
Object.assign(dropecho_interop_test_TestMap.prototype, {
	__class__: dropecho_interop_test_TestMap
	,map: null
	,nested: null
	,dyn: null
});
var haxe_StackItem = $hxEnums["haxe.StackItem"] = { __ename__:"haxe.StackItem",__constructs__:null
	,CFunction: {_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem"}
	,Module: ($_=function(m) { return {_hx_index:1,m:m,__enum__:"haxe.StackItem"}; },$_._hx_name="Module",$_.__params__ = ["m"],$_)
	,FilePos: ($_=function(s,file,line,column) { return {_hx_index:2,s:s,file:file,line:line,column:column,__enum__:"haxe.StackItem"}; },$_._hx_name="FilePos",$_.__params__ = ["s","file","line","column"],$_)
	,Method: ($_=function(classname,method) { return {_hx_index:3,classname:classname,method:method,__enum__:"haxe.StackItem"}; },$_._hx_name="Method",$_.__params__ = ["classname","method"],$_)
	,LocalFunction: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.StackItem"}; },$_._hx_name="LocalFunction",$_.__params__ = ["v"],$_)
};
haxe_StackItem.__constructs__ = [haxe_StackItem.CFunction,haxe_StackItem.Module,haxe_StackItem.FilePos,haxe_StackItem.Method,haxe_StackItem.LocalFunction];
haxe_StackItem.__empty_constructs__ = [haxe_StackItem.CFunction];
class haxe_CallStack {
	static get_length(this1) {
		return this1.length;
	}
	static callStack() {
		return haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.callStack());
	}
	static exceptionStack(fullStack) {
		if(fullStack == null) {
			fullStack = false;
		}
		let eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack());
		return fullStack ? eStack : haxe_CallStack.subtract(eStack,haxe_CallStack.callStack());
	}
	static toString(stack) {
		let b = new StringBuf();
		let _g = 0;
		let _g1 = stack;
		while(_g < _g1.length) {
			let s = _g1[_g];
			++_g;
			b.b += "\nCalled from ";
			haxe_CallStack.itemToString(b,s);
		}
		return b.b;
	}
	static subtract(this1,stack) {
		let startIndex = -1;
		let i = -1;
		while(++i < this1.length) {
			let _g = 0;
			let _g1 = stack.length;
			while(_g < _g1) {
				let j = _g++;
				if(haxe_CallStack.equalItems(this1[i],stack[j])) {
					if(startIndex < 0) {
						startIndex = i;
					}
					++i;
					if(i >= this1.length) {
						break;
					}
				} else {
					startIndex = -1;
				}
			}
			if(startIndex >= 0) {
				break;
			}
		}
		if(startIndex >= 0) {
			return this1.slice(0,startIndex);
		} else {
			return this1;
		}
	}
	static copy(this1) {
		return this1.slice();
	}
	static get(this1,index) {
		return this1[index];
	}
	static asArray(this1) {
		return this1;
	}
	static equalItems(item1,item2) {
		if(item1 == null) {
			if(item2 == null) {
				return true;
			} else {
				return false;
			}
		} else {
			switch(item1._hx_index) {
			case 0:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 0) {
					return true;
				} else {
					return false;
				}
				break;
			case 1:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 1) {
					let m2 = item2.m;
					let m1 = item1.m;
					return m1 == m2;
				} else {
					return false;
				}
				break;
			case 2:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 2) {
					let item21 = item2.s;
					let file2 = item2.file;
					let line2 = item2.line;
					let col2 = item2.column;
					let col1 = item1.column;
					let line1 = item1.line;
					let file1 = item1.file;
					let item11 = item1.s;
					if(file1 == file2 && line1 == line2 && col1 == col2) {
						return haxe_CallStack.equalItems(item11,item21);
					} else {
						return false;
					}
				} else {
					return false;
				}
				break;
			case 3:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 3) {
					let class2 = item2.classname;
					let method2 = item2.method;
					let method1 = item1.method;
					let class1 = item1.classname;
					if(class1 == class2) {
						return method1 == method2;
					} else {
						return false;
					}
				} else {
					return false;
				}
				break;
			case 4:
				if(item2 == null) {
					return false;
				} else if(item2._hx_index == 4) {
					let v2 = item2.v;
					let v1 = item1.v;
					return v1 == v2;
				} else {
					return false;
				}
				break;
			}
		}
	}
	static exceptionToString(e) {
		if(e.get_previous() == null) {
			let tmp = "Exception: " + e.toString();
			let tmp1 = e.get_stack();
			return tmp + (tmp1 == null ? "null" : haxe_CallStack.toString(tmp1));
		}
		let result = "";
		let e1 = e;
		let prev = null;
		while(e1 != null) {
			if(prev == null) {
				let result1 = "Exception: " + e1.get_message();
				let tmp = e1.get_stack();
				result = result1 + (tmp == null ? "null" : haxe_CallStack.toString(tmp)) + result;
			} else {
				let prevStack = haxe_CallStack.subtract(e1.get_stack(),prev.get_stack());
				result = "Exception: " + e1.get_message() + (prevStack == null ? "null" : haxe_CallStack.toString(prevStack)) + "\n\nNext " + result;
			}
			prev = e1;
			e1 = e1.get_previous();
		}
		return result;
	}
	static itemToString(b,s) {
		switch(s._hx_index) {
		case 0:
			b.b += "a C function";
			break;
		case 1:
			let m = s.m;
			b.b += "module ";
			b.b += m == null ? "null" : "" + m;
			break;
		case 2:
			let s1 = s.s;
			let file = s.file;
			let line = s.line;
			let col = s.column;
			if(s1 != null) {
				haxe_CallStack.itemToString(b,s1);
				b.b += " (";
			}
			b.b += file == null ? "null" : "" + file;
			b.b += " line ";
			b.b += line == null ? "null" : "" + line;
			if(col != null) {
				b.b += " column ";
				b.b += col == null ? "null" : "" + col;
			}
			if(s1 != null) {
				b.b += ")";
			}
			break;
		case 3:
			let cname = s.classname;
			let meth = s.method;
			b.b += Std.string(cname == null ? "<unknown>" : cname);
			b.b += ".";
			b.b += meth == null ? "null" : "" + meth;
			break;
		case 4:
			let n = s.v;
			b.b += "local function #";
			b.b += n == null ? "null" : "" + n;
			break;
		}
	}
}
haxe_CallStack.__properties__ = {get_length: "get_length"};
class haxe_IMap {
}
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = "haxe.IMap";
haxe_IMap.__isInterface__ = true;
Object.assign(haxe_IMap.prototype, {
	__class__: haxe_IMap
	,get: null
	,set: null
	,exists: null
	,remove: null
	,keys: null
	,iterator: null
	,keyValueIterator: null
	,copy: null
	,toString: null
	,clear: null
});
class haxe_DynamicAccess {
	static _new() {
		let this1 = { };
		return this1;
	}
	static get(this1,key) {
		return this1[key];
	}
	static set(this1,key,value) {
		return this1[key] = value;
	}
	static exists(this1,key) {
		return Object.prototype.hasOwnProperty.call(this1,key);
	}
	static remove(this1,key) {
		return Reflect.deleteField(this1,key);
	}
	static keys(this1) {
		return Reflect.fields(this1);
	}
	static copy(this1) {
		return Reflect.copy(this1);
	}
	static iterator(this1) {
		return new haxe_iterators_DynamicAccessIterator(this1);
	}
	static keyValueIterator(this1) {
		return new haxe_iterators_DynamicAccessKeyValueIterator(this1);
	}
}
class haxe_Exception extends Error {
	constructor(message,previous,native) {
		super(message);
		this.message = message;
		this.__previousException = previous;
		this.__nativeException = native != null ? native : this;
		this.__skipStack = 0;
		let old = Error.prepareStackTrace;
		Error.prepareStackTrace = function(e) { return e.stack; }
		if(((native) instanceof Error)) {
			this.stack = native.stack;
		} else {
			let e = null;
			if(Error.captureStackTrace) {
				Error.captureStackTrace(this,haxe_Exception);
				e = this;
			} else {
				e = new Error();
				if(typeof(e.stack) == "undefined") {
					try { throw e; } catch(_) {}
					this.__skipStack++;
				}
			}
			this.stack = e.stack;
		}
		Error.prepareStackTrace = old;
	}
	unwrap() {
		return this.__nativeException;
	}
	toString() {
		return this.get_message();
	}
	details() {
		if(this.get_previous() == null) {
			let tmp = "Exception: " + this.toString();
			let tmp1 = this.get_stack();
			return tmp + (tmp1 == null ? "null" : haxe_CallStack.toString(tmp1));
		} else {
			let result = "";
			let e = this;
			let prev = null;
			while(e != null) {
				if(prev == null) {
					let result1 = "Exception: " + e.get_message();
					let tmp = e.get_stack();
					result = result1 + (tmp == null ? "null" : haxe_CallStack.toString(tmp)) + result;
				} else {
					let prevStack = haxe_CallStack.subtract(e.get_stack(),prev.get_stack());
					result = "Exception: " + e.get_message() + (prevStack == null ? "null" : haxe_CallStack.toString(prevStack)) + "\n\nNext " + result;
				}
				prev = e;
				e = e.get_previous();
			}
			return result;
		}
	}
	__shiftStack() {
		this.__skipStack++;
	}
	get_message() {
		return this.message;
	}
	get_previous() {
		return this.__previousException;
	}
	get_native() {
		return this.__nativeException;
	}
	get_stack() {
		let _g = this.__exceptionStack;
		if(_g == null) {
			let value = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.normalize(this.stack),this.__skipStack);
			this.setProperty("__exceptionStack",value);
			return value;
		} else {
			let s = _g;
			return s;
		}
	}
	setProperty(name,value) {
		try {
			Object.defineProperty(this,name,{ value : value});
		} catch( _g ) {
			this[name] = value;
		}
	}
	get___exceptionStack() {
		return this.__exceptionStack;
	}
	set___exceptionStack(value) {
		this.setProperty("__exceptionStack",value);
		return value;
	}
	get___skipStack() {
		return this.__skipStack;
	}
	set___skipStack(value) {
		this.setProperty("__skipStack",value);
		return value;
	}
	get___nativeException() {
		return this.__nativeException;
	}
	set___nativeException(value) {
		this.setProperty("__nativeException",value);
		return value;
	}
	get___previousException() {
		return this.__previousException;
	}
	set___previousException(value) {
		this.setProperty("__previousException",value);
		return value;
	}
	static caught(value) {
		if(((value) instanceof haxe_Exception)) {
			return value;
		} else if(((value) instanceof Error)) {
			return new haxe_Exception(value.message,null,value);
		} else {
			return new haxe_ValueException(value,null,value);
		}
	}
	static thrown(value) {
		if(((value) instanceof haxe_Exception)) {
			return value.get_native();
		} else if(((value) instanceof Error)) {
			return value;
		} else {
			let e = new haxe_ValueException(value);
			e.__skipStack++;
			return e;
		}
	}
}
$hxClasses["haxe.Exception"] = haxe_Exception;
haxe_Exception.__name__ = "haxe.Exception";
haxe_Exception.__super__ = Error;
Object.assign(haxe_Exception.prototype, {
	__class__: haxe_Exception
	,__skipStack: null
	,__nativeException: null
	,__previousException: null
	,__properties__: {set___exceptionStack: "set___exceptionStack",get___exceptionStack: "get___exceptionStack",get_native: "get_native",get_previous: "get_previous",get_stack: "get_stack",get_message: "get_message"}
});
class haxe_Log {
	static formatOutput(v,infos) {
		let str = Std.string(v);
		if(infos == null) {
			return str;
		}
		let pstr = infos.fileName + ":" + infos.lineNumber;
		if(infos.customParams != null) {
			let _g = 0;
			let _g1 = infos.customParams;
			while(_g < _g1.length) {
				let v = _g1[_g];
				++_g;
				str += ", " + Std.string(v);
			}
		}
		return pstr + ": " + str;
	}
	static trace(v,infos) {
		let str = haxe_Log.formatOutput(v,infos);
		if(typeof(console) != "undefined" && console.log != null) {
			console.log(str);
		}
	}
}
$hxClasses["haxe.Log"] = haxe_Log;
haxe_Log.__name__ = "haxe.Log";
class haxe_NativeStackTrace {
	static saveStack(e) {
		haxe_NativeStackTrace.lastError = e;
	}
	static callStack() {
		let e = new Error("");
		let stack = haxe_NativeStackTrace.tryHaxeStack(e);
		if(typeof(stack) == "undefined") {
			try {
				throw e;
			} catch( _g ) {
			}
			stack = e.stack;
		}
		return haxe_NativeStackTrace.normalize(stack,2);
	}
	static exceptionStack() {
		return haxe_NativeStackTrace.normalize(haxe_NativeStackTrace.tryHaxeStack(haxe_NativeStackTrace.lastError));
	}
	static toHaxe(s,skip) {
		if(skip == null) {
			skip = 0;
		}
		if(s == null) {
			return [];
		} else if(typeof(s) == "string") {
			let stack = s.split("\n");
			if(stack[0] == "Error") {
				stack.shift();
			}
			let m = [];
			let _g = 0;
			let _g1 = stack.length;
			while(_g < _g1) {
				let i = _g++;
				if(skip > i) {
					continue;
				}
				let line = stack[i];
				let matched = line.match(/^    at ([A-Za-z0-9_. ]+) \(([^)]+):([0-9]+):([0-9]+)\)$/);
				if(matched != null) {
					let path = matched[1].split(".");
					if(path[0] == "$hxClasses") {
						path.shift();
					}
					let meth = path.pop();
					let file = matched[2];
					let line = Std.parseInt(matched[3]);
					let column = Std.parseInt(matched[4]);
					m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line,column));
				} else {
					m.push(haxe_StackItem.Module(StringTools.trim(line)));
				}
			}
			return m;
		} else if(skip > 0 && Array.isArray(s)) {
			return s.slice(skip);
		} else {
			return s;
		}
	}
	static tryHaxeStack(e) {
		if(e == null) {
			return [];
		}
		let oldValue = Error.prepareStackTrace;
		Error.prepareStackTrace = haxe_NativeStackTrace.prepareHxStackTrace;
		let stack = e.stack;
		Error.prepareStackTrace = oldValue;
		return stack;
	}
	static prepareHxStackTrace(e,callsites) {
		let stack = [];
		let _g = 0;
		while(_g < callsites.length) {
			let site = callsites[_g];
			++_g;
			if(haxe_NativeStackTrace.wrapCallSite != null) {
				site = haxe_NativeStackTrace.wrapCallSite(site);
			}
			let method = null;
			let fullName = site.getFunctionName();
			if(fullName != null) {
				let idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					let className = fullName.substring(0,idx);
					let methodName = fullName.substring(idx + 1);
					method = haxe_StackItem.Method(className,methodName);
				} else {
					method = haxe_StackItem.Method(null,fullName);
				}
			}
			let fileName = site.getFileName();
			let fileAddr = fileName == null ? -1 : fileName.indexOf("file:");
			if(haxe_NativeStackTrace.wrapCallSite != null && fileAddr > 0) {
				fileName = fileName.substring(fileAddr + 6);
			}
			stack.push(haxe_StackItem.FilePos(method,fileName,site.getLineNumber(),site.getColumnNumber()));
		}
		return stack;
	}
	static normalize(stack,skipItems) {
		if(skipItems == null) {
			skipItems = 0;
		}
		if(Array.isArray(stack) && skipItems > 0) {
			return stack.slice(skipItems);
		} else if(typeof(stack) == "string") {
			switch(stack.substring(0,6)) {
			case "Error\n":case "Error:":
				++skipItems;
				break;
			default:
			}
			return haxe_NativeStackTrace.skipLines(stack,skipItems);
		} else {
			return stack;
		}
	}
	static skipLines(stack,skip,pos) {
		if(pos == null) {
			pos = 0;
		}
		if(skip > 0) {
			pos = stack.indexOf("\n",pos);
			if(pos < 0) {
				return "";
			} else {
				return haxe_NativeStackTrace.skipLines(stack,--skip,pos + 1);
			}
		} else {
			return stack.substring(pos);
		}
	}
}
haxe_NativeStackTrace.lastError = null;
haxe_NativeStackTrace.wrapCallSite = null;
$hxClasses["haxe.NativeStackTrace"] = haxe_NativeStackTrace;
haxe_NativeStackTrace.__name__ = "haxe.NativeStackTrace";
class haxe_Rest {
	static get_length(this1) {
		return this1.length;
	}
	static of(array) {
		let this1 = array;
		return this1;
	}
	static _new(array) {
		let this1 = array;
		return this1;
	}
	static get(this1,index) {
		return this1[index];
	}
	static toArray(this1) {
		return this1.slice();
	}
	static iterator(this1) {
		return new haxe_iterators_RestIterator(this1);
	}
	static keyValueIterator(this1) {
		return new haxe_iterators_RestKeyValueIterator(this1);
	}
	static append(this1,item) {
		let result = this1.slice();
		result.push(item);
		let this2 = result;
		return this2;
	}
	static prepend(this1,item) {
		let result = this1.slice();
		result.unshift(item);
		let this2 = result;
		return this2;
	}
	static toString(this1) {
		return "[" + this1.toString() + "]";
	}
}
haxe_Rest.__properties__ = {get_length: "get_length"};
class haxe_ValueException extends haxe_Exception {
	constructor(value,previous,native) {
		super(String(value),previous,native);
		this.value = value;
		this.__skipStack++;
	}
	unwrap() {
		return this.value;
	}
}
$hxClasses["haxe.ValueException"] = haxe_ValueException;
haxe_ValueException.__name__ = "haxe.ValueException";
haxe_ValueException.__super__ = haxe_Exception;
Object.assign(haxe_ValueException.prototype, {
	__class__: haxe_ValueException
	,value: null
});
class haxe_ds_BalancedTree {
	constructor() {
	}
	set(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	get(key) {
		let node = this.root;
		while(node != null) {
			let c = this.compare(key,node.key);
			if(c == 0) {
				return node.value;
			}
			if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return null;
	}
	remove(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			if(typeof(haxe_Exception.caught(_g).unwrap()) == "string") {
				return false;
			} else {
				throw _g;
			}
		}
	}
	exists(key) {
		let node = this.root;
		while(node != null) {
			let c = this.compare(key,node.key);
			if(c == 0) {
				return true;
			} else if(c < 0) {
				node = node.left;
			} else {
				node = node.right;
			}
		}
		return false;
	}
	iterator() {
		let ret = [];
		haxe_ds_BalancedTree.iteratorLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	keyValueIterator() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	keys() {
		let ret = [];
		this.keysLoop(this.root,ret);
		return new haxe_iterators_ArrayIterator(ret);
	}
	copy() {
		let copied = new haxe_ds_BalancedTree();
		copied.root = this.root;
		return copied;
	}
	setLoop(k,v,node) {
		if(node == null) {
			return new haxe_ds_TreeNode(null,k,v,null);
		}
		let c = this.compare(k,node.key);
		if(c == 0) {
			return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null ? 0 : node._height);
		} else if(c < 0) {
			let nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			let nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	removeLoop(k,node) {
		if(node == null) {
			throw haxe_Exception.thrown("Not_found");
		}
		let c = this.compare(k,node.key);
		if(c == 0) {
			return this.merge(node.left,node.right);
		} else if(c < 0) {
			return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right);
		} else {
			return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
		}
	}
	keysLoop(node,acc) {
		if(node != null) {
			this.keysLoop(node.left,acc);
			acc.push(node.key);
			this.keysLoop(node.right,acc);
		}
	}
	merge(t1,t2) {
		if(t1 == null) {
			return t2;
		}
		if(t2 == null) {
			return t1;
		}
		let t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	minBinding(t) {
		if(t == null) {
			throw haxe_Exception.thrown("Not_found");
		} else if(t.left == null) {
			return t;
		} else {
			return this.minBinding(t.left);
		}
	}
	removeMinBinding(t) {
		if(t.left == null) {
			return t.right;
		} else {
			return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
		}
	}
	balance(l,k,v,r) {
		let hl = l == null ? 0 : l._height;
		let hr = r == null ? 0 : r._height;
		if(hl > hr + 2) {
			let _this = l.left;
			let _this1 = l.right;
			if((_this == null ? 0 : _this._height) >= (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r));
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
			}
		} else if(hr > hl + 2) {
			let _this = r.right;
			let _this1 = r.left;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right);
			} else {
				return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
			}
		} else {
			return new haxe_ds_TreeNode(l,k,v,r,(hl > hr ? hl : hr) + 1);
		}
	}
	compare(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	toString() {
		if(this.root == null) {
			return "{}";
		} else {
			return "{" + this.root.toString() + "}";
		}
	}
	clear() {
		this.root = null;
	}
	static iteratorLoop(node,acc) {
		if(node != null) {
			haxe_ds_BalancedTree.iteratorLoop(node.left,acc);
			acc.push(node.value);
			haxe_ds_BalancedTree.iteratorLoop(node.right,acc);
		}
	}
}
$hxClasses["haxe.ds.BalancedTree"] = haxe_ds_BalancedTree;
haxe_ds_BalancedTree.__name__ = "haxe.ds.BalancedTree";
haxe_ds_BalancedTree.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_BalancedTree.prototype, {
	__class__: haxe_ds_BalancedTree
	,root: null
});
class haxe_ds_TreeNode {
	constructor(l,k,v,r,h) {
		if(h == null) {
			h = -1;
		}
		this.left = l;
		this.key = k;
		this.value = v;
		this.right = r;
		if(h == -1) {
			let tmp;
			let _this = this.left;
			let _this1 = this.right;
			if((_this == null ? 0 : _this._height) > (_this1 == null ? 0 : _this1._height)) {
				let _this = this.left;
				tmp = _this == null ? 0 : _this._height;
			} else {
				let _this = this.right;
				tmp = _this == null ? 0 : _this._height;
			}
			this._height = tmp + 1;
		} else {
			this._height = h;
		}
	}
	toString() {
		return (this.left == null ? "" : this.left.toString() + ", ") + ("" + Std.string(this.key) + "=" + Std.string(this.value)) + (this.right == null ? "" : ", " + this.right.toString());
	}
}
$hxClasses["haxe.ds.TreeNode"] = haxe_ds_TreeNode;
haxe_ds_TreeNode.__name__ = "haxe.ds.TreeNode";
Object.assign(haxe_ds_TreeNode.prototype, {
	__class__: haxe_ds_TreeNode
	,left: null
	,right: null
	,key: null
	,value: null
	,_height: null
});
class haxe_ds_EnumValueMap extends haxe_ds_BalancedTree {
	constructor() {
		super();
	}
	compare(k1,k2) {
		let d = k1._hx_index - k2._hx_index;
		if(d != 0) {
			return d;
		}
		let p1 = Type.enumParameters(k1);
		let p2 = Type.enumParameters(k2);
		if(p1.length == 0 && p2.length == 0) {
			return 0;
		}
		return this.compareArgs(p1,p2);
	}
	compareArgs(a1,a2) {
		let ld = a1.length - a2.length;
		if(ld != 0) {
			return ld;
		}
		let _g = 0;
		let _g1 = a1.length;
		while(_g < _g1) {
			let i = _g++;
			let d = this.compareArg(a1[i],a2[i]);
			if(d != 0) {
				return d;
			}
		}
		return 0;
	}
	compareArg(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) {
			return this.compare(v1,v2);
		} else if(((v1) instanceof Array) && ((v2) instanceof Array)) {
			return this.compareArgs(v1,v2);
		} else {
			return Reflect.compare(v1,v2);
		}
	}
	copy() {
		let copied = new haxe_ds_EnumValueMap();
		copied.root = this.root;
		return copied;
	}
}
$hxClasses["haxe.ds.EnumValueMap"] = haxe_ds_EnumValueMap;
haxe_ds_EnumValueMap.__name__ = "haxe.ds.EnumValueMap";
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
Object.assign(haxe_ds_EnumValueMap.prototype, {
	__class__: haxe_ds_EnumValueMap
});
class haxe_ds_HashMap {
	static _new() {
		let this1 = new haxe_ds__$HashMap_HashMapData();
		return this1;
	}
	static set(this1,k,v) {
		let _this = this1.keys;
		let key = k.hashCode();
		_this.h[key] = k;
		let _this1 = this1.values;
		let key1 = k.hashCode();
		_this1.h[key1] = v;
	}
	static get(this1,k) {
		let _this = this1.values;
		let key = k.hashCode();
		return _this.h[key];
	}
	static exists(this1,k) {
		let _this = this1.values;
		let key = k.hashCode();
		return _this.h.hasOwnProperty(key);
	}
	static remove(this1,k) {
		this1.values.remove(k.hashCode());
		return this1.keys.remove(k.hashCode());
	}
	static keys(this1) {
		return this1.keys.iterator();
	}
	static copy(this1) {
		let copied = new haxe_ds__$HashMap_HashMapData();
		copied.keys = this1.keys.copy();
		copied.values = this1.values.copy();
		return copied;
	}
	static iterator(this1) {
		return this1.values.iterator();
	}
	static keyValueIterator(this1) {
		return new haxe_iterators_HashMapKeyValueIterator(this1);
	}
	static clear(this1) {
		this1.keys.h = { };
		this1.values.h = { };
	}
}
class haxe_ds__$HashMap_HashMapData {
	constructor() {
		this.keys = new haxe_ds_IntMap();
		this.values = new haxe_ds_IntMap();
	}
}
$hxClasses["haxe.ds._HashMap.HashMapData"] = haxe_ds__$HashMap_HashMapData;
haxe_ds__$HashMap_HashMapData.__name__ = "haxe.ds._HashMap.HashMapData";
Object.assign(haxe_ds__$HashMap_HashMapData.prototype, {
	__class__: haxe_ds__$HashMap_HashMapData
	,keys: null
	,values: null
});
class haxe_ds_IntMap {
	constructor() {
		this.h = { };
	}
	set(key,value) {
		this.h[key] = value;
	}
	get(key) {
		return this.h[key];
	}
	exists(key) {
		return this.h.hasOwnProperty(key);
	}
	remove(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	keys() {
		let a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	iterator() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			let i = this.it.next();
			return this.ref[i];
		}};
	}
	keyValueIterator() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	copy() {
		let copied = new haxe_ds_IntMap();
		let key = this.keys();
		while(key.hasNext()) {
			let key1 = key.next();
			copied.h[key1] = this.h[key1];
		}
		return copied;
	}
	toString() {
		let s_b = "";
		s_b += "{";
		let it = this.keys();
		let i = it;
		while(i.hasNext()) {
			let i1 = i.next();
			s_b += i1 == null ? "null" : "" + i1;
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i1]));
			if(it.hasNext()) {
				s_b += ", ";
			}
		}
		s_b += "}";
		return s_b;
	}
	clear() {
		this.h = { };
	}
}
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = "haxe.ds.IntMap";
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_IntMap.prototype, {
	__class__: haxe_ds_IntMap
	,h: null
});
class haxe_ds_List {
	constructor() {
		this.length = 0;
	}
	add(item) {
		let x = new haxe_ds__$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	push(item) {
		let x = new haxe_ds__$List_ListNode(item,this.h);
		this.h = x;
		if(this.q == null) {
			this.q = x;
		}
		this.length++;
	}
	first() {
		if(this.h == null) {
			return null;
		} else {
			return this.h.item;
		}
	}
	last() {
		if(this.q == null) {
			return null;
		} else {
			return this.q.item;
		}
	}
	pop() {
		if(this.h == null) {
			return null;
		}
		let x = this.h.item;
		this.h = this.h.next;
		if(this.h == null) {
			this.q = null;
		}
		this.length--;
		return x;
	}
	isEmpty() {
		return this.h == null;
	}
	clear() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	remove(v) {
		let prev = null;
		let l = this.h;
		while(l != null) {
			if(l.item == v) {
				if(prev == null) {
					this.h = l.next;
				} else {
					prev.next = l.next;
				}
				if(this.q == l) {
					this.q = prev;
				}
				this.length--;
				return true;
			}
			prev = l;
			l = l.next;
		}
		return false;
	}
	iterator() {
		return new haxe_ds__$List_ListIterator(this.h);
	}
	keyValueIterator() {
		return new haxe_ds__$List_ListKeyValueIterator(this.h);
	}
	toString() {
		let s_b = "";
		let first = true;
		let l = this.h;
		s_b += "{";
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += ", ";
			}
			s_b += Std.string(Std.string(l.item));
			l = l.next;
		}
		s_b += "}";
		return s_b;
	}
	join(sep) {
		let s_b = "";
		let first = true;
		let l = this.h;
		while(l != null) {
			if(first) {
				first = false;
			} else {
				s_b += sep == null ? "null" : "" + sep;
			}
			s_b += Std.string(l.item);
			l = l.next;
		}
		return s_b;
	}
	filter(f) {
		let l2 = new haxe_ds_List();
		let l = this.h;
		while(l != null) {
			let v = l.item;
			l = l.next;
			if(f(v)) {
				l2.add(v);
			}
		}
		return l2;
	}
	map(f) {
		let b = new haxe_ds_List();
		let l = this.h;
		while(l != null) {
			let v = l.item;
			l = l.next;
			b.add(f(v));
		}
		return b;
	}
}
$hxClasses["haxe.ds.List"] = haxe_ds_List;
haxe_ds_List.__name__ = "haxe.ds.List";
Object.assign(haxe_ds_List.prototype, {
	__class__: haxe_ds_List
	,h: null
	,q: null
	,length: null
});
class haxe_ds__$List_ListNode {
	constructor(item,next) {
		this.item = item;
		this.next = next;
	}
}
$hxClasses["haxe.ds._List.ListNode"] = haxe_ds__$List_ListNode;
haxe_ds__$List_ListNode.__name__ = "haxe.ds._List.ListNode";
Object.assign(haxe_ds__$List_ListNode.prototype, {
	__class__: haxe_ds__$List_ListNode
	,item: null
	,next: null
});
class haxe_ds__$List_ListIterator {
	constructor(head) {
		this.head = head;
	}
	hasNext() {
		return this.head != null;
	}
	next() {
		let val = this.head.item;
		this.head = this.head.next;
		return val;
	}
}
$hxClasses["haxe.ds._List.ListIterator"] = haxe_ds__$List_ListIterator;
haxe_ds__$List_ListIterator.__name__ = "haxe.ds._List.ListIterator";
Object.assign(haxe_ds__$List_ListIterator.prototype, {
	__class__: haxe_ds__$List_ListIterator
	,head: null
});
class haxe_ds__$List_ListKeyValueIterator {
	constructor(head) {
		this.head = head;
		this.idx = 0;
	}
	hasNext() {
		return this.head != null;
	}
	next() {
		let val = this.head.item;
		this.head = this.head.next;
		return { value : val, key : this.idx++};
	}
}
$hxClasses["haxe.ds._List.ListKeyValueIterator"] = haxe_ds__$List_ListKeyValueIterator;
haxe_ds__$List_ListKeyValueIterator.__name__ = "haxe.ds._List.ListKeyValueIterator";
Object.assign(haxe_ds__$List_ListKeyValueIterator.prototype, {
	__class__: haxe_ds__$List_ListKeyValueIterator
	,idx: null
	,head: null
});
class haxe_ds_Map {
	static set(this1,key,value) {
		this1.set(key,value);
	}
	static get(this1,key) {
		return this1.get(key);
	}
	static exists(this1,key) {
		return this1.exists(key);
	}
	static remove(this1,key) {
		return this1.remove(key);
	}
	static keys(this1) {
		return this1.keys();
	}
	static iterator(this1) {
		return this1.iterator();
	}
	static keyValueIterator(this1) {
		return this1.keyValueIterator();
	}
	static copy(this1) {
		return this1.copy();
	}
	static toString(this1) {
		return this1.toString();
	}
	static clear(this1) {
		this1.clear();
	}
	static arrayWrite(this1,k,v) {
		this1.set(k,v);
		return v;
	}
	static toStringMap(t) {
		return new haxe_ds_StringMap();
	}
	static toIntMap(t) {
		return new haxe_ds_IntMap();
	}
	static toEnumValueMapMap(t) {
		return new haxe_ds_EnumValueMap();
	}
	static toObjectMap(t) {
		return new haxe_ds_ObjectMap();
	}
	static fromStringMap(map) {
		return map;
	}
	static fromIntMap(map) {
		return map;
	}
	static fromObjectMap(map) {
		return map;
	}
}
class haxe_ds_ObjectMap {
	constructor() {
		this.h = { __keys__ : { }};
	}
	set(key,value) {
		let id = key.__id__;
		if(id == null) {
			id = (key.__id__ = $global.$haxeUID++);
		}
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	get(key) {
		return this.h[key.__id__];
	}
	exists(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	remove(key) {
		let id = key.__id__;
		if(this.h.__keys__[id] == null) {
			return false;
		}
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	keys() {
		let a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) {
			a.push(this.h.__keys__[key]);
		}
		}
		return new haxe_iterators_ArrayIterator(a);
	}
	iterator() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			let i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	keyValueIterator() {
		return new haxe_iterators_MapKeyValueIterator(this);
	}
	copy() {
		let copied = new haxe_ds_ObjectMap();
		let key = this.keys();
		while(key.hasNext()) {
			let key1 = key.next();
			copied.set(key1,this.h[key1.__id__]);
		}
		return copied;
	}
	toString() {
		let s_b = "";
		s_b += "{";
		let it = this.keys();
		let i = it;
		while(i.hasNext()) {
			let i1 = i.next();
			s_b += Std.string(Std.string(i1));
			s_b += " => ";
			s_b += Std.string(Std.string(this.h[i1.__id__]));
			if(it.hasNext()) {
				s_b += ", ";
			}
		}
		s_b += "}";
		return s_b;
	}
	clear() {
		this.h = { __keys__ : { }};
	}
	static assignId(obj) {
		return (obj.__id__ = $global.$haxeUID++);
	}
	static getId(obj) {
		return obj.__id__;
	}
}
haxe_ds_ObjectMap.count = null;
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = "haxe.ds.ObjectMap";
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_ObjectMap.prototype, {
	__class__: haxe_ds_ObjectMap
	,h: null
});
class haxe_ds_ReadOnlyArray {
	static get_length(this1) {
		return this1.length;
	}
	static get(this1,i) {
		return this1[i];
	}
	static concat(this1,a) {
		return this1.concat(a);
	}
}
haxe_ds_ReadOnlyArray.__properties__ = {get_length: "get_length"};
class haxe_ds_StringMap {
	constructor() {
		this.h = Object.create(null);
	}
	exists(key) {
		return Object.prototype.hasOwnProperty.call(this.h,key);
	}
	get(key) {
		return this.h[key];
	}
	set(key,value) {
		this.h[key] = value;
	}
	remove(key) {
		if(Object.prototype.hasOwnProperty.call(this.h,key)) {
			delete(this.h[key]);
			return true;
		} else {
			return false;
		}
	}
	keys() {
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.h);
	}
	iterator() {
		return new haxe_ds__$StringMap_StringMapValueIterator(this.h);
	}
	keyValueIterator() {
		return new haxe_ds__$StringMap_StringMapKeyValueIterator(this.h);
	}
	copy() {
		return haxe_ds_StringMap.createCopy(this.h);
	}
	clear() {
		this.h = Object.create(null);
	}
	toString() {
		return haxe_ds_StringMap.stringify(this.h);
	}
	static createCopy(h) {
		let copy = new haxe_ds_StringMap();
		for (var key in h) copy.h[key] = h[key];
		return copy;
	}
	static stringify(h) {
		let s = "{";
		let first = true;
		for (var key in h) {
			if (first) first = false; else s += ',';
			s += key + ' => ' + Std.string(h[key]);
		}
		return s + "}";
	}
}
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = "haxe.ds.StringMap";
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_StringMap.prototype, {
	__class__: haxe_ds_StringMap
	,h: null
});
class haxe_ds__$StringMap_StringMapKeyIterator {
	constructor(h) {
		this.h = h;
		this.keys = Object.keys(h);
		this.length = this.keys.length;
		this.current = 0;
	}
	hasNext() {
		return this.current < this.length;
	}
	next() {
		return this.keys[this.current++];
	}
}
$hxClasses["haxe.ds._StringMap.StringMapKeyIterator"] = haxe_ds__$StringMap_StringMapKeyIterator;
haxe_ds__$StringMap_StringMapKeyIterator.__name__ = "haxe.ds._StringMap.StringMapKeyIterator";
Object.assign(haxe_ds__$StringMap_StringMapKeyIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapKeyIterator
	,h: null
	,keys: null
	,length: null
	,current: null
});
class haxe_ds__$StringMap_StringMapValueIterator {
	constructor(h) {
		this.h = h;
		this.keys = Object.keys(h);
		this.length = this.keys.length;
		this.current = 0;
	}
	hasNext() {
		return this.current < this.length;
	}
	next() {
		return this.h[this.keys[this.current++]];
	}
}
$hxClasses["haxe.ds._StringMap.StringMapValueIterator"] = haxe_ds__$StringMap_StringMapValueIterator;
haxe_ds__$StringMap_StringMapValueIterator.__name__ = "haxe.ds._StringMap.StringMapValueIterator";
Object.assign(haxe_ds__$StringMap_StringMapValueIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapValueIterator
	,h: null
	,keys: null
	,length: null
	,current: null
});
class haxe_ds__$StringMap_StringMapKeyValueIterator {
	constructor(h) {
		this.h = h;
		this.keys = Object.keys(h);
		this.length = this.keys.length;
		this.current = 0;
	}
	hasNext() {
		return this.current < this.length;
	}
	next() {
		let key = this.keys[this.current++];
		return { key : key, value : this.h[key]};
	}
}
$hxClasses["haxe.ds._StringMap.StringMapKeyValueIterator"] = haxe_ds__$StringMap_StringMapKeyValueIterator;
haxe_ds__$StringMap_StringMapKeyValueIterator.__name__ = "haxe.ds._StringMap.StringMapKeyValueIterator";
Object.assign(haxe_ds__$StringMap_StringMapKeyValueIterator.prototype, {
	__class__: haxe_ds__$StringMap_StringMapKeyValueIterator
	,h: null
	,keys: null
	,length: null
	,current: null
});
class haxe_ds_WeakMap {
	constructor() {
		throw new haxe_exceptions_NotImplementedException("Not implemented for this platform",null,{ fileName : "haxe/ds/WeakMap.hx", lineNumber : 39, className : "haxe.ds.WeakMap", methodName : "new"});
	}
	set(key,value) {
	}
	get(key) {
		return null;
	}
	exists(key) {
		return false;
	}
	remove(key) {
		return false;
	}
	keys() {
		return null;
	}
	iterator() {
		return null;
	}
	keyValueIterator() {
		return null;
	}
	copy() {
		return null;
	}
	toString() {
		return null;
	}
	clear() {
	}
}
$hxClasses["haxe.ds.WeakMap"] = haxe_ds_WeakMap;
haxe_ds_WeakMap.__name__ = "haxe.ds.WeakMap";
haxe_ds_WeakMap.__interfaces__ = [haxe_IMap];
Object.assign(haxe_ds_WeakMap.prototype, {
	__class__: haxe_ds_WeakMap
});
class haxe_exceptions_PosException extends haxe_Exception {
	constructor(message,previous,pos) {
		super(message,previous);
		if(pos == null) {
			this.posInfos = { fileName : "(unknown)", lineNumber : 0, className : "(unknown)", methodName : "(unknown)"};
		} else {
			this.posInfos = pos;
		}
		this.__skipStack++;
	}
	toString() {
		return "" + super.toString() + " in " + this.posInfos.className + "." + this.posInfos.methodName + " at " + this.posInfos.fileName + ":" + this.posInfos.lineNumber;
	}
}
$hxClasses["haxe.exceptions.PosException"] = haxe_exceptions_PosException;
haxe_exceptions_PosException.__name__ = "haxe.exceptions.PosException";
haxe_exceptions_PosException.__super__ = haxe_Exception;
Object.assign(haxe_exceptions_PosException.prototype, {
	__class__: haxe_exceptions_PosException
	,posInfos: null
});
class haxe_exceptions_NotImplementedException extends haxe_exceptions_PosException {
	constructor(message,previous,pos) {
		if(message == null) {
			message = "Not implemented";
		}
		super(message,previous,pos);
		this.__skipStack++;
	}
}
$hxClasses["haxe.exceptions.NotImplementedException"] = haxe_exceptions_NotImplementedException;
haxe_exceptions_NotImplementedException.__name__ = "haxe.exceptions.NotImplementedException";
haxe_exceptions_NotImplementedException.__super__ = haxe_exceptions_PosException;
Object.assign(haxe_exceptions_NotImplementedException.prototype, {
	__class__: haxe_exceptions_NotImplementedException
});
class haxe_iterators_ArrayIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return this.array[this.current++];
	}
}
$hxClasses["haxe.iterators.ArrayIterator"] = haxe_iterators_ArrayIterator;
haxe_iterators_ArrayIterator.__name__ = "haxe.iterators.ArrayIterator";
Object.assign(haxe_iterators_ArrayIterator.prototype, {
	__class__: haxe_iterators_ArrayIterator
	,array: null
	,current: null
});
class haxe_iterators_ArrayKeyValueIterator {
	constructor(array) {
		this.current = 0;
		this.array = array;
	}
	hasNext() {
		return this.current < this.array.length;
	}
	next() {
		return { value : this.array[this.current], key : this.current++};
	}
}
$hxClasses["haxe.iterators.ArrayKeyValueIterator"] = haxe_iterators_ArrayKeyValueIterator;
haxe_iterators_ArrayKeyValueIterator.__name__ = "haxe.iterators.ArrayKeyValueIterator";
Object.assign(haxe_iterators_ArrayKeyValueIterator.prototype, {
	__class__: haxe_iterators_ArrayKeyValueIterator
	,current: null
	,array: null
});
class haxe_iterators_DynamicAccessIterator {
	constructor(access) {
		this.access = access;
		this.keys = Reflect.fields(access);
		this.index = 0;
	}
	hasNext() {
		return this.index < this.keys.length;
	}
	next() {
		return this.access[this.keys[this.index++]];
	}
}
$hxClasses["haxe.iterators.DynamicAccessIterator"] = haxe_iterators_DynamicAccessIterator;
haxe_iterators_DynamicAccessIterator.__name__ = "haxe.iterators.DynamicAccessIterator";
Object.assign(haxe_iterators_DynamicAccessIterator.prototype, {
	__class__: haxe_iterators_DynamicAccessIterator
	,access: null
	,keys: null
	,index: null
});
class haxe_iterators_DynamicAccessKeyValueIterator {
	constructor(access) {
		this.access = access;
		this.keys = Reflect.fields(access);
		this.index = 0;
	}
	hasNext() {
		return this.index < this.keys.length;
	}
	next() {
		let key = this.keys[this.index++];
		return { value : this.access[key], key : key};
	}
}
$hxClasses["haxe.iterators.DynamicAccessKeyValueIterator"] = haxe_iterators_DynamicAccessKeyValueIterator;
haxe_iterators_DynamicAccessKeyValueIterator.__name__ = "haxe.iterators.DynamicAccessKeyValueIterator";
Object.assign(haxe_iterators_DynamicAccessKeyValueIterator.prototype, {
	__class__: haxe_iterators_DynamicAccessKeyValueIterator
	,access: null
	,keys: null
	,index: null
});
class haxe_iterators_HashMapKeyValueIterator {
	constructor(map) {
		this.map = map;
		this.keys = map.keys.iterator();
	}
	hasNext() {
		return this.keys.hasNext();
	}
	next() {
		let key = this.keys.next();
		let _this = this.map.values;
		let key1 = key.hashCode();
		return { value : _this.h[key1], key : key};
	}
}
$hxClasses["haxe.iterators.HashMapKeyValueIterator"] = haxe_iterators_HashMapKeyValueIterator;
haxe_iterators_HashMapKeyValueIterator.__name__ = "haxe.iterators.HashMapKeyValueIterator";
Object.assign(haxe_iterators_HashMapKeyValueIterator.prototype, {
	__class__: haxe_iterators_HashMapKeyValueIterator
	,map: null
	,keys: null
});
class haxe_iterators_MapKeyValueIterator {
	constructor(map) {
		this.map = map;
		this.keys = map.keys();
	}
	hasNext() {
		return this.keys.hasNext();
	}
	next() {
		let key = this.keys.next();
		return { value : this.map.get(key), key : key};
	}
}
$hxClasses["haxe.iterators.MapKeyValueIterator"] = haxe_iterators_MapKeyValueIterator;
haxe_iterators_MapKeyValueIterator.__name__ = "haxe.iterators.MapKeyValueIterator";
Object.assign(haxe_iterators_MapKeyValueIterator.prototype, {
	__class__: haxe_iterators_MapKeyValueIterator
	,map: null
	,keys: null
});
class haxe_iterators_RestIterator {
	constructor(args) {
		this.current = 0;
		this.args = args;
	}
	hasNext() {
		return this.current < this.args.length;
	}
	next() {
		return this.args[this.current++];
	}
}
$hxClasses["haxe.iterators.RestIterator"] = haxe_iterators_RestIterator;
haxe_iterators_RestIterator.__name__ = "haxe.iterators.RestIterator";
Object.assign(haxe_iterators_RestIterator.prototype, {
	__class__: haxe_iterators_RestIterator
	,args: null
	,current: null
});
class haxe_iterators_RestKeyValueIterator {
	constructor(args) {
		this.current = 0;
		this.args = args;
	}
	hasNext() {
		return this.current < this.args.length;
	}
	next() {
		return { key : this.current, value : this.args[this.current++]};
	}
}
$hxClasses["haxe.iterators.RestKeyValueIterator"] = haxe_iterators_RestKeyValueIterator;
haxe_iterators_RestKeyValueIterator.__name__ = "haxe.iterators.RestKeyValueIterator";
Object.assign(haxe_iterators_RestKeyValueIterator.prototype, {
	__class__: haxe_iterators_RestKeyValueIterator
	,args: null
	,current: null
});
class haxe_iterators_StringIterator {
	constructor(s) {
		this.offset = 0;
		this.s = s;
	}
	hasNext() {
		return this.offset < this.s.length;
	}
	next() {
		return this.s.charCodeAt(this.offset++);
	}
}
$hxClasses["haxe.iterators.StringIterator"] = haxe_iterators_StringIterator;
haxe_iterators_StringIterator.__name__ = "haxe.iterators.StringIterator";
Object.assign(haxe_iterators_StringIterator.prototype, {
	__class__: haxe_iterators_StringIterator
	,offset: null
	,s: null
});
class haxe_iterators_StringIteratorUnicode {
	constructor(s) {
		this.offset = 0;
		this.s = s;
	}
	hasNext() {
		return this.offset < this.s.length;
	}
	next() {
		let s = this.s;
		let index = this.offset++;
		let c = s.charCodeAt(index);
		if(c >= 55296 && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(index + 1) & 1023;
		}
		let c1 = c;
		if(c1 >= 65536) {
			this.offset++;
		}
		return c1;
	}
	static unicodeIterator(s) {
		return new haxe_iterators_StringIteratorUnicode(s);
	}
}
$hxClasses["haxe.iterators.StringIteratorUnicode"] = haxe_iterators_StringIteratorUnicode;
haxe_iterators_StringIteratorUnicode.__name__ = "haxe.iterators.StringIteratorUnicode";
Object.assign(haxe_iterators_StringIteratorUnicode.prototype, {
	__class__: haxe_iterators_StringIteratorUnicode
	,offset: null
	,s: null
});
class haxe_iterators_StringKeyValueIterator {
	constructor(s) {
		this.offset = 0;
		this.s = s;
	}
	hasNext() {
		return this.offset < this.s.length;
	}
	next() {
		return { key : this.offset, value : this.s.charCodeAt(this.offset++)};
	}
}
$hxClasses["haxe.iterators.StringKeyValueIterator"] = haxe_iterators_StringKeyValueIterator;
haxe_iterators_StringKeyValueIterator.__name__ = "haxe.iterators.StringKeyValueIterator";
Object.assign(haxe_iterators_StringKeyValueIterator.prototype, {
	__class__: haxe_iterators_StringKeyValueIterator
	,offset: null
	,s: null
});
class js_Boot {
	static isClass(o) {
		return o.__name__;
	}
	static isInterface(o) {
		return o.__isInterface__;
	}
	static isEnum(e) {
		return e.__ename__;
	}
	static getClass(o) {
		if(o == null) {
			return null;
		} else if(((o) instanceof Array)) {
			return Array;
		} else {
			let cl = o.__class__;
			if(cl != null) {
				return cl;
			}
			let name = js_Boot.__nativeClassName(o);
			if(name != null) {
				return js_Boot.__resolveNativeClass(name);
			}
			return null;
		}
	}
	static __string_rec(o,s) {
		if(o == null) {
			return "null";
		}
		if(s.length >= 5) {
			return "<...>";
		}
		let t = typeof(o);
		if(t == "function" && (o.__name__ || o.__ename__)) {
			t = "object";
		}
		switch(t) {
		case "function":
			return "<function>";
		case "object":
			if(((o) instanceof Array)) {
				let str = "[";
				s += "\t";
				let _g = 0;
				let _g1 = o.length;
				while(_g < _g1) {
					let i = _g++;
					str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
				}
				str += "]";
				return str;
			}
			let tostr;
			try {
				tostr = o.toString;
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				return "???";
			}
			if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
				let s2 = o.toString();
				if(s2 != "[object Object]") {
					return s2;
				}
			}
			let str = "{\n";
			s += "\t";
			let hasp = o.hasOwnProperty != null;
			let k = null;
			for( k in o ) {
			if(hasp && !o.hasOwnProperty(k)) {
				continue;
			}
			if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
				continue;
			}
			if(str.length != 2) {
				str += ", \n";
			}
			str += s + k + " : " + js_Boot.__string_rec(o[k],s);
			}
			s = s.substring(1);
			str += "\n" + s + "}";
			return str;
		case "string":
			return o;
		default:
			return String(o);
		}
	}
	static __interfLoop(cc,cl) {
		if(cc == null) {
			return false;
		}
		if(cc == cl) {
			return true;
		}
		let intf = cc.__interfaces__;
		if(intf != null && (cc.__super__ == null || cc.__super__.__interfaces__ != intf)) {
			let _g = 0;
			let _g1 = intf.length;
			while(_g < _g1) {
				let i = _g++;
				let i1 = intf[i];
				if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
					return true;
				}
			}
		}
		return js_Boot.__interfLoop(cc.__super__,cl);
	}
	static __instanceof(o,cl) {
		if(cl == null) {
			return false;
		}
		switch(cl) {
		case Array:
			return ((o) instanceof Array);
		case Bool:
			return typeof(o) == "boolean";
		case Dynamic:
			return o != null;
		case Float:
			return typeof(o) == "number";
		case Int:
			if(typeof(o) == "number") {
				return ((o | 0) === o);
			} else {
				return false;
			}
			break;
		case String:
			return typeof(o) == "string";
		default:
			if(o != null) {
				if(typeof(cl) == "function") {
					if(js_Boot.__downcastCheck(o,cl)) {
						return true;
					}
				} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
					if(((o) instanceof cl)) {
						return true;
					}
				}
			} else {
				return false;
			}
			if(cl == Class ? o.__name__ != null : false) {
				return true;
			}
			if(cl == Enum ? o.__ename__ != null : false) {
				return true;
			}
			return false;
		}
	}
	static __downcastCheck(o,cl) {
		if(!((o) instanceof cl)) {
			if(cl.__isInterface__) {
				return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	static __implements(o,iface) {
		return js_Boot.__interfLoop(js_Boot.getClass(o),iface);
	}
	static __cast(o,t) {
		if(o == null || js_Boot.__instanceof(o,t)) {
			return o;
		} else {
			throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
		}
	}
	static __nativeClassName(o) {
		let name = js_Boot.__toStr.call(o).slice(8,-1);
		if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
			return null;
		}
		return name;
	}
	static __isNativeObj(o) {
		return js_Boot.__nativeClassName(o) != null;
	}
	static __resolveNativeClass(name) {
		return $global[name];
	}
}
js_Boot.__toStr = null;
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = "js.Boot";
class js_Lib {
	static debug() {
		debugger;
	}
	static alert(v) {
		alert(js_Boot.__string_rec(v,""));
	}
	static eval(code) {
		return eval(code);
	}
	static get_undefined() {
		return undefined;
	}
	static rethrow() {
	}
	static getOriginalException() {
		return null;
	}
	static getNextHaxeUID() {
		return $global.$haxeUID++;
	}
}
$hxClasses["js.Lib"] = js_Lib;
js_Lib.__name__ = "js.Lib";
js_Lib.__properties__ = {get_undefined: "get_undefined"};
class js_lib_HaxeIterator {
	constructor(jsIterator) {
		this.jsIterator = jsIterator;
		this.lastStep = jsIterator.next();
	}
	hasNext() {
		return !this.lastStep.done;
	}
	next() {
		let v = this.lastStep.value;
		this.lastStep = this.jsIterator.next();
		return v;
	}
	static iterator(jsIterator) {
		return new js_lib_HaxeIterator(jsIterator);
	}
}
$hxClasses["js.lib.HaxeIterator"] = js_lib_HaxeIterator;
js_lib_HaxeIterator.__name__ = "js.lib.HaxeIterator";
Object.assign(js_lib_HaxeIterator.prototype, {
	__class__: js_lib_HaxeIterator
	,jsIterator: null
	,lastStep: null
});
class js_lib_KeyValue {
	static get_key(this1) {
		return this1[0];
	}
	static get_value(this1) {
		return this1[1];
	}
}
js_lib_KeyValue.__properties__ = {get_value: "get_value",get_key: "get_key"};
class js_lib_ObjectEntry {
	static get_key(this1) {
		return this1[0];
	}
	static get_value(this1) {
		return this1[1];
	}
}
js_lib_ObjectEntry.__properties__ = {get_value: "get_value",get_key: "get_key"};
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
$hxClasses["Math"] = Math;
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
{
	String.prototype.__class__ = $hxClasses["String"] = String;
	String.__name__ = "String";
	$hxClasses["Array"] = Array;
	Array.__name__ = "Array";
	Date.prototype.__class__ = $hxClasses["Date"] = Date;
	Date.__name__ = "Date";
	var Int = { };
	var Dynamic = { };
	var Float = Number;
	var Bool = Boolean;
	var Class = { };
	var Enum = { };
}
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = ({ }).toString;
EReg.escapeRe = new RegExp("[.*+?^${}()|[\\]\\\\]","g");
haxe_SysTools.winMetaCharacters = [32,40,41,37,33,94,34,60,62,38,124,10,13,44,59];
StringTools.winMetaCharacters = haxe_SysTools.winMetaCharacters;
StringTools.MIN_SURROGATE_CODE_POINT = 65536;
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
