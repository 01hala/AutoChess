/*
 * optimisticque.h
 * Created on: 2013-5-6
 *	   Author: qianqians
 * optimisticque:lock-free deque
 */
#ifndef _optimisticque_H
#define _optimisticque_H

#include <atomic>

#include "./detail/_hazard_ptr.h"

namespace concurrent{

template<class T, class _Allocator = std::allocator<T> >
class optimisticque{
private:
	struct node{
		node() : next(0), prev(0){}
		node(const T & _data) : data(_data), next(0), prev(0){}
		virtual ~node(){}

		T data;
		std::atomic<node *> next, prev;
	};

	struct list{
		std::atomic<node *> head;
		std::atomic<node *> detail;
		std::atomic_uint32_t size;
	};

	using _Alloc_node = typename std::allocator_traits<_Allocator>::template rebind_alloc<node>;
	using _Alloc_list = typename std::allocator_traits<_Allocator>::template rebind_alloc<list>;

public:
	optimisticque() : _hsys(std::bind(&optimisticque::put_node, this, std::placeholders::_1)), _hsys_list(std::bind(&optimisticque::put_list, this, std::placeholders::_1)) {
		_list.store(get_list());
	}

	virtual ~optimisticque(){
		put_list(_list.load());
	}

	/*
	 * que is empty
	 */
	bool empty(){
		return (size() == 0);
	}

	/*
	 * get que size
	 */
	size_t size(){
		return _list.load()->size.load();
	}

	/*
	 * clear this que
	 */
	void clear(){
		detail::_hazard_ptr<list> * _plist = _hsys_list.acquire();
		list * _tmplist = get_list();
		_plist->_hazard = _list.exchange(_tmplist);
		_hsys_list.retire(_plist->_hazard);
		_hsys_list.release(_plist);
	}

	/*
	 * push a element to que
	 */
	void push(const T & data){
		node * _new = get_node(data);

		detail::_hazard_ptr<list> * _plist;
		_hsys_list.acquire(&_plist, 1);
		detail::_hazard_ptr<node> * _ptr_detail;
		_hsys.acquire(&_ptr_detail, 1);
		while(1){
			_plist->_hazard = _list.load();
			_ptr_detail->_hazard = _plist->_hazard ->detail.load();

			_new->prev = _ptr_detail->_hazard;

			if (_plist->_hazard ->detail.compare_exchange_weak(_ptr_detail->_hazard, _new)){
				_ptr_detail->_hazard->next.store(_new);
				_plist->_hazard ->size++;
				break;
			}
			_mm_pause();
		}

		_hsys.release(_ptr_detail);
		_hsys_list.release(_plist);
	}

	/*
	 * pop a element form que if empty return false 
	 */
	bool pop(T & data){
		bool ret = true;
		
		detail::_hazard_ptr<list> * _plist;
		_hsys_list.acquire(&_plist, 1);
		detail::_hazard_ptr<node> * _ptr_node[2];
		_hsys.acquire(_ptr_node, 2);
		while(1){
			_plist->_hazard = _list.load();

			_ptr_node[0]->_hazard = _plist->_hazard->head.load();
			if (_ptr_node[0]->_hazard == _plist->_hazard->detail.load()){
				ret = false;
				break;
			}

			_ptr_node[1]->_hazard = _ptr_node[0]->_hazard->next.load();
			if (_ptr_node[1]->_hazard == 0){
				node * nodenext;
				detail::_hazard_ptr<node> * _ptr_detail;
				_hsys.acquire(&_ptr_detail, 1);
				_ptr_detail->_hazard = _plist->_hazard->detail.load();
				while((_ptr_node[0]->_hazard == _plist->_hazard->head.load()) && (_ptr_detail->_hazard != _ptr_node[0]->_hazard)){
					nodenext = _ptr_detail->_hazard->prev.load();
					nodenext->next.store(_ptr_detail->_hazard);
					_ptr_detail->_hazard = nodenext;
				}
				_hsys.release(_ptr_detail);
				_ptr_node[1]->_hazard = _ptr_node[0]->_hazard->next.load();
			}

			if (_plist->_hazard->head.compare_exchange_weak(_ptr_node[0]->_hazard, _ptr_node[1]->_hazard)){
				data = _ptr_node[1]->_hazard->data;
				_hsys.retire(_ptr_node[0]->_hazard);
				_plist->_hazard->size--;
				break;
			}
			_mm_pause();
		}

		_hsys.release(_ptr_node[0]);
		_hsys.release(_ptr_node[1]);

		_hsys_list.release(_plist);

		return ret;
	}

private:
	node * get_node(){
		node * _node = _alloc_node.allocate(1);
		new (_node) node();
		return _node;
	}

	node * get_node(const T & data){
		node * _node = _alloc_node.allocate(1);
		new (_node) node(data);
		return _node;
	}

	void put_node(node * _node){
		_node->~node();
		_alloc_node.deallocate(_node, 1);
	}

	list * get_list(){
		list * _list = _alloc_list.allocate(1);
		while(_list == 0){_list = _alloc_list.allocate(1);};
		::new (_list) list();

		_list->size.store(0);

		node * _node = get_node();
		_list->detail = _node;
		_list->head = _node;

		return _list;
	}

	void put_list(list * _list){
		node * _next = _list->detail.load();
		do{
			node * _tmpnext = _next;
			_next = _tmpnext->next.load();
			put_node(_tmpnext);
		}while(_next != 0);

		_list->~list();
		_alloc_list.deallocate(_list, 1);
	}

private:
	std::atomic<list *> _list;

	_Alloc_node _alloc_node;
	_Alloc_list _alloc_list;

	detail::_hazard_system<node> _hsys;
	detail::_hazard_system<list> _hsys_list;

};

}// concurrent

#endif //_optimisticque_H