/*
 * abelkhan type 
 * qianqians
 * 2021/9/19
 */
#include <chrono>
#include <random>
#include <fmt/format.h>

#include <concurrent/string_tools.h>

#include <abelkhan.h>

namespace abelkhan{

inline int64_t msec_time()
{
	auto duration = std::chrono::system_clock::now().time_since_epoch();
	return std::chrono::duration_cast<std::chrono::milliseconds>(duration).count();
}

static std::mt19937_64 e(msec_time());
uint32_t random(){
    return (uint32_t)e();
}

Exception::Exception(std::string _err) : std::exception() {
    err = _err;
}

Icaller::Icaller(std::string _module_name, std::shared_ptr<Ichannel> _ch) {
    module_name = _module_name;
    ch = _ch;

    _data_size = 8 * 1024;
    _data = (unsigned char*)malloc(_data_size);
} 

Icaller::~Icaller() {
    free(_data);
}

void Icaller::call_module_method(std::string _method_name, msgpack11::MsgPack::array& _argv){
    msgpack11::MsgPack::array event_;
    event_.push_back(_method_name);
    event_.push_back(_argv);
    msgpack11::MsgPack _pack(event_);
    auto data = _pack.dump();
    
    size_t len = data.size();
    if (_data_size < (len + 4)) {
        _data_size *= 2;
        free(_data);
        _data = (unsigned char*)malloc(_data_size);
    }
    _data[0] = len & 0xff;
    _data[1] = len >> 8 & 0xff;
    _data[2] = len >> 16 & 0xff;
    _data[3] = len >> 24 & 0xff;
    memcpy(&_data[4], data.c_str(), data.size());
    size_t datasize = len + 4;

    if (ch->is_xor_key_crypt()) {
        ch->normal_crypt((char*)(&(_data[4])), len);
    }
    ch->send((char*)_data, datasize);
}

void Icaller::reset_channel(std::shared_ptr<Ichannel> _ch) {
    ch = _ch;
}

Response::Response(std::string _module_name, std::shared_ptr<Ichannel> _ch) : Icaller(_module_name, _ch) {
}

thread_local std::shared_ptr<Ichannel> Imodule::current_ch;
thread_local std::shared_ptr<Response> Imodule::rsp;

Imodule::Imodule(std::string _module_name) {
    module_name = _module_name;
    current_ch = nullptr;
    rsp = nullptr;
}

modulemng::modulemng(){
}

void modulemng::reg_method(std::string method_name, std::tuple<std::shared_ptr<Imodule>, std::function<void(const msgpack11::MsgPack::array& doc)> > method) {
    method_set.insert(std::make_pair(method_name, method));
}

void modulemng::process_event(std::shared_ptr<Ichannel> _ch, const msgpack11::MsgPack::array& _event) {
    try {
        std::string method_name = _event[0].string_value();
        auto it_module = method_set.find(method_name);
        if (it_module != method_set.end()) {
            std::shared_ptr<Imodule> _module;
            std::function<void(const msgpack11::MsgPack::array& doc)> _method;
            std::tie(_module, _method) = it_module->second;
            Imodule::current_ch = _ch;
            _method(_event[1].array_items());
            Imodule::current_ch = nullptr;
        }
        else {
            throw Exception(fmt::format("do not have a method named:{0}", method_name));
        }
    }
    catch (std::exception e)
    {
        throw Exception(fmt::format("System.Exception:{0}", e.what()));
    }
}

int64_t TinyTimer::tick;
concurrent::ringque<std::pair<uint64_t, std::function<void()> > > TinyTimer::add_timer_list;
std::map<int64_t, std::function<void()> > TinyTimer::timer;
std::vector<int64_t> TinyTimer::remove;

void TinyTimer::add_timer(int64_t _tick, std::function<void()> cb){
    tick = msec_time();
    auto tick_ = _tick + tick;
    add_timer_list.push(std::make_pair(tick_, cb));
}

void TinyTimer::poll(){
    std::pair<uint64_t, std::function<void()> > timer_em;
    while(add_timer_list.pop(timer_em)){
        while(timer.find(timer_em.first) != timer.end()){
            timer_em.first++;
        }
        timer.insert(timer_em);
    }

    tick = msec_time();
	for (auto it = timer.begin(); it != timer.end(); it++)
	{
		if (it->first <= tick)
		{
			it->second();
			remove.push_back(it->first);
		}
		else {
			break;
		}
	}

	for (auto key : remove)
	{
		timer.erase(key);
	}
    remove.clear();
}


}