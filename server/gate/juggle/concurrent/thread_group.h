/*
 * thread_group.h
 *		 Created on: 2021-7-30
 *			 Author: qianqians
 * thread_group
 */

#ifndef _THREAD_GROUP_H
#define _THREAD_GROUP_H

#include <memory>
#include <vector>
#include <thread>
#include <functional>
#include <mutex>

namespace concurrent {

class thread_group {
private:
	std::mutex _l_th_mu;
	std::vector<std::shared_ptr<std::jthread> > _th_group;

public:
	thread_group() {}
	virtual ~thread_group() {
		_th_group.clear();
	}

	std::shared_ptr<std::jthread> create_thread(std::function<void()> fn) {
		auto th = std::make_shared<std::jthread>(fn);

		std::lock_guard<std::mutex> l(_l_th_mu);
		_th_group.emplace_back(th);

		return th;
	}

	void join_all() {
		std::lock_guard<std::mutex> l(_l_th_mu);
		for (auto th : _th_group) {
			th->join();
		}
		_th_group.clear();
	}

	size_t size() {
		return _th_group.size();
	}

};

} /* concurrent */
#endif //_THREAD_GROUP_H