/*
 * abelkhan type 
 * qianqians
 * 2020/5/21
 */
#ifndef abelkhan_type_h_
#define abelkhan_type_h_

#include <stdarg.h>

#include <exception>
#include <string>
#include <memory>
#include <map>
#include <unordered_map>
#include <functional>
#include <vector>
#include <tuple>

#include <msgpack11.hpp>
#include <ringque.h>

namespace abelkhan{

uint32_t random();

class Exception : public std::exception {
public:
    Exception(std::string _err);

public:
    std::string err;

};

class Ichannel {
public:
    virtual void disconnect() = 0;
    virtual bool is_xor_key_crypt() = 0;
    virtual void normal_crypt(char* data, size_t len) = 0;
    virtual void send(const char* data, size_t len) = 0;
};

class Icaller {
public:
    Icaller(std::string _module_name, std::shared_ptr<Ichannel> _ch);
    virtual ~Icaller();

    void call_module_method(std::string _method_name, msgpack11::MsgPack::array& _argv);

    void reset_channel(std::shared_ptr<Ichannel> _ch);

protected:
    std::string module_name;

private:
    std::shared_ptr<Ichannel> ch;

    size_t _data_size;
    unsigned char* _data;

};

class Response : public Icaller {
public:
    Response(std::string _module_name, std::shared_ptr<Ichannel> _ch);

};

class Imodule
{
public:
    Imodule(std::string _module_name);

public:
    thread_local static std::shared_ptr<Ichannel> current_ch;
    thread_local static std::shared_ptr<Response> rsp;
    std::string module_name;
        
};

class modulemng
{
public:
    modulemng();

    void reg_method(std::string method_name, std::tuple<std::shared_ptr<Imodule>, std::function<void(const msgpack11::MsgPack::array& doc)> > method);
    void process_event(std::shared_ptr<Ichannel> _ch, const msgpack11::MsgPack::array& _event);

private:
    std::unordered_map<std::string, std::tuple<std::shared_ptr<Imodule>, std::function<void(const msgpack11::MsgPack::array& doc)> > > method_set;

};

class TinyTimer{
private:
    static int64_t tick;
    static concurrent::ringque<std::pair<uint64_t, std::function<void()> > > add_timer_list;
    static std::map<int64_t, std::function<void()> > timer;
    static std::vector<int64_t> remove;

public:
    static void add_timer(int64_t tick, std::function<void()> cb);
    static void poll();
};

}

#endif //abelkhan_type_h_