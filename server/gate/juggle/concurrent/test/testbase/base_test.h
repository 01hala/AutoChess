/*
 * base_test.h
 *  Created on: 2013-8-17
 *	    Author: qianqians
 * base_test: lock-free que ��׼��������
 */
#ifndef _BASE_TEST_H
#define _BASE_TEST_H

#include <atomic>
#include <ctime>
#include <iostream>
#include <thread>

#include <msque.h>

struct test{
	int thid;
	int num;
};

template<class que = concurrent::msque<test> >
class base_test{
private:
	que _que;
	std::atomic_int count;
	bool bpopend;
	test back[4];

	struct data{
		base_test * pthis;
		int thid;
	};


	static void push(void* handle){
		data * _data = (data*)handle;
		int thid = _data->thid;
		base_test * pthis = _data->pthis;
		test t;
		clock_t begin = clock();
		for(int i = 0; i < 100000; i++){
			t.thid = thid;
			t.num = i;
			pthis->_que.push(t);
		}
		pthis->count--;
		std::cout << "push end: " << thid << " time: " << clock() - begin << std::endl;
		_endthread();
	}

	static void pop(void * _pthis){
		base_test * pthis = (base_test * )_pthis;
		test t;
		bool bpop = false;
		clock_t begin = clock();
		while((bpop = pthis->_que.pop(t)) || pthis->count.load() > 0){
			if (bpop){
				if (pthis->back[t.thid].num != t.num){
					abort();
				}
				pthis->back[t.thid].num++;
			}else{
				std::this_thread::yield();
			}
		}
		pthis->bpopend = true;
		std::cout << "pop end time: " << clock() - begin << std::endl;
		_endthread();
	}

public:
	void operator() (int _count_){
		data data[4];
		clock_t begin, runtime;
		for(int i = 0; i < _count_; i++){
			count = 4;
			for(int i = 0; i < 4; i++){
				back[i].thid = i;
				back[i].num = 0;
			}
			bpopend = false;

			std::cout << "_que size: " << _que.size() << std::endl;
			begin = clock();
			for (int i = 0; i < 1; i++){
				_beginthread(pop, 0, this);
			}
			for (int i = 0; i < 4; i++){
				data[i].pthis = this;
				data[i].thid = i;
				_beginthread(push, 0, &data[i]);
			}
			while(!bpopend){
				std::this_thread::yield();
			}
			runtime = clock() - begin;
			std::cout << "test time: " << runtime << std::endl;
		}
	}
	
};

#endif //_BASE_TEST_H