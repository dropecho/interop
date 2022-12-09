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
class XmlType {
	static toString(this1) {
		switch(this1) {
		case 0:
			return "Element";
		case 1:
			return "PCData";
		case 2:
			return "CData";
		case 3:
			return "Comment";
		case 4:
			return "DocType";
		case 5:
			return "ProcessingInstruction";
		case 6:
			return "Document";
		}
	}
}
class Xml {
	constructor(nodeType) {
		this.nodeType = nodeType;
		this.children = [];
		this.attributeMap = new haxe_ds_StringMap();
	}
	get_nodeName() {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return this.nodeName;
	}
	set_nodeName(v) {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return this.nodeName = v;
	}
	get_nodeValue() {
		if(this.nodeType == Xml.Document || this.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return this.nodeValue;
	}
	set_nodeValue(v) {
		if(this.nodeType == Xml.Document || this.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return this.nodeValue = v;
	}
	get(att) {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return this.attributeMap.h[att];
	}
	set(att,value) {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		this.attributeMap.h[att] = value;
	}
	remove(att) {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		let _this = this.attributeMap;
		if(Object.prototype.hasOwnProperty.call(_this.h,att)) {
			delete(_this.h[att]);
		}
	}
	exists(att) {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return Object.prototype.hasOwnProperty.call(this.attributeMap.h,att);
	}
	attributes() {
		if(this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return new haxe_ds__$StringMap_StringMapKeyIterator(this.attributeMap.h);
	}
	iterator() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return new haxe_iterators_ArrayIterator(this.children);
	}
	elements() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		let _g = [];
		let _g1 = 0;
		let _g2 = this.children;
		while(_g1 < _g2.length) {
			let child = _g2[_g1];
			++_g1;
			if(child.nodeType == Xml.Element) {
				_g.push(child);
			}
		}
		let ret = _g;
		return new haxe_iterators_ArrayIterator(ret);
	}
	elementsNamed(name) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		let _g = [];
		let _g1 = 0;
		let _g2 = this.children;
		while(_g1 < _g2.length) {
			let child = _g2[_g1];
			++_g1;
			let tmp;
			if(child.nodeType == Xml.Element) {
				if(child.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (child.nodeType == null ? "null" : XmlType.toString(child.nodeType)));
				}
				tmp = child.nodeName == name;
			} else {
				tmp = false;
			}
			if(tmp) {
				_g.push(child);
			}
		}
		let ret = _g;
		return new haxe_iterators_ArrayIterator(ret);
	}
	firstChild() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		return this.children[0];
	}
	firstElement() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		let _g = 0;
		let _g1 = this.children;
		while(_g < _g1.length) {
			let child = _g1[_g];
			++_g;
			if(child.nodeType == Xml.Element) {
				return child;
			}
		}
		return null;
	}
	addChild(x) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		if(x.parent != null) {
			x.parent.removeChild(x);
		}
		this.children.push(x);
		x.parent = this;
	}
	removeChild(x) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		if(HxOverrides.remove(this.children,x)) {
			x.parent = null;
			return true;
		}
		return false;
	}
	insertChild(x,pos) {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
		if(x.parent != null) {
			HxOverrides.remove(x.parent.children,x);
		}
		this.children.splice(pos,0,x);
		x.parent = this;
	}
	toString() {
		return haxe_xml_Printer.print(this);
	}
	ensureElementType() {
		if(this.nodeType != Xml.Document && this.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this.nodeType == null ? "null" : XmlType.toString(this.nodeType)));
		}
	}
	static parse(str) {
		return haxe_xml_Parser.parse(str);
	}
	static createElement(name) {
		let xml = new Xml(Xml.Element);
		if(xml.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element but found " + (xml.nodeType == null ? "null" : XmlType.toString(xml.nodeType)));
		}
		xml.nodeName = name;
		return xml;
	}
	static createPCData(data) {
		let xml = new Xml(Xml.PCData);
		if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (xml.nodeType == null ? "null" : XmlType.toString(xml.nodeType)));
		}
		xml.nodeValue = data;
		return xml;
	}
	static createCData(data) {
		let xml = new Xml(Xml.CData);
		if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (xml.nodeType == null ? "null" : XmlType.toString(xml.nodeType)));
		}
		xml.nodeValue = data;
		return xml;
	}
	static createComment(data) {
		let xml = new Xml(Xml.Comment);
		if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (xml.nodeType == null ? "null" : XmlType.toString(xml.nodeType)));
		}
		xml.nodeValue = data;
		return xml;
	}
	static createDocType(data) {
		let xml = new Xml(Xml.DocType);
		if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (xml.nodeType == null ? "null" : XmlType.toString(xml.nodeType)));
		}
		xml.nodeValue = data;
		return xml;
	}
	static createProcessingInstruction(data) {
		let xml = new Xml(Xml.ProcessingInstruction);
		if(xml.nodeType == Xml.Document || xml.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (xml.nodeType == null ? "null" : XmlType.toString(xml.nodeType)));
		}
		xml.nodeValue = data;
		return xml;
	}
	static createDocument() {
		return new Xml(Xml.Document);
	}
}
$hxClasses["Xml"] = Xml;
Xml.__name__ = "Xml";
Object.assign(Xml.prototype, {
	__class__: Xml
	,nodeType: null
	,nodeName: null
	,nodeValue: null
	,parent: null
	,children: null
	,attributeMap: null
	,__properties__: {set_nodeValue: "set_nodeValue",get_nodeValue: "get_nodeValue",set_nodeName: "set_nodeName",get_nodeName: "get_nodeName"}
});
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
class dropecho_interop_JSAbstractMapKeyValueIterator {
	constructor(map) {
		this._iter = new haxe_iterators_DynamicAccessKeyValueIterator(map);
	}
	hasNext() {
		let _this = this._iter;
		return _this.index < _this.keys.length;
	}
	next() {
		let _this = this._iter;
		let key = _this.keys[_this.index++];
		return { value : _this.access[key], key : key};
	}
}
$hxClasses["dropecho.interop.JSAbstractMapKeyValueIterator"] = dropecho_interop_JSAbstractMapKeyValueIterator;
dropecho_interop_JSAbstractMapKeyValueIterator.__name__ = "dropecho.interop.JSAbstractMapKeyValueIterator";
Object.assign(dropecho_interop_JSAbstractMapKeyValueIterator.prototype, {
	__class__: dropecho_interop_JSAbstractMapKeyValueIterator
	,_iter: null
});
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
	static keyValueIterator(this1) {
		return new dropecho_interop_JSAbstractMapKeyValueIterator(this1);
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
	static exists(this1,key) {
		return Object.prototype.hasOwnProperty.call(this1,Std.string(key));
	}
	static get(this1,key) {
		return this1[Std.string(key)];
	}
	static set(this1,key,value) {
		this1[Std.string(key)] = value;
		return value;
	}
	static clear(this1) {
		let _g = 0;
		let _g1 = Reflect.fields(this1);
		while(_g < _g1.length) {
			let key = _g1[_g];
			++_g;
			Reflect.deleteField(this1,key);
		}
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
					let _g1 = new dropecho_interop_JSAbstractMapKeyValueIterator(copy);
					while(_g1.hasNext()) {
						let _g = _g1.next();
						let k = _g.key;
						let v = _g.value;
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
		this.Action1 = function(x) {
			haxe_Log.trace("wee: " + Std.string(x),{ fileName : "src/dropecho/interop/test/TestFunc.hx", lineNumber : 16, className : "dropecho.interop.test.TestFunc", methodName : "new"});
		};
		this.Action2 = function(x,y) {
			haxe_Log.trace("wee: " + Std.string(x) + "," + Std.string(y),{ fileName : "src/dropecho/interop/test/TestFunc.hx", lineNumber : 17, className : "dropecho.interop.test.TestFunc", methodName : "new"});
		};
		this.Func0 = function() {
			return 32;
		};
		this.Func1 = function(v) {
			return v;
		};
		this.Func2 = function(v1,v2) {
			return v1;
		};
	}
	createAction0(a) {
		this.Action0 = a;
	}
	createAction1(a) {
		this.Action1 = a;
	}
	createAction2(a) {
		this.Action2 = a;
	}
	createFunc0(a) {
		this.Func0 = a;
	}
	createFunc1(a) {
		this.Func1 = a;
	}
	createFunc2(a) {
		this.Func2 = a;
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
class haxe_ds_ArraySort {
	static sort(a,cmp) {
		haxe_ds_ArraySort.rec(a,cmp,0,a.length);
	}
	static rec(a,cmp,from,to) {
		let middle = from + to >> 1;
		if(to - from < 12) {
			if(to <= from) {
				return;
			}
			let _g = from + 1;
			let _g1 = to;
			while(_g < _g1) {
				let i = _g++;
				let j = i;
				while(j > from) {
					if(cmp(a[j],a[j - 1]) < 0) {
						haxe_ds_ArraySort.swap(a,j - 1,j);
					} else {
						break;
					}
					--j;
				}
			}
			return;
		}
		haxe_ds_ArraySort.rec(a,cmp,from,middle);
		haxe_ds_ArraySort.rec(a,cmp,middle,to);
		haxe_ds_ArraySort.doMerge(a,cmp,from,middle,to,middle - from,to - middle);
	}
	static doMerge(a,cmp,from,pivot,to,len1,len2) {
		let first_cut;
		let second_cut;
		let len11;
		let len22;
		if(len1 == 0 || len2 == 0) {
			return;
		}
		if(len1 + len2 == 2) {
			if(cmp(a[pivot],a[from]) < 0) {
				haxe_ds_ArraySort.swap(a,pivot,from);
			}
			return;
		}
		if(len1 > len2) {
			len11 = len1 >> 1;
			first_cut = from + len11;
			second_cut = haxe_ds_ArraySort.lower(a,cmp,pivot,to,first_cut);
			len22 = second_cut - pivot;
		} else {
			len22 = len2 >> 1;
			second_cut = pivot + len22;
			first_cut = haxe_ds_ArraySort.upper(a,cmp,from,pivot,second_cut);
			len11 = first_cut - from;
		}
		haxe_ds_ArraySort.rotate(a,cmp,first_cut,pivot,second_cut);
		let new_mid = first_cut + len22;
		haxe_ds_ArraySort.doMerge(a,cmp,from,first_cut,new_mid,len11,len22);
		haxe_ds_ArraySort.doMerge(a,cmp,new_mid,second_cut,to,len1 - len11,len2 - len22);
	}
	static rotate(a,cmp,from,mid,to) {
		if(from == mid || mid == to) {
			return;
		}
		let n = haxe_ds_ArraySort.gcd(to - from,mid - from);
		while(n-- != 0) {
			let val = a[from + n];
			let shift = mid - from;
			let p1 = from + n;
			let p2 = from + n + shift;
			while(p2 != from + n) {
				a[p1] = a[p2];
				p1 = p2;
				if(to - p2 > shift) {
					p2 += shift;
				} else {
					p2 = from + (shift - (to - p2));
				}
			}
			a[p1] = val;
		}
	}
	static gcd(m,n) {
		while(n != 0) {
			let t = m % n;
			m = n;
			n = t;
		}
		return m;
	}
	static upper(a,cmp,from,to,val) {
		let len = to - from;
		let half;
		let mid;
		while(len > 0) {
			half = len >> 1;
			mid = from + half;
			if(cmp(a[val],a[mid]) < 0) {
				len = half;
			} else {
				from = mid + 1;
				len = len - half - 1;
			}
		}
		return from;
	}
	static lower(a,cmp,from,to,val) {
		let len = to - from;
		let half;
		let mid;
		while(len > 0) {
			half = len >> 1;
			mid = from + half;
			if(cmp(a[mid],a[val]) < 0) {
				from = mid + 1;
				len = len - half - 1;
			} else {
				len = half;
			}
		}
		return from;
	}
	static swap(a,i,j) {
		let tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	static compare(a,cmp,i,j) {
		return cmp(a[i],a[j]);
	}
}
$hxClasses["haxe.ds.ArraySort"] = haxe_ds_ArraySort;
haxe_ds_ArraySort.__name__ = "haxe.ds.ArraySort";
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
var haxe_macro_Message = $hxEnums["haxe.macro.Message"] = { __ename__:"haxe.macro.Message",__constructs__:null
	,Info: ($_=function(msg,pos) { return {_hx_index:0,msg:msg,pos:pos,__enum__:"haxe.macro.Message"}; },$_._hx_name="Info",$_.__params__ = ["msg","pos"],$_)
	,Warning: ($_=function(msg,pos) { return {_hx_index:1,msg:msg,pos:pos,__enum__:"haxe.macro.Message"}; },$_._hx_name="Warning",$_.__params__ = ["msg","pos"],$_)
};
haxe_macro_Message.__constructs__ = [haxe_macro_Message.Info,haxe_macro_Message.Warning];
haxe_macro_Message.__empty_constructs__ = [];
class haxe_macro_Context {
}
$hxClasses["haxe.macro.Context"] = haxe_macro_Context;
haxe_macro_Context.__name__ = "haxe.macro.Context";
var haxe_macro_StringLiteralKind = $hxEnums["haxe.macro.StringLiteralKind"] = { __ename__:"haxe.macro.StringLiteralKind",__constructs__:null
	,DoubleQuotes: {_hx_name:"DoubleQuotes",_hx_index:0,__enum__:"haxe.macro.StringLiteralKind"}
	,SingleQuotes: {_hx_name:"SingleQuotes",_hx_index:1,__enum__:"haxe.macro.StringLiteralKind"}
};
haxe_macro_StringLiteralKind.__constructs__ = [haxe_macro_StringLiteralKind.DoubleQuotes,haxe_macro_StringLiteralKind.SingleQuotes];
haxe_macro_StringLiteralKind.__empty_constructs__ = [haxe_macro_StringLiteralKind.DoubleQuotes,haxe_macro_StringLiteralKind.SingleQuotes];
var haxe_macro_Constant = $hxEnums["haxe.macro.Constant"] = { __ename__:"haxe.macro.Constant",__constructs__:null
	,CInt: ($_=function(v) { return {_hx_index:0,v:v,__enum__:"haxe.macro.Constant"}; },$_._hx_name="CInt",$_.__params__ = ["v"],$_)
	,CFloat: ($_=function(f) { return {_hx_index:1,f:f,__enum__:"haxe.macro.Constant"}; },$_._hx_name="CFloat",$_.__params__ = ["f"],$_)
	,CString: ($_=function(s,kind) { return {_hx_index:2,s:s,kind:kind,__enum__:"haxe.macro.Constant"}; },$_._hx_name="CString",$_.__params__ = ["s","kind"],$_)
	,CIdent: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"haxe.macro.Constant"}; },$_._hx_name="CIdent",$_.__params__ = ["s"],$_)
	,CRegexp: ($_=function(r,opt) { return {_hx_index:4,r:r,opt:opt,__enum__:"haxe.macro.Constant"}; },$_._hx_name="CRegexp",$_.__params__ = ["r","opt"],$_)
};
haxe_macro_Constant.__constructs__ = [haxe_macro_Constant.CInt,haxe_macro_Constant.CFloat,haxe_macro_Constant.CString,haxe_macro_Constant.CIdent,haxe_macro_Constant.CRegexp];
haxe_macro_Constant.__empty_constructs__ = [];
var haxe_macro_Binop = $hxEnums["haxe.macro.Binop"] = { __ename__:"haxe.macro.Binop",__constructs__:null
	,OpAdd: {_hx_name:"OpAdd",_hx_index:0,__enum__:"haxe.macro.Binop"}
	,OpMult: {_hx_name:"OpMult",_hx_index:1,__enum__:"haxe.macro.Binop"}
	,OpDiv: {_hx_name:"OpDiv",_hx_index:2,__enum__:"haxe.macro.Binop"}
	,OpSub: {_hx_name:"OpSub",_hx_index:3,__enum__:"haxe.macro.Binop"}
	,OpAssign: {_hx_name:"OpAssign",_hx_index:4,__enum__:"haxe.macro.Binop"}
	,OpEq: {_hx_name:"OpEq",_hx_index:5,__enum__:"haxe.macro.Binop"}
	,OpNotEq: {_hx_name:"OpNotEq",_hx_index:6,__enum__:"haxe.macro.Binop"}
	,OpGt: {_hx_name:"OpGt",_hx_index:7,__enum__:"haxe.macro.Binop"}
	,OpGte: {_hx_name:"OpGte",_hx_index:8,__enum__:"haxe.macro.Binop"}
	,OpLt: {_hx_name:"OpLt",_hx_index:9,__enum__:"haxe.macro.Binop"}
	,OpLte: {_hx_name:"OpLte",_hx_index:10,__enum__:"haxe.macro.Binop"}
	,OpAnd: {_hx_name:"OpAnd",_hx_index:11,__enum__:"haxe.macro.Binop"}
	,OpOr: {_hx_name:"OpOr",_hx_index:12,__enum__:"haxe.macro.Binop"}
	,OpXor: {_hx_name:"OpXor",_hx_index:13,__enum__:"haxe.macro.Binop"}
	,OpBoolAnd: {_hx_name:"OpBoolAnd",_hx_index:14,__enum__:"haxe.macro.Binop"}
	,OpBoolOr: {_hx_name:"OpBoolOr",_hx_index:15,__enum__:"haxe.macro.Binop"}
	,OpShl: {_hx_name:"OpShl",_hx_index:16,__enum__:"haxe.macro.Binop"}
	,OpShr: {_hx_name:"OpShr",_hx_index:17,__enum__:"haxe.macro.Binop"}
	,OpUShr: {_hx_name:"OpUShr",_hx_index:18,__enum__:"haxe.macro.Binop"}
	,OpMod: {_hx_name:"OpMod",_hx_index:19,__enum__:"haxe.macro.Binop"}
	,OpAssignOp: ($_=function(op) { return {_hx_index:20,op:op,__enum__:"haxe.macro.Binop"}; },$_._hx_name="OpAssignOp",$_.__params__ = ["op"],$_)
	,OpInterval: {_hx_name:"OpInterval",_hx_index:21,__enum__:"haxe.macro.Binop"}
	,OpArrow: {_hx_name:"OpArrow",_hx_index:22,__enum__:"haxe.macro.Binop"}
	,OpIn: {_hx_name:"OpIn",_hx_index:23,__enum__:"haxe.macro.Binop"}
};
haxe_macro_Binop.__constructs__ = [haxe_macro_Binop.OpAdd,haxe_macro_Binop.OpMult,haxe_macro_Binop.OpDiv,haxe_macro_Binop.OpSub,haxe_macro_Binop.OpAssign,haxe_macro_Binop.OpEq,haxe_macro_Binop.OpNotEq,haxe_macro_Binop.OpGt,haxe_macro_Binop.OpGte,haxe_macro_Binop.OpLt,haxe_macro_Binop.OpLte,haxe_macro_Binop.OpAnd,haxe_macro_Binop.OpOr,haxe_macro_Binop.OpXor,haxe_macro_Binop.OpBoolAnd,haxe_macro_Binop.OpBoolOr,haxe_macro_Binop.OpShl,haxe_macro_Binop.OpShr,haxe_macro_Binop.OpUShr,haxe_macro_Binop.OpMod,haxe_macro_Binop.OpAssignOp,haxe_macro_Binop.OpInterval,haxe_macro_Binop.OpArrow,haxe_macro_Binop.OpIn];
haxe_macro_Binop.__empty_constructs__ = [haxe_macro_Binop.OpAdd,haxe_macro_Binop.OpMult,haxe_macro_Binop.OpDiv,haxe_macro_Binop.OpSub,haxe_macro_Binop.OpAssign,haxe_macro_Binop.OpEq,haxe_macro_Binop.OpNotEq,haxe_macro_Binop.OpGt,haxe_macro_Binop.OpGte,haxe_macro_Binop.OpLt,haxe_macro_Binop.OpLte,haxe_macro_Binop.OpAnd,haxe_macro_Binop.OpOr,haxe_macro_Binop.OpXor,haxe_macro_Binop.OpBoolAnd,haxe_macro_Binop.OpBoolOr,haxe_macro_Binop.OpShl,haxe_macro_Binop.OpShr,haxe_macro_Binop.OpUShr,haxe_macro_Binop.OpMod,haxe_macro_Binop.OpInterval,haxe_macro_Binop.OpArrow,haxe_macro_Binop.OpIn];
var haxe_macro_Unop = $hxEnums["haxe.macro.Unop"] = { __ename__:"haxe.macro.Unop",__constructs__:null
	,OpIncrement: {_hx_name:"OpIncrement",_hx_index:0,__enum__:"haxe.macro.Unop"}
	,OpDecrement: {_hx_name:"OpDecrement",_hx_index:1,__enum__:"haxe.macro.Unop"}
	,OpNot: {_hx_name:"OpNot",_hx_index:2,__enum__:"haxe.macro.Unop"}
	,OpNeg: {_hx_name:"OpNeg",_hx_index:3,__enum__:"haxe.macro.Unop"}
	,OpNegBits: {_hx_name:"OpNegBits",_hx_index:4,__enum__:"haxe.macro.Unop"}
	,OpSpread: {_hx_name:"OpSpread",_hx_index:5,__enum__:"haxe.macro.Unop"}
};
haxe_macro_Unop.__constructs__ = [haxe_macro_Unop.OpIncrement,haxe_macro_Unop.OpDecrement,haxe_macro_Unop.OpNot,haxe_macro_Unop.OpNeg,haxe_macro_Unop.OpNegBits,haxe_macro_Unop.OpSpread];
haxe_macro_Unop.__empty_constructs__ = [haxe_macro_Unop.OpIncrement,haxe_macro_Unop.OpDecrement,haxe_macro_Unop.OpNot,haxe_macro_Unop.OpNeg,haxe_macro_Unop.OpNegBits,haxe_macro_Unop.OpSpread];
var haxe_macro_QuoteStatus = $hxEnums["haxe.macro.QuoteStatus"] = { __ename__:"haxe.macro.QuoteStatus",__constructs__:null
	,Unquoted: {_hx_name:"Unquoted",_hx_index:0,__enum__:"haxe.macro.QuoteStatus"}
	,Quoted: {_hx_name:"Quoted",_hx_index:1,__enum__:"haxe.macro.QuoteStatus"}
};
haxe_macro_QuoteStatus.__constructs__ = [haxe_macro_QuoteStatus.Unquoted,haxe_macro_QuoteStatus.Quoted];
haxe_macro_QuoteStatus.__empty_constructs__ = [haxe_macro_QuoteStatus.Unquoted,haxe_macro_QuoteStatus.Quoted];
var haxe_macro_FunctionKind = $hxEnums["haxe.macro.FunctionKind"] = { __ename__:"haxe.macro.FunctionKind",__constructs__:null
	,FAnonymous: {_hx_name:"FAnonymous",_hx_index:0,__enum__:"haxe.macro.FunctionKind"}
	,FNamed: ($_=function(name,inlined) { return {_hx_index:1,name:name,inlined:inlined,__enum__:"haxe.macro.FunctionKind"}; },$_._hx_name="FNamed",$_.__params__ = ["name","inlined"],$_)
	,FArrow: {_hx_name:"FArrow",_hx_index:2,__enum__:"haxe.macro.FunctionKind"}
};
haxe_macro_FunctionKind.__constructs__ = [haxe_macro_FunctionKind.FAnonymous,haxe_macro_FunctionKind.FNamed,haxe_macro_FunctionKind.FArrow];
haxe_macro_FunctionKind.__empty_constructs__ = [haxe_macro_FunctionKind.FAnonymous,haxe_macro_FunctionKind.FArrow];
var haxe_macro_ExprDef = $hxEnums["haxe.macro.ExprDef"] = { __ename__:"haxe.macro.ExprDef",__constructs__:null
	,EConst: ($_=function(c) { return {_hx_index:0,c:c,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EConst",$_.__params__ = ["c"],$_)
	,EArray: ($_=function(e1,e2) { return {_hx_index:1,e1:e1,e2:e2,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EArray",$_.__params__ = ["e1","e2"],$_)
	,EBinop: ($_=function(op,e1,e2) { return {_hx_index:2,op:op,e1:e1,e2:e2,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EBinop",$_.__params__ = ["op","e1","e2"],$_)
	,EField: ($_=function(e,field) { return {_hx_index:3,e:e,field:field,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EField",$_.__params__ = ["e","field"],$_)
	,EParenthesis: ($_=function(e) { return {_hx_index:4,e:e,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EParenthesis",$_.__params__ = ["e"],$_)
	,EObjectDecl: ($_=function(fields) { return {_hx_index:5,fields:fields,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EObjectDecl",$_.__params__ = ["fields"],$_)
	,EArrayDecl: ($_=function(values) { return {_hx_index:6,values:values,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EArrayDecl",$_.__params__ = ["values"],$_)
	,ECall: ($_=function(e,params) { return {_hx_index:7,e:e,params:params,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ECall",$_.__params__ = ["e","params"],$_)
	,ENew: ($_=function(t,params) { return {_hx_index:8,t:t,params:params,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ENew",$_.__params__ = ["t","params"],$_)
	,EUnop: ($_=function(op,postFix,e) { return {_hx_index:9,op:op,postFix:postFix,e:e,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EUnop",$_.__params__ = ["op","postFix","e"],$_)
	,EVars: ($_=function(vars) { return {_hx_index:10,vars:vars,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EVars",$_.__params__ = ["vars"],$_)
	,EFunction: ($_=function(kind,f) { return {_hx_index:11,kind:kind,f:f,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EFunction",$_.__params__ = ["kind","f"],$_)
	,EBlock: ($_=function(exprs) { return {_hx_index:12,exprs:exprs,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EBlock",$_.__params__ = ["exprs"],$_)
	,EFor: ($_=function(it,expr) { return {_hx_index:13,it:it,expr:expr,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EFor",$_.__params__ = ["it","expr"],$_)
	,EIf: ($_=function(econd,eif,eelse) { return {_hx_index:14,econd:econd,eif:eif,eelse:eelse,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EIf",$_.__params__ = ["econd","eif","eelse"],$_)
	,EWhile: ($_=function(econd,e,normalWhile) { return {_hx_index:15,econd:econd,e:e,normalWhile:normalWhile,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EWhile",$_.__params__ = ["econd","e","normalWhile"],$_)
	,ESwitch: ($_=function(e,cases,edef) { return {_hx_index:16,e:e,cases:cases,edef:edef,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ESwitch",$_.__params__ = ["e","cases","edef"],$_)
	,ETry: ($_=function(e,catches) { return {_hx_index:17,e:e,catches:catches,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ETry",$_.__params__ = ["e","catches"],$_)
	,EReturn: ($_=function(e) { return {_hx_index:18,e:e,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EReturn",$_.__params__ = ["e"],$_)
	,EBreak: {_hx_name:"EBreak",_hx_index:19,__enum__:"haxe.macro.ExprDef"}
	,EContinue: {_hx_name:"EContinue",_hx_index:20,__enum__:"haxe.macro.ExprDef"}
	,EUntyped: ($_=function(e) { return {_hx_index:21,e:e,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EUntyped",$_.__params__ = ["e"],$_)
	,EThrow: ($_=function(e) { return {_hx_index:22,e:e,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EThrow",$_.__params__ = ["e"],$_)
	,ECast: ($_=function(e,t) { return {_hx_index:23,e:e,t:t,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ECast",$_.__params__ = ["e","t"],$_)
	,EDisplay: ($_=function(e,displayKind) { return {_hx_index:24,e:e,displayKind:displayKind,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EDisplay",$_.__params__ = ["e","displayKind"],$_)
	,EDisplayNew: ($_=function(t) { return {_hx_index:25,t:t,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EDisplayNew",$_.__params__ = ["t"],$_)
	,ETernary: ($_=function(econd,eif,eelse) { return {_hx_index:26,econd:econd,eif:eif,eelse:eelse,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ETernary",$_.__params__ = ["econd","eif","eelse"],$_)
	,ECheckType: ($_=function(e,t) { return {_hx_index:27,e:e,t:t,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="ECheckType",$_.__params__ = ["e","t"],$_)
	,EMeta: ($_=function(s,e) { return {_hx_index:28,s:s,e:e,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EMeta",$_.__params__ = ["s","e"],$_)
	,EIs: ($_=function(e,t) { return {_hx_index:29,e:e,t:t,__enum__:"haxe.macro.ExprDef"}; },$_._hx_name="EIs",$_.__params__ = ["e","t"],$_)
};
haxe_macro_ExprDef.__constructs__ = [haxe_macro_ExprDef.EConst,haxe_macro_ExprDef.EArray,haxe_macro_ExprDef.EBinop,haxe_macro_ExprDef.EField,haxe_macro_ExprDef.EParenthesis,haxe_macro_ExprDef.EObjectDecl,haxe_macro_ExprDef.EArrayDecl,haxe_macro_ExprDef.ECall,haxe_macro_ExprDef.ENew,haxe_macro_ExprDef.EUnop,haxe_macro_ExprDef.EVars,haxe_macro_ExprDef.EFunction,haxe_macro_ExprDef.EBlock,haxe_macro_ExprDef.EFor,haxe_macro_ExprDef.EIf,haxe_macro_ExprDef.EWhile,haxe_macro_ExprDef.ESwitch,haxe_macro_ExprDef.ETry,haxe_macro_ExprDef.EReturn,haxe_macro_ExprDef.EBreak,haxe_macro_ExprDef.EContinue,haxe_macro_ExprDef.EUntyped,haxe_macro_ExprDef.EThrow,haxe_macro_ExprDef.ECast,haxe_macro_ExprDef.EDisplay,haxe_macro_ExprDef.EDisplayNew,haxe_macro_ExprDef.ETernary,haxe_macro_ExprDef.ECheckType,haxe_macro_ExprDef.EMeta,haxe_macro_ExprDef.EIs];
haxe_macro_ExprDef.__empty_constructs__ = [haxe_macro_ExprDef.EBreak,haxe_macro_ExprDef.EContinue];
var haxe_macro_DisplayKind = $hxEnums["haxe.macro.DisplayKind"] = { __ename__:"haxe.macro.DisplayKind",__constructs__:null
	,DKCall: {_hx_name:"DKCall",_hx_index:0,__enum__:"haxe.macro.DisplayKind"}
	,DKDot: {_hx_name:"DKDot",_hx_index:1,__enum__:"haxe.macro.DisplayKind"}
	,DKStructure: {_hx_name:"DKStructure",_hx_index:2,__enum__:"haxe.macro.DisplayKind"}
	,DKMarked: {_hx_name:"DKMarked",_hx_index:3,__enum__:"haxe.macro.DisplayKind"}
	,DKPattern: ($_=function(outermost) { return {_hx_index:4,outermost:outermost,__enum__:"haxe.macro.DisplayKind"}; },$_._hx_name="DKPattern",$_.__params__ = ["outermost"],$_)
};
haxe_macro_DisplayKind.__constructs__ = [haxe_macro_DisplayKind.DKCall,haxe_macro_DisplayKind.DKDot,haxe_macro_DisplayKind.DKStructure,haxe_macro_DisplayKind.DKMarked,haxe_macro_DisplayKind.DKPattern];
haxe_macro_DisplayKind.__empty_constructs__ = [haxe_macro_DisplayKind.DKCall,haxe_macro_DisplayKind.DKDot,haxe_macro_DisplayKind.DKStructure,haxe_macro_DisplayKind.DKMarked];
var haxe_macro_ComplexType = $hxEnums["haxe.macro.ComplexType"] = { __ename__:"haxe.macro.ComplexType",__constructs__:null
	,TPath: ($_=function(p) { return {_hx_index:0,p:p,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TPath",$_.__params__ = ["p"],$_)
	,TFunction: ($_=function(args,ret) { return {_hx_index:1,args:args,ret:ret,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TFunction",$_.__params__ = ["args","ret"],$_)
	,TAnonymous: ($_=function(fields) { return {_hx_index:2,fields:fields,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TAnonymous",$_.__params__ = ["fields"],$_)
	,TParent: ($_=function(t) { return {_hx_index:3,t:t,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TParent",$_.__params__ = ["t"],$_)
	,TExtend: ($_=function(p,fields) { return {_hx_index:4,p:p,fields:fields,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TExtend",$_.__params__ = ["p","fields"],$_)
	,TOptional: ($_=function(t) { return {_hx_index:5,t:t,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TOptional",$_.__params__ = ["t"],$_)
	,TNamed: ($_=function(n,t) { return {_hx_index:6,n:n,t:t,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TNamed",$_.__params__ = ["n","t"],$_)
	,TIntersection: ($_=function(tl) { return {_hx_index:7,tl:tl,__enum__:"haxe.macro.ComplexType"}; },$_._hx_name="TIntersection",$_.__params__ = ["tl"],$_)
};
haxe_macro_ComplexType.__constructs__ = [haxe_macro_ComplexType.TPath,haxe_macro_ComplexType.TFunction,haxe_macro_ComplexType.TAnonymous,haxe_macro_ComplexType.TParent,haxe_macro_ComplexType.TExtend,haxe_macro_ComplexType.TOptional,haxe_macro_ComplexType.TNamed,haxe_macro_ComplexType.TIntersection];
haxe_macro_ComplexType.__empty_constructs__ = [];
var haxe_macro_TypeParam = $hxEnums["haxe.macro.TypeParam"] = { __ename__:"haxe.macro.TypeParam",__constructs__:null
	,TPType: ($_=function(t) { return {_hx_index:0,t:t,__enum__:"haxe.macro.TypeParam"}; },$_._hx_name="TPType",$_.__params__ = ["t"],$_)
	,TPExpr: ($_=function(e) { return {_hx_index:1,e:e,__enum__:"haxe.macro.TypeParam"}; },$_._hx_name="TPExpr",$_.__params__ = ["e"],$_)
};
haxe_macro_TypeParam.__constructs__ = [haxe_macro_TypeParam.TPType,haxe_macro_TypeParam.TPExpr];
haxe_macro_TypeParam.__empty_constructs__ = [];
var haxe_macro_Access = $hxEnums["haxe.macro.Access"] = { __ename__:"haxe.macro.Access",__constructs__:null
	,APublic: {_hx_name:"APublic",_hx_index:0,__enum__:"haxe.macro.Access"}
	,APrivate: {_hx_name:"APrivate",_hx_index:1,__enum__:"haxe.macro.Access"}
	,AStatic: {_hx_name:"AStatic",_hx_index:2,__enum__:"haxe.macro.Access"}
	,AOverride: {_hx_name:"AOverride",_hx_index:3,__enum__:"haxe.macro.Access"}
	,ADynamic: {_hx_name:"ADynamic",_hx_index:4,__enum__:"haxe.macro.Access"}
	,AInline: {_hx_name:"AInline",_hx_index:5,__enum__:"haxe.macro.Access"}
	,AMacro: {_hx_name:"AMacro",_hx_index:6,__enum__:"haxe.macro.Access"}
	,AFinal: {_hx_name:"AFinal",_hx_index:7,__enum__:"haxe.macro.Access"}
	,AExtern: {_hx_name:"AExtern",_hx_index:8,__enum__:"haxe.macro.Access"}
	,AAbstract: {_hx_name:"AAbstract",_hx_index:9,__enum__:"haxe.macro.Access"}
	,AOverload: {_hx_name:"AOverload",_hx_index:10,__enum__:"haxe.macro.Access"}
};
haxe_macro_Access.__constructs__ = [haxe_macro_Access.APublic,haxe_macro_Access.APrivate,haxe_macro_Access.AStatic,haxe_macro_Access.AOverride,haxe_macro_Access.ADynamic,haxe_macro_Access.AInline,haxe_macro_Access.AMacro,haxe_macro_Access.AFinal,haxe_macro_Access.AExtern,haxe_macro_Access.AAbstract,haxe_macro_Access.AOverload];
haxe_macro_Access.__empty_constructs__ = [haxe_macro_Access.APublic,haxe_macro_Access.APrivate,haxe_macro_Access.AStatic,haxe_macro_Access.AOverride,haxe_macro_Access.ADynamic,haxe_macro_Access.AInline,haxe_macro_Access.AMacro,haxe_macro_Access.AFinal,haxe_macro_Access.AExtern,haxe_macro_Access.AAbstract,haxe_macro_Access.AOverload];
var haxe_macro_FieldType = $hxEnums["haxe.macro.FieldType"] = { __ename__:"haxe.macro.FieldType",__constructs__:null
	,FVar: ($_=function(t,e) { return {_hx_index:0,t:t,e:e,__enum__:"haxe.macro.FieldType"}; },$_._hx_name="FVar",$_.__params__ = ["t","e"],$_)
	,FFun: ($_=function(f) { return {_hx_index:1,f:f,__enum__:"haxe.macro.FieldType"}; },$_._hx_name="FFun",$_.__params__ = ["f"],$_)
	,FProp: ($_=function(get,set,t,e) { return {_hx_index:2,get:get,set:set,t:t,e:e,__enum__:"haxe.macro.FieldType"}; },$_._hx_name="FProp",$_.__params__ = ["get","set","t","e"],$_)
};
haxe_macro_FieldType.__constructs__ = [haxe_macro_FieldType.FVar,haxe_macro_FieldType.FFun,haxe_macro_FieldType.FProp];
haxe_macro_FieldType.__empty_constructs__ = [];
var haxe_macro_TypeDefKind = $hxEnums["haxe.macro.TypeDefKind"] = { __ename__:"haxe.macro.TypeDefKind",__constructs__:null
	,TDEnum: {_hx_name:"TDEnum",_hx_index:0,__enum__:"haxe.macro.TypeDefKind"}
	,TDStructure: {_hx_name:"TDStructure",_hx_index:1,__enum__:"haxe.macro.TypeDefKind"}
	,TDClass: ($_=function(superClass,interfaces,isInterface,isFinal,isAbstract) { return {_hx_index:2,superClass:superClass,interfaces:interfaces,isInterface:isInterface,isFinal:isFinal,isAbstract:isAbstract,__enum__:"haxe.macro.TypeDefKind"}; },$_._hx_name="TDClass",$_.__params__ = ["superClass","interfaces","isInterface","isFinal","isAbstract"],$_)
	,TDAlias: ($_=function(t) { return {_hx_index:3,t:t,__enum__:"haxe.macro.TypeDefKind"}; },$_._hx_name="TDAlias",$_.__params__ = ["t"],$_)
	,TDAbstract: ($_=function(tthis,from,to) { return {_hx_index:4,tthis:tthis,from:from,to:to,__enum__:"haxe.macro.TypeDefKind"}; },$_._hx_name="TDAbstract",$_.__params__ = ["tthis","from","to"],$_)
	,TDField: ($_=function(kind,access) { return {_hx_index:5,kind:kind,access:access,__enum__:"haxe.macro.TypeDefKind"}; },$_._hx_name="TDField",$_.__params__ = ["kind","access"],$_)
};
haxe_macro_TypeDefKind.__constructs__ = [haxe_macro_TypeDefKind.TDEnum,haxe_macro_TypeDefKind.TDStructure,haxe_macro_TypeDefKind.TDClass,haxe_macro_TypeDefKind.TDAlias,haxe_macro_TypeDefKind.TDAbstract,haxe_macro_TypeDefKind.TDField];
haxe_macro_TypeDefKind.__empty_constructs__ = [haxe_macro_TypeDefKind.TDEnum,haxe_macro_TypeDefKind.TDStructure];
class haxe_macro_Error extends haxe_Exception {
	constructor(message,pos,previous) {
		super(message,previous);
		this.pos = pos;
		this.__skipStack++;
	}
}
$hxClasses["haxe.macro.Error"] = haxe_macro_Error;
haxe_macro_Error.__name__ = "haxe.macro.Error";
haxe_macro_Error.__super__ = haxe_Exception;
Object.assign(haxe_macro_Error.prototype, {
	__class__: haxe_macro_Error
	,pos: null
});
var haxe_macro_ImportMode = $hxEnums["haxe.macro.ImportMode"] = { __ename__:"haxe.macro.ImportMode",__constructs__:null
	,INormal: {_hx_name:"INormal",_hx_index:0,__enum__:"haxe.macro.ImportMode"}
	,IAsName: ($_=function(alias) { return {_hx_index:1,alias:alias,__enum__:"haxe.macro.ImportMode"}; },$_._hx_name="IAsName",$_.__params__ = ["alias"],$_)
	,IAll: {_hx_name:"IAll",_hx_index:2,__enum__:"haxe.macro.ImportMode"}
};
haxe_macro_ImportMode.__constructs__ = [haxe_macro_ImportMode.INormal,haxe_macro_ImportMode.IAsName,haxe_macro_ImportMode.IAll];
haxe_macro_ImportMode.__empty_constructs__ = [haxe_macro_ImportMode.INormal,haxe_macro_ImportMode.IAll];
var haxe_macro_Type = $hxEnums["haxe.macro.Type"] = { __ename__:"haxe.macro.Type",__constructs__:null
	,TMono: ($_=function(t) { return {_hx_index:0,t:t,__enum__:"haxe.macro.Type"}; },$_._hx_name="TMono",$_.__params__ = ["t"],$_)
	,TEnum: ($_=function(t,params) { return {_hx_index:1,t:t,params:params,__enum__:"haxe.macro.Type"}; },$_._hx_name="TEnum",$_.__params__ = ["t","params"],$_)
	,TInst: ($_=function(t,params) { return {_hx_index:2,t:t,params:params,__enum__:"haxe.macro.Type"}; },$_._hx_name="TInst",$_.__params__ = ["t","params"],$_)
	,TType: ($_=function(t,params) { return {_hx_index:3,t:t,params:params,__enum__:"haxe.macro.Type"}; },$_._hx_name="TType",$_.__params__ = ["t","params"],$_)
	,TFun: ($_=function(args,ret) { return {_hx_index:4,args:args,ret:ret,__enum__:"haxe.macro.Type"}; },$_._hx_name="TFun",$_.__params__ = ["args","ret"],$_)
	,TAnonymous: ($_=function(a) { return {_hx_index:5,a:a,__enum__:"haxe.macro.Type"}; },$_._hx_name="TAnonymous",$_.__params__ = ["a"],$_)
	,TDynamic: ($_=function(t) { return {_hx_index:6,t:t,__enum__:"haxe.macro.Type"}; },$_._hx_name="TDynamic",$_.__params__ = ["t"],$_)
	,TLazy: ($_=function(f) { return {_hx_index:7,f:f,__enum__:"haxe.macro.Type"}; },$_._hx_name="TLazy",$_.__params__ = ["f"],$_)
	,TAbstract: ($_=function(t,params) { return {_hx_index:8,t:t,params:params,__enum__:"haxe.macro.Type"}; },$_._hx_name="TAbstract",$_.__params__ = ["t","params"],$_)
};
haxe_macro_Type.__constructs__ = [haxe_macro_Type.TMono,haxe_macro_Type.TEnum,haxe_macro_Type.TInst,haxe_macro_Type.TType,haxe_macro_Type.TFun,haxe_macro_Type.TAnonymous,haxe_macro_Type.TDynamic,haxe_macro_Type.TLazy,haxe_macro_Type.TAbstract];
haxe_macro_Type.__empty_constructs__ = [];
var haxe_macro_AnonStatus = $hxEnums["haxe.macro.AnonStatus"] = { __ename__:"haxe.macro.AnonStatus",__constructs__:null
	,AClosed: {_hx_name:"AClosed",_hx_index:0,__enum__:"haxe.macro.AnonStatus"}
	,AOpened: {_hx_name:"AOpened",_hx_index:1,__enum__:"haxe.macro.AnonStatus"}
	,AConst: {_hx_name:"AConst",_hx_index:2,__enum__:"haxe.macro.AnonStatus"}
	,AExtend: ($_=function(tl) { return {_hx_index:3,tl:tl,__enum__:"haxe.macro.AnonStatus"}; },$_._hx_name="AExtend",$_.__params__ = ["tl"],$_)
	,AClassStatics: ($_=function(t) { return {_hx_index:4,t:t,__enum__:"haxe.macro.AnonStatus"}; },$_._hx_name="AClassStatics",$_.__params__ = ["t"],$_)
	,AEnumStatics: ($_=function(t) { return {_hx_index:5,t:t,__enum__:"haxe.macro.AnonStatus"}; },$_._hx_name="AEnumStatics",$_.__params__ = ["t"],$_)
	,AAbstractStatics: ($_=function(t) { return {_hx_index:6,t:t,__enum__:"haxe.macro.AnonStatus"}; },$_._hx_name="AAbstractStatics",$_.__params__ = ["t"],$_)
};
haxe_macro_AnonStatus.__constructs__ = [haxe_macro_AnonStatus.AClosed,haxe_macro_AnonStatus.AOpened,haxe_macro_AnonStatus.AConst,haxe_macro_AnonStatus.AExtend,haxe_macro_AnonStatus.AClassStatics,haxe_macro_AnonStatus.AEnumStatics,haxe_macro_AnonStatus.AAbstractStatics];
haxe_macro_AnonStatus.__empty_constructs__ = [haxe_macro_AnonStatus.AClosed,haxe_macro_AnonStatus.AOpened,haxe_macro_AnonStatus.AConst];
var haxe_macro_ClassKind = $hxEnums["haxe.macro.ClassKind"] = { __ename__:"haxe.macro.ClassKind",__constructs__:null
	,KNormal: {_hx_name:"KNormal",_hx_index:0,__enum__:"haxe.macro.ClassKind"}
	,KTypeParameter: ($_=function(constraints) { return {_hx_index:1,constraints:constraints,__enum__:"haxe.macro.ClassKind"}; },$_._hx_name="KTypeParameter",$_.__params__ = ["constraints"],$_)
	,KModuleFields: ($_=function(module) { return {_hx_index:2,module:module,__enum__:"haxe.macro.ClassKind"}; },$_._hx_name="KModuleFields",$_.__params__ = ["module"],$_)
	,KExpr: ($_=function(expr) { return {_hx_index:3,expr:expr,__enum__:"haxe.macro.ClassKind"}; },$_._hx_name="KExpr",$_.__params__ = ["expr"],$_)
	,KGeneric: {_hx_name:"KGeneric",_hx_index:4,__enum__:"haxe.macro.ClassKind"}
	,KGenericInstance: ($_=function(cl,params) { return {_hx_index:5,cl:cl,params:params,__enum__:"haxe.macro.ClassKind"}; },$_._hx_name="KGenericInstance",$_.__params__ = ["cl","params"],$_)
	,KMacroType: {_hx_name:"KMacroType",_hx_index:6,__enum__:"haxe.macro.ClassKind"}
	,KAbstractImpl: ($_=function(a) { return {_hx_index:7,a:a,__enum__:"haxe.macro.ClassKind"}; },$_._hx_name="KAbstractImpl",$_.__params__ = ["a"],$_)
	,KGenericBuild: {_hx_name:"KGenericBuild",_hx_index:8,__enum__:"haxe.macro.ClassKind"}
};
haxe_macro_ClassKind.__constructs__ = [haxe_macro_ClassKind.KNormal,haxe_macro_ClassKind.KTypeParameter,haxe_macro_ClassKind.KModuleFields,haxe_macro_ClassKind.KExpr,haxe_macro_ClassKind.KGeneric,haxe_macro_ClassKind.KGenericInstance,haxe_macro_ClassKind.KMacroType,haxe_macro_ClassKind.KAbstractImpl,haxe_macro_ClassKind.KGenericBuild];
haxe_macro_ClassKind.__empty_constructs__ = [haxe_macro_ClassKind.KNormal,haxe_macro_ClassKind.KGeneric,haxe_macro_ClassKind.KMacroType,haxe_macro_ClassKind.KGenericBuild];
var haxe_macro_FieldKind = $hxEnums["haxe.macro.FieldKind"] = { __ename__:"haxe.macro.FieldKind",__constructs__:null
	,FVar: ($_=function(read,write) { return {_hx_index:0,read:read,write:write,__enum__:"haxe.macro.FieldKind"}; },$_._hx_name="FVar",$_.__params__ = ["read","write"],$_)
	,FMethod: ($_=function(k) { return {_hx_index:1,k:k,__enum__:"haxe.macro.FieldKind"}; },$_._hx_name="FMethod",$_.__params__ = ["k"],$_)
};
haxe_macro_FieldKind.__constructs__ = [haxe_macro_FieldKind.FVar,haxe_macro_FieldKind.FMethod];
haxe_macro_FieldKind.__empty_constructs__ = [];
var haxe_macro_VarAccess = $hxEnums["haxe.macro.VarAccess"] = { __ename__:"haxe.macro.VarAccess",__constructs__:null
	,AccNormal: {_hx_name:"AccNormal",_hx_index:0,__enum__:"haxe.macro.VarAccess"}
	,AccNo: {_hx_name:"AccNo",_hx_index:1,__enum__:"haxe.macro.VarAccess"}
	,AccNever: {_hx_name:"AccNever",_hx_index:2,__enum__:"haxe.macro.VarAccess"}
	,AccResolve: {_hx_name:"AccResolve",_hx_index:3,__enum__:"haxe.macro.VarAccess"}
	,AccCall: {_hx_name:"AccCall",_hx_index:4,__enum__:"haxe.macro.VarAccess"}
	,AccInline: {_hx_name:"AccInline",_hx_index:5,__enum__:"haxe.macro.VarAccess"}
	,AccRequire: ($_=function(r,msg) { return {_hx_index:6,r:r,msg:msg,__enum__:"haxe.macro.VarAccess"}; },$_._hx_name="AccRequire",$_.__params__ = ["r","msg"],$_)
	,AccCtor: {_hx_name:"AccCtor",_hx_index:7,__enum__:"haxe.macro.VarAccess"}
};
haxe_macro_VarAccess.__constructs__ = [haxe_macro_VarAccess.AccNormal,haxe_macro_VarAccess.AccNo,haxe_macro_VarAccess.AccNever,haxe_macro_VarAccess.AccResolve,haxe_macro_VarAccess.AccCall,haxe_macro_VarAccess.AccInline,haxe_macro_VarAccess.AccRequire,haxe_macro_VarAccess.AccCtor];
haxe_macro_VarAccess.__empty_constructs__ = [haxe_macro_VarAccess.AccNormal,haxe_macro_VarAccess.AccNo,haxe_macro_VarAccess.AccNever,haxe_macro_VarAccess.AccResolve,haxe_macro_VarAccess.AccCall,haxe_macro_VarAccess.AccInline,haxe_macro_VarAccess.AccCtor];
var haxe_macro_MethodKind = $hxEnums["haxe.macro.MethodKind"] = { __ename__:"haxe.macro.MethodKind",__constructs__:null
	,MethNormal: {_hx_name:"MethNormal",_hx_index:0,__enum__:"haxe.macro.MethodKind"}
	,MethInline: {_hx_name:"MethInline",_hx_index:1,__enum__:"haxe.macro.MethodKind"}
	,MethDynamic: {_hx_name:"MethDynamic",_hx_index:2,__enum__:"haxe.macro.MethodKind"}
	,MethMacro: {_hx_name:"MethMacro",_hx_index:3,__enum__:"haxe.macro.MethodKind"}
};
haxe_macro_MethodKind.__constructs__ = [haxe_macro_MethodKind.MethNormal,haxe_macro_MethodKind.MethInline,haxe_macro_MethodKind.MethDynamic,haxe_macro_MethodKind.MethMacro];
haxe_macro_MethodKind.__empty_constructs__ = [haxe_macro_MethodKind.MethNormal,haxe_macro_MethodKind.MethInline,haxe_macro_MethodKind.MethDynamic,haxe_macro_MethodKind.MethMacro];
var haxe_macro_TConstant = $hxEnums["haxe.macro.TConstant"] = { __ename__:"haxe.macro.TConstant",__constructs__:null
	,TInt: ($_=function(i) { return {_hx_index:0,i:i,__enum__:"haxe.macro.TConstant"}; },$_._hx_name="TInt",$_.__params__ = ["i"],$_)
	,TFloat: ($_=function(s) { return {_hx_index:1,s:s,__enum__:"haxe.macro.TConstant"}; },$_._hx_name="TFloat",$_.__params__ = ["s"],$_)
	,TString: ($_=function(s) { return {_hx_index:2,s:s,__enum__:"haxe.macro.TConstant"}; },$_._hx_name="TString",$_.__params__ = ["s"],$_)
	,TBool: ($_=function(b) { return {_hx_index:3,b:b,__enum__:"haxe.macro.TConstant"}; },$_._hx_name="TBool",$_.__params__ = ["b"],$_)
	,TNull: {_hx_name:"TNull",_hx_index:4,__enum__:"haxe.macro.TConstant"}
	,TThis: {_hx_name:"TThis",_hx_index:5,__enum__:"haxe.macro.TConstant"}
	,TSuper: {_hx_name:"TSuper",_hx_index:6,__enum__:"haxe.macro.TConstant"}
};
haxe_macro_TConstant.__constructs__ = [haxe_macro_TConstant.TInt,haxe_macro_TConstant.TFloat,haxe_macro_TConstant.TString,haxe_macro_TConstant.TBool,haxe_macro_TConstant.TNull,haxe_macro_TConstant.TThis,haxe_macro_TConstant.TSuper];
haxe_macro_TConstant.__empty_constructs__ = [haxe_macro_TConstant.TNull,haxe_macro_TConstant.TThis,haxe_macro_TConstant.TSuper];
var haxe_macro_ModuleType = $hxEnums["haxe.macro.ModuleType"] = { __ename__:"haxe.macro.ModuleType",__constructs__:null
	,TClassDecl: ($_=function(c) { return {_hx_index:0,c:c,__enum__:"haxe.macro.ModuleType"}; },$_._hx_name="TClassDecl",$_.__params__ = ["c"],$_)
	,TEnumDecl: ($_=function(e) { return {_hx_index:1,e:e,__enum__:"haxe.macro.ModuleType"}; },$_._hx_name="TEnumDecl",$_.__params__ = ["e"],$_)
	,TTypeDecl: ($_=function(t) { return {_hx_index:2,t:t,__enum__:"haxe.macro.ModuleType"}; },$_._hx_name="TTypeDecl",$_.__params__ = ["t"],$_)
	,TAbstract: ($_=function(a) { return {_hx_index:3,a:a,__enum__:"haxe.macro.ModuleType"}; },$_._hx_name="TAbstract",$_.__params__ = ["a"],$_)
};
haxe_macro_ModuleType.__constructs__ = [haxe_macro_ModuleType.TClassDecl,haxe_macro_ModuleType.TEnumDecl,haxe_macro_ModuleType.TTypeDecl,haxe_macro_ModuleType.TAbstract];
haxe_macro_ModuleType.__empty_constructs__ = [];
var haxe_macro_FieldAccess = $hxEnums["haxe.macro.FieldAccess"] = { __ename__:"haxe.macro.FieldAccess",__constructs__:null
	,FInstance: ($_=function(c,params,cf) { return {_hx_index:0,c:c,params:params,cf:cf,__enum__:"haxe.macro.FieldAccess"}; },$_._hx_name="FInstance",$_.__params__ = ["c","params","cf"],$_)
	,FStatic: ($_=function(c,cf) { return {_hx_index:1,c:c,cf:cf,__enum__:"haxe.macro.FieldAccess"}; },$_._hx_name="FStatic",$_.__params__ = ["c","cf"],$_)
	,FAnon: ($_=function(cf) { return {_hx_index:2,cf:cf,__enum__:"haxe.macro.FieldAccess"}; },$_._hx_name="FAnon",$_.__params__ = ["cf"],$_)
	,FDynamic: ($_=function(s) { return {_hx_index:3,s:s,__enum__:"haxe.macro.FieldAccess"}; },$_._hx_name="FDynamic",$_.__params__ = ["s"],$_)
	,FClosure: ($_=function(c,cf) { return {_hx_index:4,c:c,cf:cf,__enum__:"haxe.macro.FieldAccess"}; },$_._hx_name="FClosure",$_.__params__ = ["c","cf"],$_)
	,FEnum: ($_=function(e,ef) { return {_hx_index:5,e:e,ef:ef,__enum__:"haxe.macro.FieldAccess"}; },$_._hx_name="FEnum",$_.__params__ = ["e","ef"],$_)
};
haxe_macro_FieldAccess.__constructs__ = [haxe_macro_FieldAccess.FInstance,haxe_macro_FieldAccess.FStatic,haxe_macro_FieldAccess.FAnon,haxe_macro_FieldAccess.FDynamic,haxe_macro_FieldAccess.FClosure,haxe_macro_FieldAccess.FEnum];
haxe_macro_FieldAccess.__empty_constructs__ = [];
var haxe_macro_TypedExprDef = $hxEnums["haxe.macro.TypedExprDef"] = { __ename__:"haxe.macro.TypedExprDef",__constructs__:null
	,TConst: ($_=function(c) { return {_hx_index:0,c:c,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TConst",$_.__params__ = ["c"],$_)
	,TLocal: ($_=function(v) { return {_hx_index:1,v:v,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TLocal",$_.__params__ = ["v"],$_)
	,TArray: ($_=function(e1,e2) { return {_hx_index:2,e1:e1,e2:e2,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TArray",$_.__params__ = ["e1","e2"],$_)
	,TBinop: ($_=function(op,e1,e2) { return {_hx_index:3,op:op,e1:e1,e2:e2,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TBinop",$_.__params__ = ["op","e1","e2"],$_)
	,TField: ($_=function(e,fa) { return {_hx_index:4,e:e,fa:fa,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TField",$_.__params__ = ["e","fa"],$_)
	,TTypeExpr: ($_=function(m) { return {_hx_index:5,m:m,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TTypeExpr",$_.__params__ = ["m"],$_)
	,TParenthesis: ($_=function(e) { return {_hx_index:6,e:e,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TParenthesis",$_.__params__ = ["e"],$_)
	,TObjectDecl: ($_=function(fields) { return {_hx_index:7,fields:fields,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TObjectDecl",$_.__params__ = ["fields"],$_)
	,TArrayDecl: ($_=function(el) { return {_hx_index:8,el:el,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TArrayDecl",$_.__params__ = ["el"],$_)
	,TCall: ($_=function(e,el) { return {_hx_index:9,e:e,el:el,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TCall",$_.__params__ = ["e","el"],$_)
	,TNew: ($_=function(c,params,el) { return {_hx_index:10,c:c,params:params,el:el,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TNew",$_.__params__ = ["c","params","el"],$_)
	,TUnop: ($_=function(op,postFix,e) { return {_hx_index:11,op:op,postFix:postFix,e:e,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TUnop",$_.__params__ = ["op","postFix","e"],$_)
	,TFunction: ($_=function(tfunc) { return {_hx_index:12,tfunc:tfunc,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TFunction",$_.__params__ = ["tfunc"],$_)
	,TVar: ($_=function(v,expr) { return {_hx_index:13,v:v,expr:expr,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TVar",$_.__params__ = ["v","expr"],$_)
	,TBlock: ($_=function(el) { return {_hx_index:14,el:el,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TBlock",$_.__params__ = ["el"],$_)
	,TFor: ($_=function(v,e1,e2) { return {_hx_index:15,v:v,e1:e1,e2:e2,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TFor",$_.__params__ = ["v","e1","e2"],$_)
	,TIf: ($_=function(econd,eif,eelse) { return {_hx_index:16,econd:econd,eif:eif,eelse:eelse,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TIf",$_.__params__ = ["econd","eif","eelse"],$_)
	,TWhile: ($_=function(econd,e,normalWhile) { return {_hx_index:17,econd:econd,e:e,normalWhile:normalWhile,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TWhile",$_.__params__ = ["econd","e","normalWhile"],$_)
	,TSwitch: ($_=function(e,cases,edef) { return {_hx_index:18,e:e,cases:cases,edef:edef,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TSwitch",$_.__params__ = ["e","cases","edef"],$_)
	,TTry: ($_=function(e,catches) { return {_hx_index:19,e:e,catches:catches,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TTry",$_.__params__ = ["e","catches"],$_)
	,TReturn: ($_=function(e) { return {_hx_index:20,e:e,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TReturn",$_.__params__ = ["e"],$_)
	,TBreak: {_hx_name:"TBreak",_hx_index:21,__enum__:"haxe.macro.TypedExprDef"}
	,TContinue: {_hx_name:"TContinue",_hx_index:22,__enum__:"haxe.macro.TypedExprDef"}
	,TThrow: ($_=function(e) { return {_hx_index:23,e:e,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TThrow",$_.__params__ = ["e"],$_)
	,TCast: ($_=function(e,m) { return {_hx_index:24,e:e,m:m,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TCast",$_.__params__ = ["e","m"],$_)
	,TMeta: ($_=function(m,e1) { return {_hx_index:25,m:m,e1:e1,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TMeta",$_.__params__ = ["m","e1"],$_)
	,TEnumParameter: ($_=function(e1,ef,index) { return {_hx_index:26,e1:e1,ef:ef,index:index,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TEnumParameter",$_.__params__ = ["e1","ef","index"],$_)
	,TEnumIndex: ($_=function(e1) { return {_hx_index:27,e1:e1,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TEnumIndex",$_.__params__ = ["e1"],$_)
	,TIdent: ($_=function(s) { return {_hx_index:28,s:s,__enum__:"haxe.macro.TypedExprDef"}; },$_._hx_name="TIdent",$_.__params__ = ["s"],$_)
};
haxe_macro_TypedExprDef.__constructs__ = [haxe_macro_TypedExprDef.TConst,haxe_macro_TypedExprDef.TLocal,haxe_macro_TypedExprDef.TArray,haxe_macro_TypedExprDef.TBinop,haxe_macro_TypedExprDef.TField,haxe_macro_TypedExprDef.TTypeExpr,haxe_macro_TypedExprDef.TParenthesis,haxe_macro_TypedExprDef.TObjectDecl,haxe_macro_TypedExprDef.TArrayDecl,haxe_macro_TypedExprDef.TCall,haxe_macro_TypedExprDef.TNew,haxe_macro_TypedExprDef.TUnop,haxe_macro_TypedExprDef.TFunction,haxe_macro_TypedExprDef.TVar,haxe_macro_TypedExprDef.TBlock,haxe_macro_TypedExprDef.TFor,haxe_macro_TypedExprDef.TIf,haxe_macro_TypedExprDef.TWhile,haxe_macro_TypedExprDef.TSwitch,haxe_macro_TypedExprDef.TTry,haxe_macro_TypedExprDef.TReturn,haxe_macro_TypedExprDef.TBreak,haxe_macro_TypedExprDef.TContinue,haxe_macro_TypedExprDef.TThrow,haxe_macro_TypedExprDef.TCast,haxe_macro_TypedExprDef.TMeta,haxe_macro_TypedExprDef.TEnumParameter,haxe_macro_TypedExprDef.TEnumIndex,haxe_macro_TypedExprDef.TIdent];
haxe_macro_TypedExprDef.__empty_constructs__ = [haxe_macro_TypedExprDef.TBreak,haxe_macro_TypedExprDef.TContinue];
class haxe_macro_TypeTools {
	static nullable(complexType) {
		return haxe_macro_ComplexType.TPath({ pack : [], name : "Null", params : [haxe_macro_TypeParam.TPType(complexType)]});
	}
	static toField(cf) {
		let varAccessToString = function(va,getOrSet) {
			switch(va._hx_index) {
			case 1:
				return "null";
			case 2:
				return "never";
			case 3:
				throw haxe_Exception.thrown("Invalid TAnonymous");
			case 4:
				return getOrSet;
			case 5:
				return "default";
			case 6:
				let _g = va.r;
				let _g1 = va.msg;
				return "default";
			case 0:case 7:
				return "default";
			}
		};
		let access = cf.isPublic ? [haxe_macro_Access.APublic] : [haxe_macro_Access.APrivate];
		if(cf.meta.has(":final")) {
			access.push(haxe_macro_Access.AFinal);
		}
		if(cf.params.length == 0) {
			let cf1 = cf.name;
			let cf2 = cf.doc;
			let tmp;
			let _g = cf.kind;
			let _g1 = cf.type;
			switch(_g._hx_index) {
			case 0:
				let read = _g.read;
				let write = _g.write;
				let ret = _g1;
				tmp = haxe_macro_FieldType.FProp(varAccessToString(read,"get"),varAccessToString(write,"set"),haxe_macro_TypeTools.toComplexType(ret),null);
				break;
			case 1:
				let _g2 = _g.k;
				if(_g1._hx_index == 4) {
					let args = _g1.args;
					let ret = _g1.ret;
					let _g = [];
					let _g2 = 0;
					while(_g2 < args.length) {
						let a = args[_g2];
						++_g2;
						_g.push({ name : a.name, opt : a.opt, type : haxe_macro_TypeTools.toComplexType(a.t)});
					}
					tmp = haxe_macro_FieldType.FFun({ args : _g, ret : haxe_macro_TypeTools.toComplexType(ret), expr : null});
				} else {
					throw haxe_Exception.thrown("Invalid TAnonymous");
				}
				break;
			}
			return { name : cf1, doc : cf2, access : access, kind : tmp, pos : cf.pos, meta : cf.meta.get()};
		} else {
			throw haxe_Exception.thrown("Invalid TAnonymous");
		}
	}
	static toComplexType(type) {
		if(type == null) {
			return null;
		} else {
			switch(type._hx_index) {
			case 0:
				let t = type.t.get();
				if(t == null) {
					return null;
				} else {
					return haxe_macro_TypeTools.toComplexType(t);
				}
				break;
			case 1:
				let baseType = type.t.get();
				let params = type.params;
				return haxe_macro_ComplexType.TPath(haxe_macro_TypeTools.toTypePath(baseType,params));
			case 2:
				let classType = type.t.get();
				let params1 = type.params;
				let _g = classType.kind;
				if(_g._hx_index == 1) {
					let _g1 = _g.constraints;
					return haxe_macro_ComplexType.TPath({ name : classType.name, pack : []});
				} else {
					return haxe_macro_ComplexType.TPath(haxe_macro_TypeTools.toTypePath(classType,params1));
				}
				break;
			case 3:
				let baseType1 = type.t.get();
				let params2 = type.params;
				return haxe_macro_ComplexType.TPath(haxe_macro_TypeTools.toTypePath(baseType1,params2));
			case 4:
				let args = type.args;
				let ret = type.ret;
				let _g1 = [];
				let _g2 = 0;
				while(_g2 < args.length) {
					let a = args[_g2];
					++_g2;
					_g1.push(a.opt ? haxe_macro_TypeTools.nullable(haxe_macro_TypeTools.toComplexType(a.t)) : haxe_macro_TypeTools.toComplexType(a.t));
				}
				return haxe_macro_ComplexType.TFunction(_g1,haxe_macro_TypeTools.toComplexType(ret));
			case 5:
				let _hx_tmp = type.a.get();
				let _g3 = _hx_tmp.status;
				let fields = _hx_tmp.fields;
				let _g4 = [];
				let _g5 = 0;
				while(_g5 < fields.length) {
					let cf = fields[_g5];
					++_g5;
					_g4.push(haxe_macro_TypeTools.toField(cf));
				}
				return haxe_macro_ComplexType.TAnonymous(_g4);
			case 6:
				let t1 = type.t;
				if(t1 == null) {
					return haxe_macro_ComplexType.TPath({ pack : [], name : "Dynamic", params : []});
				} else {
					let ct = haxe_macro_TypeTools.toComplexType(t1);
					return haxe_macro_ComplexType.TPath({ pack : [], name : "Dynamic", params : [haxe_macro_TypeParam.TPType(ct)]});
				}
				break;
			case 7:
				let f = type.f;
				return haxe_macro_TypeTools.toComplexType(f());
			case 8:
				let baseType2 = type.t.get();
				let params3 = type.params;
				return haxe_macro_ComplexType.TPath(haxe_macro_TypeTools.toTypePath(baseType2,params3));
			}
		}
	}
	static toTypeParam(type) {
		if(type._hx_index == 2) {
			let _g = type.params;
			let _hx_tmp = type.t.get();
			let _g1 = _hx_tmp.constructor;
			let _g2 = _hx_tmp.doc;
			let _g3 = _hx_tmp.fields;
			let _g4 = _hx_tmp.init;
			let _g5 = _hx_tmp.interfaces;
			let _g6 = _hx_tmp.isAbstract;
			let _g7 = _hx_tmp.isExtern;
			let _g8 = _hx_tmp.isFinal;
			let _g9 = _hx_tmp.isInterface;
			let _g10 = _hx_tmp.isPrivate;
			let _g11 = _hx_tmp.kind;
			let _g12 = _hx_tmp.meta;
			let _g13 = _hx_tmp.module;
			let _g14 = _hx_tmp.name;
			let _g15 = _hx_tmp.overrides;
			let _g16 = _hx_tmp.pack;
			let _g17 = _hx_tmp.params;
			let _g18 = _hx_tmp.pos;
			let _g19 = _hx_tmp.statics;
			let _g20 = _hx_tmp.superClass;
			if(_g11._hx_index == 3) {
				let e = _g11.expr;
				return haxe_macro_TypeParam.TPExpr(e);
			} else {
				return haxe_macro_TypeParam.TPType(haxe_macro_TypeTools.toComplexType(type));
			}
		} else {
			return haxe_macro_TypeParam.TPType(haxe_macro_TypeTools.toComplexType(type));
		}
	}
	static toTypePath(baseType,params) {
		let module = baseType.module;
		let baseType1 = baseType.pack;
		let tmp = module.substring(module.lastIndexOf(".") + 1);
		let baseType2 = baseType.name;
		let _g = [];
		let _g1 = 0;
		while(_g1 < params.length) {
			let t = params[_g1];
			++_g1;
			_g.push(haxe_macro_TypeTools.toTypeParam(t));
		}
		return { pack : baseType1, name : tmp, sub : baseType2, params : _g};
	}
	static findField(c,name,isStatic) {
		if(isStatic == null) {
			isStatic = false;
		}
		let field = Lambda.find((isStatic ? c.statics : c.fields).get(),function(field) {
			return field.name == name;
		});
		if(field != null) {
			return field;
		} else if(c.superClass != null) {
			return haxe_macro_TypeTools.findField(c.superClass.t.get(),name,isStatic);
		} else {
			return null;
		}
	}
}
$hxClasses["haxe.macro.TypeTools"] = haxe_macro_TypeTools;
haxe_macro_TypeTools.__name__ = "haxe.macro.TypeTools";
var haxe_rtti_CType = $hxEnums["haxe.rtti.CType"] = { __ename__:"haxe.rtti.CType",__constructs__:null
	,CUnknown: {_hx_name:"CUnknown",_hx_index:0,__enum__:"haxe.rtti.CType"}
	,CEnum: ($_=function(name,params) { return {_hx_index:1,name:name,params:params,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CEnum",$_.__params__ = ["name","params"],$_)
	,CClass: ($_=function(name,params) { return {_hx_index:2,name:name,params:params,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CClass",$_.__params__ = ["name","params"],$_)
	,CTypedef: ($_=function(name,params) { return {_hx_index:3,name:name,params:params,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CTypedef",$_.__params__ = ["name","params"],$_)
	,CFunction: ($_=function(args,ret) { return {_hx_index:4,args:args,ret:ret,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CFunction",$_.__params__ = ["args","ret"],$_)
	,CAnonymous: ($_=function(fields) { return {_hx_index:5,fields:fields,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CAnonymous",$_.__params__ = ["fields"],$_)
	,CDynamic: ($_=function(t) { return {_hx_index:6,t:t,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CDynamic",$_.__params__ = ["t"],$_)
	,CAbstract: ($_=function(name,params) { return {_hx_index:7,name:name,params:params,__enum__:"haxe.rtti.CType"}; },$_._hx_name="CAbstract",$_.__params__ = ["name","params"],$_)
};
haxe_rtti_CType.__constructs__ = [haxe_rtti_CType.CUnknown,haxe_rtti_CType.CEnum,haxe_rtti_CType.CClass,haxe_rtti_CType.CTypedef,haxe_rtti_CType.CFunction,haxe_rtti_CType.CAnonymous,haxe_rtti_CType.CDynamic,haxe_rtti_CType.CAbstract];
haxe_rtti_CType.__empty_constructs__ = [haxe_rtti_CType.CUnknown];
var haxe_rtti_Rights = $hxEnums["haxe.rtti.Rights"] = { __ename__:"haxe.rtti.Rights",__constructs__:null
	,RNormal: {_hx_name:"RNormal",_hx_index:0,__enum__:"haxe.rtti.Rights"}
	,RNo: {_hx_name:"RNo",_hx_index:1,__enum__:"haxe.rtti.Rights"}
	,RCall: ($_=function(m) { return {_hx_index:2,m:m,__enum__:"haxe.rtti.Rights"}; },$_._hx_name="RCall",$_.__params__ = ["m"],$_)
	,RMethod: {_hx_name:"RMethod",_hx_index:3,__enum__:"haxe.rtti.Rights"}
	,RDynamic: {_hx_name:"RDynamic",_hx_index:4,__enum__:"haxe.rtti.Rights"}
	,RInline: {_hx_name:"RInline",_hx_index:5,__enum__:"haxe.rtti.Rights"}
};
haxe_rtti_Rights.__constructs__ = [haxe_rtti_Rights.RNormal,haxe_rtti_Rights.RNo,haxe_rtti_Rights.RCall,haxe_rtti_Rights.RMethod,haxe_rtti_Rights.RDynamic,haxe_rtti_Rights.RInline];
haxe_rtti_Rights.__empty_constructs__ = [haxe_rtti_Rights.RNormal,haxe_rtti_Rights.RNo,haxe_rtti_Rights.RMethod,haxe_rtti_Rights.RDynamic,haxe_rtti_Rights.RInline];
var haxe_rtti_TypeTree = $hxEnums["haxe.rtti.TypeTree"] = { __ename__:"haxe.rtti.TypeTree",__constructs__:null
	,TPackage: ($_=function(name,full,subs) { return {_hx_index:0,name:name,full:full,subs:subs,__enum__:"haxe.rtti.TypeTree"}; },$_._hx_name="TPackage",$_.__params__ = ["name","full","subs"],$_)
	,TClassdecl: ($_=function(c) { return {_hx_index:1,c:c,__enum__:"haxe.rtti.TypeTree"}; },$_._hx_name="TClassdecl",$_.__params__ = ["c"],$_)
	,TEnumdecl: ($_=function(e) { return {_hx_index:2,e:e,__enum__:"haxe.rtti.TypeTree"}; },$_._hx_name="TEnumdecl",$_.__params__ = ["e"],$_)
	,TTypedecl: ($_=function(t) { return {_hx_index:3,t:t,__enum__:"haxe.rtti.TypeTree"}; },$_._hx_name="TTypedecl",$_.__params__ = ["t"],$_)
	,TAbstractdecl: ($_=function(a) { return {_hx_index:4,a:a,__enum__:"haxe.rtti.TypeTree"}; },$_._hx_name="TAbstractdecl",$_.__params__ = ["a"],$_)
};
haxe_rtti_TypeTree.__constructs__ = [haxe_rtti_TypeTree.TPackage,haxe_rtti_TypeTree.TClassdecl,haxe_rtti_TypeTree.TEnumdecl,haxe_rtti_TypeTree.TTypedecl,haxe_rtti_TypeTree.TAbstractdecl];
haxe_rtti_TypeTree.__empty_constructs__ = [];
class haxe_rtti_TypeApi {
	static typeInfos(t) {
		let inf;
		switch(t._hx_index) {
		case 0:
			let _g = t.name;
			let _g1 = t.full;
			let _g2 = t.subs;
			throw haxe_Exception.thrown("Unexpected Package");
		case 1:
			let c = t.c;
			inf = c;
			break;
		case 2:
			let e = t.e;
			inf = e;
			break;
		case 3:
			let t1 = t.t;
			inf = t1;
			break;
		case 4:
			let a = t.a;
			inf = a;
			break;
		}
		return inf;
	}
	static isVar(t) {
		if(t._hx_index == 4) {
			let _g = t.args;
			let _g1 = t.ret;
			return false;
		} else {
			return true;
		}
	}
	static leq(f,l1,l2) {
		let it_current = 0;
		let it_array = l2;
		let _g = 0;
		while(_g < l1.length) {
			let e1 = l1[_g];
			++_g;
			if(it_current >= it_array.length) {
				return false;
			}
			let e2 = it_array[it_current++];
			if(!f(e1,e2)) {
				return false;
			}
		}
		if(it_current < it_array.length) {
			return false;
		}
		return true;
	}
	static rightsEq(r1,r2) {
		if(r1 == r2) {
			return true;
		}
		if(r1._hx_index == 2) {
			let m1 = r1.m;
			if(r2._hx_index == 2) {
				let m2 = r2.m;
				return m1 == m2;
			}
		}
		return false;
	}
	static typeEq(t1,t2) {
		switch(t1._hx_index) {
		case 0:
			return t2 == haxe_rtti_CType.CUnknown;
		case 1:
			let name = t1.name;
			let params = t1.params;
			if(t2._hx_index == 1) {
				let name2 = t2.name;
				let params2 = t2.params;
				if(name == name2) {
					return haxe_rtti_TypeApi.leq(haxe_rtti_TypeApi.typeEq,params,params2);
				} else {
					return false;
				}
			}
			break;
		case 2:
			let name1 = t1.name;
			let params1 = t1.params;
			if(t2._hx_index == 2) {
				let name2 = t2.name;
				let params2 = t2.params;
				if(name1 == name2) {
					return haxe_rtti_TypeApi.leq(haxe_rtti_TypeApi.typeEq,params1,params2);
				} else {
					return false;
				}
			}
			break;
		case 3:
			let name2 = t1.name;
			let params2 = t1.params;
			if(t2._hx_index == 3) {
				let name21 = t2.name;
				let params21 = t2.params;
				if(name2 == name21) {
					return haxe_rtti_TypeApi.leq(haxe_rtti_TypeApi.typeEq,params2,params21);
				} else {
					return false;
				}
			}
			break;
		case 4:
			let args = t1.args;
			let ret = t1.ret;
			if(t2._hx_index == 4) {
				let args2 = t2.args;
				let ret2 = t2.ret;
				if(haxe_rtti_TypeApi.leq(function(a,b) {
					if(a.name == b.name && a.opt == b.opt) {
						return haxe_rtti_TypeApi.typeEq(a.t,b.t);
					} else {
						return false;
					}
				},args,args2)) {
					return haxe_rtti_TypeApi.typeEq(ret,ret2);
				} else {
					return false;
				}
			}
			break;
		case 5:
			let fields = t1.fields;
			if(t2._hx_index == 5) {
				let fields2 = t2.fields;
				return haxe_rtti_TypeApi.leq(function(a,b) {
					return haxe_rtti_TypeApi.fieldEq(a,b);
				},fields,fields2);
			}
			break;
		case 6:
			let t = t1.t;
			if(t2._hx_index == 6) {
				let t21 = t2.t;
				if(t == null != (t21 == null)) {
					return false;
				}
				if(t != null) {
					return haxe_rtti_TypeApi.typeEq(t,t21);
				} else {
					return true;
				}
			}
			break;
		case 7:
			let name3 = t1.name;
			let params3 = t1.params;
			if(t2._hx_index == 7) {
				let name2 = t2.name;
				let params2 = t2.params;
				if(name3 == name2) {
					return haxe_rtti_TypeApi.leq(haxe_rtti_TypeApi.typeEq,params3,params2);
				} else {
					return false;
				}
			}
			break;
		}
		return false;
	}
	static fieldEq(f1,f2) {
		if(f1.name != f2.name) {
			return false;
		}
		if(!haxe_rtti_TypeApi.typeEq(f1.type,f2.type)) {
			return false;
		}
		if(f1.isPublic != f2.isPublic) {
			return false;
		}
		if(f1.doc != f2.doc) {
			return false;
		}
		if(!haxe_rtti_TypeApi.rightsEq(f1.get,f2.get)) {
			return false;
		}
		if(!haxe_rtti_TypeApi.rightsEq(f1.set,f2.set)) {
			return false;
		}
		if(f1.params == null != (f2.params == null)) {
			return false;
		}
		if(f1.params != null && f1.params.join(":") != f2.params.join(":")) {
			return false;
		}
		return true;
	}
	static constructorEq(c1,c2) {
		if(c1.name != c2.name) {
			return false;
		}
		if(c1.doc != c2.doc) {
			return false;
		}
		if(c1.args == null != (c2.args == null)) {
			return false;
		}
		if(c1.args != null && !haxe_rtti_TypeApi.leq(function(a,b) {
			if(a.name == b.name && a.opt == b.opt) {
				return haxe_rtti_TypeApi.typeEq(a.t,b.t);
			} else {
				return false;
			}
		},c1.args,c2.args)) {
			return false;
		}
		return true;
	}
}
$hxClasses["haxe.rtti.TypeApi"] = haxe_rtti_TypeApi;
haxe_rtti_TypeApi.__name__ = "haxe.rtti.TypeApi";
class haxe_rtti_CTypeTools {
	static toString(t) {
		switch(t._hx_index) {
		case 0:
			return "unknown";
		case 1:
			let name = t.name;
			let params = t.params;
			return haxe_rtti_CTypeTools.nameWithParams(name,params);
		case 2:
			let name1 = t.name;
			let params1 = t.params;
			return haxe_rtti_CTypeTools.nameWithParams(name1,params1);
		case 3:
			let name2 = t.name;
			let params2 = t.params;
			return haxe_rtti_CTypeTools.nameWithParams(name2,params2);
		case 4:
			let args = t.args;
			let ret = t.ret;
			if(args.length == 0) {
				return "Void -> " + haxe_rtti_CTypeTools.toString(ret);
			} else {
				let f = haxe_rtti_CTypeTools.functionArgumentName;
				let result = new Array(args.length);
				let _g = 0;
				let _g1 = args.length;
				while(_g < _g1) {
					let i = _g++;
					result[i] = f(args[i]);
				}
				return result.join(" -> ") + " -> " + haxe_rtti_CTypeTools.toString(ret);
			}
			break;
		case 5:
			let fields = t.fields;
			let f = haxe_rtti_CTypeTools.classField;
			let result = new Array(fields.length);
			let _g = 0;
			let _g1 = fields.length;
			while(_g < _g1) {
				let i = _g++;
				result[i] = f(fields[i]);
			}
			return "{ " + result.join(", ") + "}";
		case 6:
			let d = t.t;
			if(d == null) {
				return "Dynamic";
			} else {
				return "Dynamic<" + haxe_rtti_CTypeTools.toString(d) + ">";
			}
			break;
		case 7:
			let name3 = t.name;
			let params3 = t.params;
			return haxe_rtti_CTypeTools.nameWithParams(name3,params3);
		}
	}
	static nameWithParams(name,params) {
		if(params.length == 0) {
			return name;
		}
		let tmp = name + "<";
		let f = haxe_rtti_CTypeTools.toString;
		let result = new Array(params.length);
		let _g = 0;
		let _g1 = params.length;
		while(_g < _g1) {
			let i = _g++;
			result[i] = f(params[i]);
		}
		return tmp + result.join(", ") + ">";
	}
	static functionArgumentName(arg) {
		return (arg.opt ? "?" : "") + (arg.name == "" ? "" : arg.name + ":") + haxe_rtti_CTypeTools.toString(arg.t) + (arg.value == null ? "" : " = " + arg.value);
	}
	static classField(cf) {
		return cf.name + ":" + haxe_rtti_CTypeTools.toString(cf.type);
	}
}
$hxClasses["haxe.rtti.CTypeTools"] = haxe_rtti_CTypeTools;
haxe_rtti_CTypeTools.__name__ = "haxe.rtti.CTypeTools";
class haxe_rtti_Rtti {
	static getRtti(c) {
		let rtti = Reflect.field(c,"__rtti");
		if(rtti == null) {
			throw haxe_Exception.thrown("Class " + c.__name__ + " has no RTTI information, consider adding @:rtti");
		}
		let x = Xml.parse(rtti).firstElement();
		let infos = new haxe_rtti_XmlParser().processElement(x);
		if(infos._hx_index == 1) {
			let c = infos.c;
			return c;
		} else {
			let t = infos;
			throw haxe_Exception.thrown("Enum mismatch: expected TClassDecl but found " + Std.string(t));
		}
	}
	static hasRtti(c) {
		return Lambda.has(Type.getClassFields(c),"__rtti");
	}
}
$hxClasses["haxe.rtti.Rtti"] = haxe_rtti_Rtti;
haxe_rtti_Rtti.__name__ = "haxe.rtti.Rtti";
class haxe_rtti_XmlParser {
	constructor() {
		this.root = [];
	}
	sort(l) {
		if(l == null) {
			l = this.root;
		}
		l.sort(function(e1,e2) {
			let n1;
			if(e1._hx_index == 0) {
				let _g = e1.full;
				let _g1 = e1.subs;
				let p = e1.name;
				n1 = " " + p;
			} else {
				n1 = haxe_rtti_TypeApi.typeInfos(e1).path;
			}
			let n2;
			if(e2._hx_index == 0) {
				let _g = e2.full;
				let _g1 = e2.subs;
				let p = e2.name;
				n2 = " " + p;
			} else {
				n2 = haxe_rtti_TypeApi.typeInfos(e2).path;
			}
			if(n1 > n2) {
				return 1;
			}
			return -1;
		});
		let _g = 0;
		while(_g < l.length) {
			let x = l[_g];
			++_g;
			switch(x._hx_index) {
			case 0:
				let _g1 = x.name;
				let _g2 = x.full;
				let l1 = x.subs;
				this.sort(l1);
				break;
			case 1:
				let c = x.c;
				this.sortFields(c.fields);
				this.sortFields(c.statics);
				break;
			case 2:
				let _g3 = x.e;
				break;
			case 3:
				let _g4 = x.t;
				break;
			case 4:
				let _g5 = x.a;
				break;
			}
		}
	}
	sortFields(a) {
		a.sort(function(f1,f2) {
			let v1 = haxe_rtti_TypeApi.isVar(f1.type);
			let v2 = haxe_rtti_TypeApi.isVar(f2.type);
			if(v1 && !v2) {
				return -1;
			}
			if(v2 && !v1) {
				return 1;
			}
			if(f1.name == "new") {
				return -1;
			}
			if(f2.name == "new") {
				return 1;
			}
			if(f1.name > f2.name) {
				return 1;
			}
			return -1;
		});
	}
	process(x,platform) {
		this.curplatform = platform;
		if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
		}
		let this1 = x;
		this.xroot(this1);
	}
	mergeRights(f1,f2) {
		if(f1.get == haxe_rtti_Rights.RInline && f1.set == haxe_rtti_Rights.RNo && f2.get == haxe_rtti_Rights.RNormal && f2.set == haxe_rtti_Rights.RMethod) {
			f1.get = haxe_rtti_Rights.RNormal;
			f1.set = haxe_rtti_Rights.RMethod;
			return true;
		}
		if(Type.enumEq(f1.get,f2.get)) {
			return Type.enumEq(f1.set,f2.set);
		} else {
			return false;
		}
	}
	mergeDoc(f1,f2) {
		if(f1.doc == null) {
			f1.doc = f2.doc;
		} else if(f2.doc == null) {
			f2.doc = f1.doc;
		}
		return true;
	}
	mergeFields(f,f2) {
		if(!haxe_rtti_TypeApi.fieldEq(f,f2)) {
			if(f.name == f2.name && (this.mergeRights(f,f2) || this.mergeRights(f2,f)) && this.mergeDoc(f,f2)) {
				return haxe_rtti_TypeApi.fieldEq(f,f2);
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	newField(c,f) {
	}
	mergeClasses(c,c2) {
		if(c.isInterface != c2.isInterface) {
			return false;
		}
		if(this.curplatform != null) {
			c.platforms.push(this.curplatform);
		}
		if(c.isExtern != c2.isExtern) {
			c.isExtern = false;
		}
		let _g = 0;
		let _g1 = c2.fields;
		while(_g < _g1.length) {
			let f2 = _g1[_g];
			++_g;
			let found = null;
			let _g2 = 0;
			let _g3 = c.fields;
			while(_g2 < _g3.length) {
				let f = _g3[_g2];
				++_g2;
				if(this.mergeFields(f,f2)) {
					found = f;
					break;
				}
			}
			if(found == null) {
				this.newField(c,f2);
				c.fields.push(f2);
			} else if(this.curplatform != null) {
				found.platforms.push(this.curplatform);
			}
		}
		let _g2 = 0;
		let _g3 = c2.statics;
		while(_g2 < _g3.length) {
			let f2 = _g3[_g2];
			++_g2;
			let found = null;
			let _g = 0;
			let _g1 = c.statics;
			while(_g < _g1.length) {
				let f = _g1[_g];
				++_g;
				if(this.mergeFields(f,f2)) {
					found = f;
					break;
				}
			}
			if(found == null) {
				this.newField(c,f2);
				c.statics.push(f2);
			} else if(this.curplatform != null) {
				found.platforms.push(this.curplatform);
			}
		}
		return true;
	}
	mergeEnums(e,e2) {
		if(e.isExtern != e2.isExtern) {
			return false;
		}
		if(this.curplatform != null) {
			e.platforms.push(this.curplatform);
		}
		let _g = 0;
		let _g1 = e2.constructors;
		while(_g < _g1.length) {
			let c2 = _g1[_g];
			++_g;
			let found = null;
			let _g2 = 0;
			let _g3 = e.constructors;
			while(_g2 < _g3.length) {
				let c = _g3[_g2];
				++_g2;
				if(haxe_rtti_TypeApi.constructorEq(c,c2)) {
					found = c;
					break;
				}
			}
			if(found == null) {
				e.constructors.push(c2);
			} else if(this.curplatform != null) {
				found.platforms.push(this.curplatform);
			}
		}
		return true;
	}
	mergeTypedefs(t,t2) {
		if(this.curplatform == null) {
			return false;
		}
		t.platforms.push(this.curplatform);
		t.types.h[this.curplatform] = t2.type;
		return true;
	}
	mergeAbstracts(a,a2) {
		if(this.curplatform == null) {
			return false;
		}
		if(a.to.length != a2.to.length || a.from.length != a2.from.length) {
			return false;
		}
		let _g = 0;
		let _g1 = a.to.length;
		while(_g < _g1) {
			let i = _g++;
			if(!haxe_rtti_TypeApi.typeEq(a.to[i].t,a2.to[i].t)) {
				return false;
			}
		}
		let _g2 = 0;
		let _g3 = a.from.length;
		while(_g2 < _g3) {
			let i = _g2++;
			if(!haxe_rtti_TypeApi.typeEq(a.from[i].t,a2.from[i].t)) {
				return false;
			}
		}
		if(a2.impl != null) {
			this.mergeClasses(a.impl,a2.impl);
		}
		a.platforms.push(this.curplatform);
		return true;
	}
	merge(t) {
		let inf = haxe_rtti_TypeApi.typeInfos(t);
		let pack = inf.path.split(".");
		let cur = this.root;
		let curpack = [];
		pack.pop();
		let _g = 0;
		while(_g < pack.length) {
			let p = pack[_g];
			++_g;
			let found = false;
			let _g1 = 0;
			while(_g1 < cur.length) {
				let pk = cur[_g1];
				++_g1;
				if(pk._hx_index == 0) {
					let _g = pk.full;
					let pname = pk.name;
					let subs = pk.subs;
					if(pname == p) {
						found = true;
						cur = subs;
						break;
					}
				}
			}
			curpack.push(p);
			if(!found) {
				let pk = [];
				cur.push(haxe_rtti_TypeTree.TPackage(p,curpack.join("."),pk));
				cur = pk;
			}
		}
		let _g1 = 0;
		while(_g1 < cur.length) {
			let ct = cur[_g1];
			++_g1;
			let tmp;
			if(ct._hx_index == 0) {
				let _g = ct.name;
				let _g1 = ct.full;
				let _g2 = ct.subs;
				tmp = true;
			} else {
				tmp = false;
			}
			if(tmp) {
				continue;
			}
			let tinf = haxe_rtti_TypeApi.typeInfos(ct);
			if(tinf.path == inf.path) {
				let sameType = true;
				if(tinf.doc == null != (inf.doc == null)) {
					if(inf.doc == null) {
						inf.doc = tinf.doc;
					} else {
						tinf.doc = inf.doc;
					}
				}
				if(tinf.path == "haxe._Int64.NativeInt64") {
					continue;
				}
				if(tinf.module == inf.module && tinf.doc == inf.doc && tinf.isPrivate == inf.isPrivate) {
					switch(ct._hx_index) {
					case 0:
						let _g = ct.name;
						let _g1 = ct.full;
						let _g2 = ct.subs;
						sameType = false;
						break;
					case 1:
						let c = ct.c;
						if(t._hx_index == 1) {
							let c2 = t.c;
							if(this.mergeClasses(c,c2)) {
								return;
							}
						} else {
							sameType = false;
						}
						break;
					case 2:
						let e = ct.e;
						if(t._hx_index == 2) {
							let e2 = t.e;
							if(this.mergeEnums(e,e2)) {
								return;
							}
						} else {
							sameType = false;
						}
						break;
					case 3:
						let td = ct.t;
						if(t._hx_index == 3) {
							let td2 = t.t;
							if(this.mergeTypedefs(td,td2)) {
								return;
							}
						}
						break;
					case 4:
						let a = ct.a;
						if(t._hx_index == 4) {
							let a2 = t.a;
							if(this.mergeAbstracts(a,a2)) {
								return;
							}
						} else {
							sameType = false;
						}
						break;
					}
				}
				let msg = tinf.module != inf.module ? "module " + inf.module + " should be " + tinf.module : tinf.doc != inf.doc ? "documentation is different" : tinf.isPrivate != inf.isPrivate ? "private flag is different" : !sameType ? "type kind is different" : "could not merge definition";
				throw haxe_Exception.thrown("Incompatibilities between " + tinf.path + " in " + tinf.platforms.join(",") + " and " + this.curplatform + " (" + msg + ")");
			}
		}
		cur.push(t);
	}
	mkPath(p) {
		return p;
	}
	mkTypeParams(p) {
		let pl = p.split(":");
		if(pl[0] == "") {
			return [];
		}
		return pl;
	}
	mkRights(r) {
		switch(r) {
		case "dynamic":
			return haxe_rtti_Rights.RDynamic;
		case "inline":
			return haxe_rtti_Rights.RInline;
		case "method":
			return haxe_rtti_Rights.RMethod;
		case "null":
			return haxe_rtti_Rights.RNo;
		default:
			return haxe_rtti_Rights.RCall(r);
		}
	}
	xerror(c) {
		let tmp;
		if(c.nodeType == Xml.Document) {
			tmp = "Document";
		} else {
			if(c.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c.nodeType == null ? "null" : XmlType.toString(c.nodeType)));
			}
			tmp = c.nodeName;
		}
		throw haxe_Exception.thrown("Invalid " + tmp);
	}
	xroot(x) {
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			this.merge(this.processElement(c1));
		}
	}
	processElement(x) {
		if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
		}
		let this1 = x;
		let c = this1;
		let _g;
		if(c.nodeType == Xml.Document) {
			_g = "Document";
		} else {
			if(c.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c.nodeType == null ? "null" : XmlType.toString(c.nodeType)));
			}
			_g = c.nodeName;
		}
		switch(_g) {
		case "abstract":
			return haxe_rtti_TypeTree.TAbstractdecl(this.xabstract(c));
		case "class":
			return haxe_rtti_TypeTree.TClassdecl(this.xclass(c));
		case "enum":
			return haxe_rtti_TypeTree.TEnumdecl(this.xenum(c));
		case "typedef":
			return haxe_rtti_TypeTree.TTypedecl(this.xtypedef(c));
		default:
			return this.xerror(c);
		}
	}
	xmeta(x) {
		let ml = [];
		let _g = 0;
		let _g1 = haxe_xml__$Access_NodeListAccess.resolve(x,"m");
		while(_g < _g1.length) {
			let m = _g1[_g];
			++_g;
			let pl = [];
			let _g2 = 0;
			let _g3 = haxe_xml__$Access_NodeListAccess.resolve(m,"e");
			while(_g2 < _g3.length) {
				let p = _g3[_g2];
				++_g2;
				pl.push(haxe_xml_Access.get_innerHTML(p));
			}
			ml.push({ name : haxe_xml__$Access_AttribAccess.resolve(m,"n"), params : pl});
		}
		return ml;
	}
	xoverloads(x) {
		let l = [];
		let m = x.elements();
		while(m.hasNext()) {
			let m1 = m.next();
			l.push(this.xclassfield(m1));
		}
		return l;
	}
	xpath(x) {
		let path = this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path"));
		let params = [];
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			params.push(this.xtype(c1));
		}
		return { path : path, params : params};
	}
	xclass(x) {
		let csuper = null;
		let doc = null;
		let tdynamic = null;
		let interfaces = [];
		let fields = [];
		let statics = [];
		let meta = [];
		let isInterface = x.exists("interface");
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			let _g;
			if(c1.nodeType == Xml.Document) {
				_g = "Document";
			} else {
				if(c1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
				}
				_g = c1.nodeName;
			}
			switch(_g) {
			case "extends":
				if(isInterface) {
					interfaces.push(this.xpath(c1));
				} else {
					csuper = this.xpath(c1);
				}
				break;
			case "haxe_doc":
				doc = haxe_xml_Access.get_innerData(c1);
				break;
			case "haxe_dynamic":
				let x = c1.firstElement();
				if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
				}
				let this1 = x;
				tdynamic = this.xtype(this1);
				break;
			case "implements":
				interfaces.push(this.xpath(c1));
				break;
			case "meta":
				meta = this.xmeta(c1);
				break;
			default:
				if(c1.exists("static")) {
					statics.push(this.xclassfield(c1));
				} else {
					fields.push(this.xclassfield(c1));
				}
			}
		}
		return { file : haxe_xml__$Access_HasAttribAccess.resolve(x,"file") ? haxe_xml__$Access_AttribAccess.resolve(x,"file") : null, path : this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")), module : haxe_xml__$Access_HasAttribAccess.resolve(x,"module") ? this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"module")) : null, doc : doc, isPrivate : x.exists("private"), isExtern : x.exists("extern"), isFinal : x.exists("final"), isInterface : isInterface, params : this.mkTypeParams(haxe_xml__$Access_AttribAccess.resolve(x,"params")), superClass : csuper, interfaces : interfaces, fields : fields, statics : statics, tdynamic : tdynamic, platforms : this.defplat(), meta : meta};
	}
	xclassfield(x,defPublic) {
		if(defPublic == null) {
			defPublic = false;
		}
		let e = x.elements();
		let t = this.xtype(e.next());
		let doc = null;
		let meta = [];
		let overloads = null;
		let c = e;
		while(c.hasNext()) {
			let c1 = c.next();
			let _g;
			if(c1.nodeType == Xml.Document) {
				_g = "Document";
			} else {
				if(c1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
				}
				_g = c1.nodeName;
			}
			switch(_g) {
			case "haxe_doc":
				doc = haxe_xml_Access.get_innerData(c1);
				break;
			case "meta":
				meta = this.xmeta(c1);
				break;
			case "overloads":
				overloads = this.xoverloads(c1);
				break;
			default:
				this.xerror(c1);
			}
		}
		let tmp;
		if(x.nodeType == Xml.Document) {
			tmp = "Document";
		} else {
			if(x.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
			}
			tmp = x.nodeName;
		}
		return { name : tmp, type : t, isPublic : x.exists("public") || defPublic, isFinal : x.exists("final"), isOverride : x.exists("override"), line : haxe_xml__$Access_HasAttribAccess.resolve(x,"line") ? Std.parseInt(haxe_xml__$Access_AttribAccess.resolve(x,"line")) : null, doc : doc, get : haxe_xml__$Access_HasAttribAccess.resolve(x,"get") ? this.mkRights(haxe_xml__$Access_AttribAccess.resolve(x,"get")) : haxe_rtti_Rights.RNormal, set : haxe_xml__$Access_HasAttribAccess.resolve(x,"set") ? this.mkRights(haxe_xml__$Access_AttribAccess.resolve(x,"set")) : haxe_rtti_Rights.RNormal, params : haxe_xml__$Access_HasAttribAccess.resolve(x,"params") ? this.mkTypeParams(haxe_xml__$Access_AttribAccess.resolve(x,"params")) : [], platforms : this.defplat(), meta : meta, overloads : overloads, expr : haxe_xml__$Access_HasAttribAccess.resolve(x,"expr") ? haxe_xml__$Access_AttribAccess.resolve(x,"expr") : null};
	}
	xenum(x) {
		let cl = [];
		let doc = null;
		let meta = [];
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			let tmp;
			if(c1.nodeType == Xml.Document) {
				tmp = "Document";
			} else {
				if(c1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
				}
				tmp = c1.nodeName;
			}
			if(tmp == "haxe_doc") {
				doc = haxe_xml_Access.get_innerData(c1);
			} else {
				let tmp;
				if(c1.nodeType == Xml.Document) {
					tmp = "Document";
				} else {
					if(c1.nodeType != Xml.Element) {
						throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
					}
					tmp = c1.nodeName;
				}
				if(tmp == "meta") {
					meta = this.xmeta(c1);
				} else {
					cl.push(this.xenumfield(c1));
				}
			}
		}
		return { file : haxe_xml__$Access_HasAttribAccess.resolve(x,"file") ? haxe_xml__$Access_AttribAccess.resolve(x,"file") : null, path : this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")), module : haxe_xml__$Access_HasAttribAccess.resolve(x,"module") ? this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"module")) : null, doc : doc, isPrivate : x.exists("private"), isExtern : x.exists("extern"), params : this.mkTypeParams(haxe_xml__$Access_AttribAccess.resolve(x,"params")), constructors : cl, platforms : this.defplat(), meta : meta};
	}
	xenumfield(x) {
		let args = null;
		let docElements = x.elementsNamed("haxe_doc");
		let xdoc = docElements.hasNext() ? docElements.next() : null;
		let meta = haxe_xml__$Access_HasNodeAccess.resolve(x,"meta") ? this.xmeta(haxe_xml__$Access_NodeAccess.resolve(x,"meta")) : [];
		if(haxe_xml__$Access_HasAttribAccess.resolve(x,"a")) {
			let names = haxe_xml__$Access_AttribAccess.resolve(x,"a").split(":");
			let elts = x.elements();
			args = [];
			let _g = 0;
			while(_g < names.length) {
				let c = names[_g];
				++_g;
				let opt = false;
				if(c.charAt(0) == "?") {
					opt = true;
					c = HxOverrides.substr(c,1,null);
				}
				args.push({ name : c, opt : opt, t : this.xtype(elts.next())});
			}
		}
		let tmp;
		if(x.nodeType == Xml.Document) {
			tmp = "Document";
		} else {
			if(x.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
			}
			tmp = x.nodeName;
		}
		let tmp1;
		if(xdoc == null) {
			tmp1 = null;
		} else {
			if(xdoc.nodeType != Xml.Document && xdoc.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Invalid nodeType " + (xdoc.nodeType == null ? "null" : XmlType.toString(xdoc.nodeType)));
			}
			let this1 = xdoc;
			tmp1 = haxe_xml_Access.get_innerData(this1);
		}
		return { name : tmp, args : args, doc : tmp1, meta : meta, platforms : this.defplat()};
	}
	xabstract(x) {
		let doc = null;
		let impl = null;
		let athis = null;
		let meta = [];
		let to = [];
		let from = [];
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			let _g;
			if(c1.nodeType == Xml.Document) {
				_g = "Document";
			} else {
				if(c1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
				}
				_g = c1.nodeName;
			}
			switch(_g) {
			case "from":
				let t = c1.elements();
				while(t.hasNext()) {
					let t1 = t.next();
					let x = t1.firstElement();
					if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
						throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
					}
					let this1 = x;
					from.push({ t : this.xtype(this1), field : haxe_xml__$Access_HasAttribAccess.resolve(t1,"field") ? haxe_xml__$Access_AttribAccess.resolve(t1,"field") : null});
				}
				break;
			case "haxe_doc":
				doc = haxe_xml_Access.get_innerData(c1);
				break;
			case "impl":
				impl = this.xclass(haxe_xml__$Access_NodeAccess.resolve(c1,"class"));
				break;
			case "meta":
				meta = this.xmeta(c1);
				break;
			case "this":
				let x = c1.firstElement();
				if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
				}
				let this1 = x;
				athis = this.xtype(this1);
				break;
			case "to":
				let t1 = c1.elements();
				while(t1.hasNext()) {
					let t = t1.next();
					let x = t.firstElement();
					if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
						throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
					}
					let this1 = x;
					to.push({ t : this.xtype(this1), field : haxe_xml__$Access_HasAttribAccess.resolve(t,"field") ? haxe_xml__$Access_AttribAccess.resolve(t,"field") : null});
				}
				break;
			default:
				this.xerror(c1);
			}
		}
		return { file : haxe_xml__$Access_HasAttribAccess.resolve(x,"file") ? haxe_xml__$Access_AttribAccess.resolve(x,"file") : null, path : this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")), module : haxe_xml__$Access_HasAttribAccess.resolve(x,"module") ? this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"module")) : null, doc : doc, isPrivate : x.exists("private"), params : this.mkTypeParams(haxe_xml__$Access_AttribAccess.resolve(x,"params")), platforms : this.defplat(), meta : meta, athis : athis, to : to, from : from, impl : impl};
	}
	xtypedef(x) {
		let doc = null;
		let t = null;
		let meta = [];
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			let tmp;
			if(c1.nodeType == Xml.Document) {
				tmp = "Document";
			} else {
				if(c1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
				}
				tmp = c1.nodeName;
			}
			if(tmp == "haxe_doc") {
				doc = haxe_xml_Access.get_innerData(c1);
			} else {
				let tmp;
				if(c1.nodeType == Xml.Document) {
					tmp = "Document";
				} else {
					if(c1.nodeType != Xml.Element) {
						throw haxe_Exception.thrown("Bad node type, expected Element but found " + (c1.nodeType == null ? "null" : XmlType.toString(c1.nodeType)));
					}
					tmp = c1.nodeName;
				}
				if(tmp == "meta") {
					meta = this.xmeta(c1);
				} else {
					t = this.xtype(c1);
				}
			}
		}
		let types = new haxe_ds_StringMap();
		if(this.curplatform != null) {
			types.h[this.curplatform] = t;
		}
		return { file : haxe_xml__$Access_HasAttribAccess.resolve(x,"file") ? haxe_xml__$Access_AttribAccess.resolve(x,"file") : null, path : this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")), module : haxe_xml__$Access_HasAttribAccess.resolve(x,"module") ? this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"module")) : null, doc : doc, isPrivate : x.exists("private"), params : this.mkTypeParams(haxe_xml__$Access_AttribAccess.resolve(x,"params")), type : t, types : types, platforms : this.defplat(), meta : meta};
	}
	xtype(x) {
		let _g;
		if(x.nodeType == Xml.Document) {
			_g = "Document";
		} else {
			if(x.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
			}
			_g = x.nodeName;
		}
		switch(_g) {
		case "a":
			let fields = [];
			let f = x.elements();
			while(f.hasNext()) {
				let f1 = f.next();
				let f2 = this.xclassfield(f1,true);
				f2.platforms = [];
				fields.push(f2);
			}
			return haxe_rtti_CType.CAnonymous(fields);
		case "c":
			return haxe_rtti_CType.CClass(this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")),this.xtypeparams(x));
		case "d":
			let t = null;
			let tx = x.firstElement();
			if(tx != null) {
				if(tx.nodeType != Xml.Document && tx.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Invalid nodeType " + (tx.nodeType == null ? "null" : XmlType.toString(tx.nodeType)));
				}
				let this1 = tx;
				t = this.xtype(this1);
			}
			return haxe_rtti_CType.CDynamic(t);
		case "e":
			return haxe_rtti_CType.CEnum(this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")),this.xtypeparams(x));
		case "f":
			let args = [];
			let aname = haxe_xml__$Access_AttribAccess.resolve(x,"a").split(":");
			let eargs_current = 0;
			let eargs_array = aname;
			let evalues = haxe_xml__$Access_HasAttribAccess.resolve(x,"v") ? new haxe_iterators_ArrayIterator(haxe_xml__$Access_AttribAccess.resolve(x,"v").split(":")) : null;
			let e = x.elements();
			while(e.hasNext()) {
				let e1 = e.next();
				let opt = false;
				let a = eargs_current < eargs_array.length ? eargs_array[eargs_current++] : null;
				if(a == null) {
					a = "";
				}
				if(a.charAt(0) == "?") {
					opt = true;
					a = HxOverrides.substr(a,1,null);
				}
				let v = evalues == null || evalues.current >= evalues.array.length ? null : evalues.array[evalues.current++];
				args.push({ name : a, opt : opt, t : this.xtype(e1), value : v == "" ? null : v});
			}
			let ret = args[args.length - 1];
			HxOverrides.remove(args,ret);
			return haxe_rtti_CType.CFunction(args,ret.t);
		case "t":
			return haxe_rtti_CType.CTypedef(this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")),this.xtypeparams(x));
		case "unknown":
			return haxe_rtti_CType.CUnknown;
		case "x":
			return haxe_rtti_CType.CAbstract(this.mkPath(haxe_xml__$Access_AttribAccess.resolve(x,"path")),this.xtypeparams(x));
		default:
			return this.xerror(x);
		}
	}
	xtypeparams(x) {
		let p = [];
		let c = x.elements();
		while(c.hasNext()) {
			let c1 = c.next();
			p.push(this.xtype(c1));
		}
		return p;
	}
	defplat() {
		let l = [];
		if(this.curplatform != null) {
			l.push(this.curplatform);
		}
		return l;
	}
}
$hxClasses["haxe.rtti.XmlParser"] = haxe_rtti_XmlParser;
haxe_rtti_XmlParser.__name__ = "haxe.rtti.XmlParser";
Object.assign(haxe_rtti_XmlParser.prototype, {
	__class__: haxe_rtti_XmlParser
	,root: null
	,curplatform: null
});
class haxe_xml__$Access_NodeAccess {
	static resolve(this1,name) {
		let x = this1.elementsNamed(name).next();
		if(x == null) {
			let xname;
			if(this1.nodeType == Xml.Document) {
				xname = "Document";
			} else {
				if(this1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
				}
				xname = this1.nodeName;
			}
			throw haxe_Exception.thrown(xname + " is missing element " + name);
		}
		if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
		}
		let this2 = x;
		return this2;
	}
}
class haxe_xml__$Access_AttribAccess {
	static resolve(this1,name) {
		if(this1.nodeType == Xml.Document) {
			throw haxe_Exception.thrown("Cannot access document attribute " + name);
		}
		let v = this1.get(name);
		if(v == null) {
			if(this1.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
			}
			throw haxe_Exception.thrown(this1.nodeName + " is missing attribute " + name);
		}
		return v;
	}
	static _hx_set(this1,name,value) {
		if(this1.nodeType == Xml.Document) {
			throw haxe_Exception.thrown("Cannot access document attribute " + name);
		}
		this1.set(name,value);
		return value;
	}
}
class haxe_xml__$Access_HasAttribAccess {
	static resolve(this1,name) {
		if(this1.nodeType == Xml.Document) {
			throw haxe_Exception.thrown("Cannot access document attribute " + name);
		}
		return this1.exists(name);
	}
}
class haxe_xml__$Access_HasNodeAccess {
	static resolve(this1,name) {
		return this1.elementsNamed(name).hasNext();
	}
}
class haxe_xml__$Access_NodeListAccess {
	static resolve(this1,name) {
		let l = [];
		let x = this1.elementsNamed(name);
		while(x.hasNext()) {
			let x1 = x.next();
			if(x1.nodeType != Xml.Document && x1.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Invalid nodeType " + (x1.nodeType == null ? "null" : XmlType.toString(x1.nodeType)));
			}
			let this1 = x1;
			l.push(this1);
		}
		return l;
	}
}
class haxe_xml_Access {
	static get_x(this1) {
		return this1;
	}
	static get_name(this1) {
		if(this1.nodeType == Xml.Document) {
			return "Document";
		} else {
			if(this1.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
			}
			return this1.nodeName;
		}
	}
	static get_node(this1) {
		return this1;
	}
	static get_nodes(this1) {
		return this1;
	}
	static get_att(this1) {
		return this1;
	}
	static get_has(this1) {
		return this1;
	}
	static get_hasNode(this1) {
		return this1;
	}
	static get_elements(this1) {
		return this1.elements();
	}
	static _new(x) {
		if(x.nodeType != Xml.Document && x.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Invalid nodeType " + (x.nodeType == null ? "null" : XmlType.toString(x.nodeType)));
		}
		let this1 = x;
		return this1;
	}
	static get_innerData(this1) {
		if(this1.nodeType != Xml.Document && this1.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
		}
		let it_current = 0;
		let it_array = this1.children;
		if(it_current >= it_array.length) {
			let tmp;
			if(this1.nodeType == Xml.Document) {
				tmp = "Document";
			} else {
				if(this1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
				}
				tmp = this1.nodeName;
			}
			throw haxe_Exception.thrown(tmp + " does not have data");
		}
		let v = it_array[it_current++];
		if(it_current < it_array.length) {
			let n = it_array[it_current++];
			let tmp;
			if(v.nodeType == Xml.PCData && n.nodeType == Xml.CData) {
				if(v.nodeType == Xml.Document || v.nodeType == Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, unexpected " + (v.nodeType == null ? "null" : XmlType.toString(v.nodeType)));
				}
				tmp = StringTools.trim(v.nodeValue) == "";
			} else {
				tmp = false;
			}
			if(tmp) {
				if(it_current >= it_array.length) {
					if(n.nodeType == Xml.Document || n.nodeType == Xml.Element) {
						throw haxe_Exception.thrown("Bad node type, unexpected " + (n.nodeType == null ? "null" : XmlType.toString(n.nodeType)));
					}
					return n.nodeValue;
				}
				let n2 = it_array[it_current++];
				let tmp;
				if(n2.nodeType == Xml.PCData) {
					if(n2.nodeType == Xml.Document || n2.nodeType == Xml.Element) {
						throw haxe_Exception.thrown("Bad node type, unexpected " + (n2.nodeType == null ? "null" : XmlType.toString(n2.nodeType)));
					}
					tmp = StringTools.trim(n2.nodeValue) == "";
				} else {
					tmp = false;
				}
				if(tmp && it_current >= it_array.length) {
					if(n.nodeType == Xml.Document || n.nodeType == Xml.Element) {
						throw haxe_Exception.thrown("Bad node type, unexpected " + (n.nodeType == null ? "null" : XmlType.toString(n.nodeType)));
					}
					return n.nodeValue;
				}
			}
			let tmp1;
			if(this1.nodeType == Xml.Document) {
				tmp1 = "Document";
			} else {
				if(this1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
				}
				tmp1 = this1.nodeName;
			}
			throw haxe_Exception.thrown(tmp1 + " does not only have data");
		}
		if(v.nodeType != Xml.PCData && v.nodeType != Xml.CData) {
			let tmp;
			if(this1.nodeType == Xml.Document) {
				tmp = "Document";
			} else {
				if(this1.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
				}
				tmp = this1.nodeName;
			}
			throw haxe_Exception.thrown(tmp + " does not have data");
		}
		if(v.nodeType == Xml.Document || v.nodeType == Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, unexpected " + (v.nodeType == null ? "null" : XmlType.toString(v.nodeType)));
		}
		return v.nodeValue;
	}
	static get_innerHTML(this1) {
		let s_b = "";
		if(this1.nodeType != Xml.Document && this1.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (this1.nodeType == null ? "null" : XmlType.toString(this1.nodeType)));
		}
		let _g_current = 0;
		let _g_array = this1.children;
		while(_g_current < _g_array.length) {
			let x = _g_array[_g_current++];
			s_b += Std.string(haxe_xml_Printer.print(x));
		}
		return s_b;
	}
}
haxe_xml_Access.__properties__ = {get_elements: "get_elements",get_hasNode: "get_hasNode",get_has: "get_has",get_att: "get_att",get_nodes: "get_nodes",get_node: "get_node",get_innerHTML: "get_innerHTML",get_innerData: "get_innerData",get_name: "get_name",get_x: "get_x"};
class haxe_xml_XmlParserException {
	constructor(message,xml,position) {
		this.xml = xml;
		this.message = message;
		this.position = position;
		this.lineNumber = 1;
		this.positionAtLine = 0;
		let _g = 0;
		let _g1 = position;
		while(_g < _g1) {
			let i = _g++;
			let c = xml.charCodeAt(i);
			if(c == 10) {
				this.lineNumber++;
				this.positionAtLine = 0;
			} else if(c != 13) {
				this.positionAtLine++;
			}
		}
	}
	toString() {
		let c = js_Boot.getClass(this);
		return c.__name__ + ": " + this.message + " at line " + this.lineNumber + " char " + this.positionAtLine;
	}
}
$hxClasses["haxe.xml.XmlParserException"] = haxe_xml_XmlParserException;
haxe_xml_XmlParserException.__name__ = "haxe.xml.XmlParserException";
Object.assign(haxe_xml_XmlParserException.prototype, {
	__class__: haxe_xml_XmlParserException
	,message: null
	,lineNumber: null
	,positionAtLine: null
	,position: null
	,xml: null
});
class haxe_xml_Parser {
	static parse(str,strict) {
		if(strict == null) {
			strict = false;
		}
		let doc = Xml.createDocument();
		haxe_xml_Parser.doParse(str,strict,0,doc);
		return doc;
	}
	static doParse(str,strict,p,parent) {
		if(p == null) {
			p = 0;
		}
		let xml = null;
		let state = 1;
		let next = 1;
		let aname = null;
		let start = 0;
		let nsubs = 0;
		let nbrackets = 0;
		let buf = new StringBuf();
		let escapeNext = 1;
		let attrValQuote = -1;
		while(p < str.length) {
			let c = str.charCodeAt(p);
			switch(state) {
			case 0:
				switch(c) {
				case 9:case 10:case 13:case 32:
					break;
				default:
					state = next;
					continue;
				}
				break;
			case 1:
				if(c == 60) {
					state = 0;
					next = 2;
				} else {
					start = p;
					state = 13;
					continue;
				}
				break;
			case 2:
				switch(c) {
				case 33:
					if(str.charCodeAt(p + 1) == 91) {
						p += 2;
						if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") {
							throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected <![CDATA[",str,p));
						}
						p += 5;
						state = 17;
						start = p + 1;
					} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
						if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") {
							throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected <!DOCTYPE",str,p));
						}
						p += 8;
						state = 16;
						start = p + 1;
					} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected <!--",str,p));
					} else {
						p += 2;
						state = 15;
						start = p + 1;
					}
					break;
				case 47:
					if(parent == null) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected node name",str,p));
					}
					start = p + 1;
					state = 0;
					next = 10;
					break;
				case 63:
					state = 14;
					start = p;
					break;
				default:
					state = 3;
					start = p;
					continue;
				}
				break;
			case 3:
				if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
					if(p == start) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected node name",str,p));
					}
					xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
					parent.addChild(xml);
					++nsubs;
					state = 0;
					next = 4;
					continue;
				}
				break;
			case 4:
				switch(c) {
				case 47:
					state = 11;
					break;
				case 62:
					state = 9;
					break;
				default:
					state = 5;
					start = p;
					continue;
				}
				break;
			case 5:
				if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
					if(start == p) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected attribute name",str,p));
					}
					let tmp = HxOverrides.substr(str,start,p - start);
					aname = tmp;
					if(xml.exists(aname)) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Duplicate attribute [" + aname + "]",str,p));
					}
					state = 0;
					next = 6;
					continue;
				}
				break;
			case 6:
				if(c == 61) {
					state = 0;
					next = 7;
				} else {
					throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected =",str,p));
				}
				break;
			case 7:
				switch(c) {
				case 34:case 39:
					buf = new StringBuf();
					state = 8;
					start = p + 1;
					attrValQuote = c;
					break;
				default:
					throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected \"",str,p));
				}
				break;
			case 8:
				switch(c) {
				case 38:
					let len = p - start;
					buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
					state = 18;
					escapeNext = 8;
					start = p + 1;
					break;
				case 60:case 62:
					if(strict) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Invalid unescaped " + String.fromCodePoint(c) + " in attribute value",str,p));
					} else if(c == attrValQuote) {
						let len = p - start;
						buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
						let val = buf.b;
						buf = new StringBuf();
						xml.set(aname,val);
						state = 0;
						next = 4;
					}
					break;
				default:
					if(c == attrValQuote) {
						let len = p - start;
						buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
						let val = buf.b;
						buf = new StringBuf();
						xml.set(aname,val);
						state = 0;
						next = 4;
					}
				}
				break;
			case 9:
				p = haxe_xml_Parser.doParse(str,strict,p,xml);
				start = p;
				state = 1;
				break;
			case 10:
				if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
					if(start == p) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected node name",str,p));
					}
					let v = HxOverrides.substr(str,start,p - start);
					if(parent == null || parent.nodeType != 0) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Unexpected </" + v + ">, tag is not open",str,p));
					}
					if(parent.nodeType != Xml.Element) {
						throw haxe_Exception.thrown("Bad node type, expected Element but found " + (parent.nodeType == null ? "null" : XmlType.toString(parent.nodeType)));
					}
					if(v != parent.nodeName) {
						if(parent.nodeType != Xml.Element) {
							throw haxe_Exception.thrown("Bad node type, expected Element but found " + (parent.nodeType == null ? "null" : XmlType.toString(parent.nodeType)));
						}
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected </" + parent.nodeName + ">",str,p));
					}
					state = 0;
					next = 12;
					continue;
				}
				break;
			case 11:
				if(c == 62) {
					state = 1;
				} else {
					throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected >",str,p));
				}
				break;
			case 12:
				if(c == 62) {
					if(nsubs == 0) {
						parent.addChild(Xml.createPCData(""));
					}
					return p;
				} else {
					throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Expected >",str,p));
				}
				break;
			case 13:
				if(c == 60) {
					let len = p - start;
					buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
					let child = Xml.createPCData(buf.b);
					buf = new StringBuf();
					parent.addChild(child);
					++nsubs;
					state = 0;
					next = 2;
				} else if(c == 38) {
					let len = p - start;
					buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
					state = 18;
					escapeNext = 13;
					start = p + 1;
				}
				break;
			case 14:
				if(c == 63 && str.charCodeAt(p + 1) == 62) {
					++p;
					let str1 = HxOverrides.substr(str,start + 1,p - start - 2);
					parent.addChild(Xml.createProcessingInstruction(str1));
					++nsubs;
					state = 1;
				}
				break;
			case 15:
				if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
					parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
					++nsubs;
					p += 2;
					state = 1;
				}
				break;
			case 16:
				if(c == 91) {
					++nbrackets;
				} else if(c == 93) {
					--nbrackets;
				} else if(c == 62 && nbrackets == 0) {
					parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
					++nsubs;
					state = 1;
				}
				break;
			case 17:
				if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
					let child = Xml.createCData(HxOverrides.substr(str,start,p - start));
					parent.addChild(child);
					++nsubs;
					p += 2;
					state = 1;
				}
				break;
			case 18:
				if(c == 59) {
					let s = HxOverrides.substr(str,start,p - start);
					if(s.charCodeAt(0) == 35) {
						let c = s.charCodeAt(1) == 120 ? Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)) : Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
						buf.b += String.fromCodePoint(c);
					} else if(!Object.prototype.hasOwnProperty.call(haxe_xml_Parser.escapes.h,s)) {
						if(strict) {
							throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Undefined entity: " + s,str,p));
						}
						buf.b += Std.string("&" + s + ";");
					} else {
						buf.b += Std.string(haxe_xml_Parser.escapes.h[s]);
					}
					start = p + 1;
					state = escapeNext;
				} else if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45) && c != 35) {
					if(strict) {
						throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Invalid character in entity: " + String.fromCodePoint(c),str,p));
					}
					buf.b += String.fromCodePoint(38);
					let len = p - start;
					buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
					--p;
					start = p + 1;
					state = escapeNext;
				}
				break;
			}
			++p;
		}
		if(state == 1) {
			start = p;
			state = 13;
		}
		if(state == 13) {
			if(parent.nodeType == 0) {
				if(parent.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (parent.nodeType == null ? "null" : XmlType.toString(parent.nodeType)));
				}
				throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Unclosed node <" + parent.nodeName + ">",str,p));
			}
			if(p != start || nsubs == 0) {
				let len = p - start;
				buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
				parent.addChild(Xml.createPCData(buf.b));
				++nsubs;
			}
			return p;
		}
		if(!strict && state == 18 && escapeNext == 13) {
			buf.b += String.fromCodePoint(38);
			let len = p - start;
			buf.b += len == null ? HxOverrides.substr(str,start,null) : HxOverrides.substr(str,start,len);
			parent.addChild(Xml.createPCData(buf.b));
			++nsubs;
			return p;
		}
		throw haxe_Exception.thrown(new haxe_xml_XmlParserException("Unexpected end",str,p));
	}
	static isValidChar(c) {
		if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95)) {
			return c == 45;
		} else {
			return true;
		}
	}
}
$hxClasses["haxe.xml.Parser"] = haxe_xml_Parser;
haxe_xml_Parser.__name__ = "haxe.xml.Parser";
class haxe_xml_Printer {
	constructor(pretty) {
		this.output = new StringBuf();
		this.pretty = pretty;
	}
	writeNode(value,tabs) {
		switch(value.nodeType) {
		case 0:
			this.output.b += Std.string(tabs + "<");
			if(value.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element but found " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			this.output.b += Std.string(value.nodeName);
			let attribute = value.attributes();
			while(attribute.hasNext()) {
				let attribute1 = attribute.next();
				this.output.b += Std.string(" " + attribute1 + "=\"");
				let input = StringTools.htmlEscape(value.get(attribute1),true);
				this.output.b += Std.string(input);
				this.output.b += "\"";
			}
			if(this.hasChildren(value)) {
				this.output.b += ">";
				if(this.pretty) {
					this.output.b += "\n";
				}
				if(value.nodeType != Xml.Document && value.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
				}
				let _g_current = 0;
				let _g_array = value.children;
				while(_g_current < _g_array.length) {
					let child = _g_array[_g_current++];
					this.writeNode(child,this.pretty ? tabs + "\t" : tabs);
				}
				this.output.b += Std.string(tabs + "</");
				if(value.nodeType != Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, expected Element but found " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
				}
				this.output.b += Std.string(value.nodeName);
				this.output.b += ">";
				if(this.pretty) {
					this.output.b += "\n";
				}
			} else {
				this.output.b += "/>";
				if(this.pretty) {
					this.output.b += "\n";
				}
			}
			break;
		case 1:
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, unexpected " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			let nodeValue = value.nodeValue;
			if(nodeValue.length != 0) {
				let input = tabs + StringTools.htmlEscape(nodeValue);
				this.output.b += Std.string(input);
				if(this.pretty) {
					this.output.b += "\n";
				}
			}
			break;
		case 2:
			this.output.b += Std.string(tabs + "<![CDATA[");
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, unexpected " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			this.output.b += Std.string(value.nodeValue);
			this.output.b += "]]>";
			if(this.pretty) {
				this.output.b += "\n";
			}
			break;
		case 3:
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, unexpected " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			let commentContent = value.nodeValue;
			let _this_r = new RegExp("[\n\r\t]+","g".split("u").join(""));
			commentContent = commentContent.replace(_this_r,"");
			commentContent = "<!--" + commentContent + "-->";
			this.output.b += tabs == null ? "null" : "" + tabs;
			let input = StringTools.trim(commentContent);
			this.output.b += Std.string(input);
			if(this.pretty) {
				this.output.b += "\n";
			}
			break;
		case 4:
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, unexpected " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			this.output.b += Std.string("<!DOCTYPE " + value.nodeValue + ">");
			if(this.pretty) {
				this.output.b += "\n";
			}
			break;
		case 5:
			if(value.nodeType == Xml.Document || value.nodeType == Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, unexpected " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			this.output.b += Std.string("<?" + value.nodeValue + "?>");
			if(this.pretty) {
				this.output.b += "\n";
			}
			break;
		case 6:
			if(value.nodeType != Xml.Document && value.nodeType != Xml.Element) {
				throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
			}
			let _g_current = 0;
			let _g_array = value.children;
			while(_g_current < _g_array.length) {
				let child = _g_array[_g_current++];
				this.writeNode(child,tabs);
			}
			break;
		}
	}
	write(input) {
		this.output.b += input == null ? "null" : "" + input;
	}
	newline() {
		if(this.pretty) {
			this.output.b += "\n";
		}
	}
	hasChildren(value) {
		if(value.nodeType != Xml.Document && value.nodeType != Xml.Element) {
			throw haxe_Exception.thrown("Bad node type, expected Element or Document but found " + (value.nodeType == null ? "null" : XmlType.toString(value.nodeType)));
		}
		let _g_current = 0;
		let _g_array = value.children;
		while(_g_current < _g_array.length) {
			let child = _g_array[_g_current++];
			switch(child.nodeType) {
			case 0:case 1:
				return true;
			case 2:case 3:
				if(child.nodeType == Xml.Document || child.nodeType == Xml.Element) {
					throw haxe_Exception.thrown("Bad node type, unexpected " + (child.nodeType == null ? "null" : XmlType.toString(child.nodeType)));
				}
				if(StringTools.ltrim(child.nodeValue).length != 0) {
					return true;
				}
				break;
			default:
			}
		}
		return false;
	}
	static print(xml,pretty) {
		if(pretty == null) {
			pretty = false;
		}
		let printer = new haxe_xml_Printer(pretty);
		printer.writeNode(xml,"");
		return printer.output.b;
	}
}
$hxClasses["haxe.xml.Printer"] = haxe_xml_Printer;
haxe_xml_Printer.__name__ = "haxe.xml.Printer";
Object.assign(haxe_xml_Printer.prototype, {
	__class__: haxe_xml_Printer
	,output: null
	,pretty: null
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
XmlType.Element = 0;
XmlType.PCData = 1;
XmlType.CData = 2;
XmlType.Comment = 3;
XmlType.DocType = 4;
XmlType.ProcessingInstruction = 5;
XmlType.Document = 6;
Xml.Element = 0;
Xml.PCData = 1;
Xml.CData = 2;
Xml.Comment = 3;
Xml.DocType = 4;
Xml.ProcessingInstruction = 5;
Xml.Document = 6;
haxe_xml_Parser.escapes = (function($this) {
	var $r;
	let h = new haxe_ds_StringMap();
	h.h["lt"] = "<";
	h.h["gt"] = ">";
	h.h["amp"] = "&";
	h.h["quot"] = "\"";
	h.h["apos"] = "'";
	$r = h;
	return $r;
}(this));
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);