/*
 * string.h
 *		 Created on: 2021-9-18
 *			 Author: qianqians
 * string
 */

#ifndef _STRING_tools_H
#define _STRING_tools_H    
    
#include <stdarg.h>
#include <string>
#include <vector>    

namespace concurrent {

namespace detail {
	
template<typename T, typename _Elem>
inline std::vector<T> split(const T& in, const _Elem token) {
	std::vector<T> vstr;
	size_t off = 0;
	while (true) {
		auto index = in.find(token, off);
		if (index == T::npos) {
			auto str = in.substr(off);
			vstr.push_back(str);
			break;
		}
		else {
			auto str = in.substr(off, index - off);
			vstr.push_back(str);
		}
		off = index + 1;
	}
	return vstr;
}

template<typename T>
inline std::vector<T> split(const T& in, const T& token) {
	std::vector<T> vstr;
	size_t off = 0;
	while (true) {
		auto index = in.find(token, off);
		if (index == T::npos) {
			auto str = in.substr(off);
			vstr.push_back(str);
			break;
		}
		else {
			auto str = in.substr(off, index - off);
			vstr.push_back(str);
		}
		off = index + token.size();
	}
	return vstr;
}

template<typename T, typename _Elem>
inline T join(const std::vector<T>& in, const _Elem token) {
	T t;
	auto iter = in.begin();
	t.append(*iter);
	++iter;
	for (; iter != in.end(); ++iter) {
		t.push_back(token);
		t.append(*iter);
	}
	return t;
}

template<typename T>
inline T join(const std::vector<T>& in, const T token) {
	T t;
	auto iter = in.begin();
	t.append(*iter);
	++iter;
	for (; iter != in.end(); ++iter) {
		t.append(token);
		t.append(*iter);
	}
	return t;
}

}

inline std::vector<std::string> split(const std::string& in, const std::string& token) {
	return detail::split(in, token);
}

inline std::vector<std::string> split(const std::string& in, const char token) {
	return detail::split(in, token);
}

inline std::vector<std::wstring> split(const std::wstring& in, const std::wstring& token) {
	return detail::split(in, token);
}

inline std::vector<std::wstring> split(const std::wstring& in, const wchar_t token) {
	return detail::split(in, token);
}

inline std::vector<std::u8string> split(const std::u8string& in, const std::u8string& token) {
	return detail::split(in, token);
}

inline std::vector<std::u8string> split(const std::u8string& in, const char8_t token) {
	return detail::split(in, token);
}

inline std::vector<std::u16string> split(const std::u16string& in, const std::u16string& token) {
	return detail::split(in, token);
}

inline std::vector<std::u16string> split(const std::u16string& in, const char16_t token) {
	return detail::split(in, token);
}

inline std::vector<std::u32string> split(const std::u32string& in, const std::u32string& token) {
	return detail::split(in, token);
}

inline std::vector<std::u32string> split(const std::u32string& in, const char32_t token) {
	return detail::split(in, token);
}

inline std::string join(const std::vector<std::string>& in, const std::string& token) {
	return detail::join(in, token);
}

inline std::string join(const std::vector<std::string>& in, const char token) {
	return detail::join(in, token);
}

inline std::wstring join(const std::vector<std::wstring>& in, const std::wstring& token) {
	return detail::join(in, token);
}

inline std::wstring join(const std::vector<std::wstring>& in, const wchar_t token) {
	return detail::join(in, token);
}

inline std::u8string join(const std::vector<std::u8string>& in, const std::u8string& token) {
	return detail::join(in, token);
}

inline std::u8string join(const std::vector<std::u8string>& in, const char8_t token) {
	return detail::join(in, token);
}

inline std::u16string join(const std::vector<std::u16string>& in, const std::u16string& token) {
	return detail::join(in, token);
}

inline std::u16string join(const std::vector<std::u16string>& in, const char16_t token) {
	return detail::join(in, token);
}

inline std::u32string join(const std::vector<std::u32string>& in, const std::u32string& token) {
	return detail::join(in, token);
}

inline std::u32string join(const std::vector<std::u32string>& in, const char32_t token) {
	return detail::join(in, token);
}

}

#endif //_STRING_tools_H