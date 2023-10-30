/*
 * swapquebasetest.cpp
 *  Created on: 2013-8-17
 *	    Author: qianqians
 * swapque test
 */
#include <swapque.h>
#include <base_test.h>

int main(){
	base_test<concurrent::swapque<test> > test;
	test(100);

	char n;
	std::cin >> n;

	return 1;
}