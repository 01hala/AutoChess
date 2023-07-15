/*
 * thread_grouptest.cpp
 *  Created on: 2021-7-30
 *	    Author: qianqians
 * thread_group test
 */
#include <thread>
#include <iostream>
#include <vector>

#include <thread_group.h>

int main(){
	std::mutex _l_th_mu;
	concurrent::thread_group th_group;

	for (auto i = 0; i < 100; i++) {
		th_group.create_thread([&_l_th_mu]() {
			std::lock_guard<std::mutex> l(_l_th_mu);
			std::cout << std::this_thread::get_id() << std::endl;
		});
	}

	th_group.join_all();

	char n;
	std::cin >> n;

	return 1;
}