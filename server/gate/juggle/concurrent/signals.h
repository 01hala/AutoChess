/*
 * signals.h
 * qianqians
 * 2018-6-29
 */
#ifndef _signals_h_
#define _signals_h_

#include <atomic>
#include <mutex>
#include <map>
#include <functional>

namespace concurrent {

template<class R>
struct signals_base;

template<typename... Args>
struct signals_base<void(Args...)>
{
public:
	signals_base() : current_id_(0) {}

	std::uint32_t connect(std::function<void(Args...)> slot)
	{
		std::lock_guard<std::mutex> l(slots_mutex_);
		auto tmp_id = ++current_id_;
		slots_.insert(std::make_pair(tmp_id, slot));
		return tmp_id;
	}

	void disconnect(std::uint32_t id)
	{
		std::lock_guard<std::mutex> l(slots_mutex_);
		slots_.erase(id);
	}

	bool empty(){
		return slots_.empty();
	}

	void emit(Args... p)
	{
		std::lock_guard<std::mutex> l(slots_mutex_);
		for (auto it : slots_)
		{
			it.second(p...);
		}
	}

private:
	signals_base(signals_base const& other) = delete;
	signals_base& operator=(signals_base const& other) = delete;

private:
	std::mutex slots_mutex_;
	std::map<std::uint32_t, std::function<void(Args...)> > slots_;
	std::atomic_uint32_t current_id_;

};

template<typename Rt, typename... Args>
struct signals_base<Rt(Args...)>
{
public:
	signals_base() : current_id_(0) {}

	std::uint32_t connect(std::function<Rt(Args...)> slot)
	{
		std::lock_guard<std::mutex> l(slots_mutex_);
		auto tmp_id = ++current_id_;
		slots_.insert(std::make_pair(tmp_id, slot));
		return tmp_id;
	}

	void disconnect(std::uint32_t id)
	{
		std::lock_guard<std::mutex> l(slots_mutex_);
		slots_.erase(id);
	}

	bool empty(){
		return slots_.empty();
	}

	Rt emit(Args... p)
	{
		Rt ret;

		std::lock_guard<std::mutex> l(slots_mutex_);
		auto iter = slots_.begin();
		ret = (iter++)->second(p...);
		for ( ; iter != slots_.end(); ++iter)
		{
			iter->second(p...);
		}

		return ret;
	}

private:
	signals_base(signals_base const& other) = delete;
	signals_base& operator=(signals_base const& other) = delete;

private:
	std::mutex slots_mutex_;
	std::map<std::uint32_t, std::function<Rt(Args...)> > slots_;
	std::atomic_uint32_t current_id_;

};

template <typename Fty>
class signals : public signals_base<Fty>
{
public:
	signals() : signals_base<Fty>() {}

private:
	signals(signals const& other) = delete;
	signals& operator=(signals const& other) = delete;

};

}

#endif // !_signals_h_
