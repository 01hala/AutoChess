/*
 * thread_grouptest.cpp
 *  Created on: 2021-7-30
 *	    Author: qianqians
 * thread_group test
 */
#include <iostream>

#include <string_tools.h>

int main(){
	auto test = ",1,2,3";
	auto v_str_split = concurrent::split(test, ",");
	auto v_str_split1 = concurrent::split(test, ',');
	std::cout << concurrent::join(v_str_split, ",") << std::endl;
	std::cout << concurrent::join(v_str_split1, ',') << std::endl;

	auto wtest = L",1,2,3,";
	auto v_wstr_split = concurrent::split(wtest, L",");
	auto v_wstr_split1 = concurrent::split(wtest, L',');
	std::wcout << concurrent::join(v_wstr_split, L",") << std::endl;
	std::wcout << concurrent::join(v_wstr_split1, L',') << std::endl;

	auto u8test = u8",1,2,3,";
	auto v_u8str_split = concurrent::split(u8test, u8",");
	auto v_u8str_split1 = concurrent::split(u8test, u8',');
	auto u8test_restore = concurrent::join(v_u8str_split, u8",");
	auto u8test_restore1 = concurrent::join(v_u8str_split1, u8",");

	auto u16test = u",1,2,3,";
	auto v_u16str_split = concurrent::split(u16test, u",");
	auto v_u16str_split1 = concurrent::split(u16test, u',');
	auto u16test_restore = concurrent::join(v_u16str_split, u",");
	auto u16test_restore1 = concurrent::join(v_u16str_split1, u",");

	auto u32test = U",1,2,3,";
	auto v_u32str_split = concurrent::split(u32test, U",");
	auto v_u32str_split1 = concurrent::split(u32test, U',');
	auto u32test_restore = concurrent::join(v_u32str_split, U",");
	auto u32test_restore1 = concurrent::join(v_u32str_split1, U",");

	return 1;
}