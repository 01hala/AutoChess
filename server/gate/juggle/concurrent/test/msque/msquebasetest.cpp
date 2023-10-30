/*
 * msquebasetest.cpp
 *  Created on: 2013-8-17
 *	    Author: qianqians
 * msque test
 */
#include <msque.h>
#include <base_test.h>

int main(){
	base_test<concurrent::msque<test> > test;
	test(100);

	char n;
	std::cin >> n;

	return 1;
}