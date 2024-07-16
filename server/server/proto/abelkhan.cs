using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using MsgPack.Serialization;
using System.Threading;
using Microsoft.IO;

namespace Abelkhan
{
    public class Exception : System.Exception
    {
        public Exception(string _err) : base(_err)
        {
        }
    }

    public class RandomUUID
    {
        private static readonly Random ran = new Random();
        public static uint random()
        {
            return (uint)(ran.NextDouble() * Int32.MaxValue);
        }
    }

    public class TinyTimer
    {
        private static ulong tick;
        private static readonly List<KeyValuePair<ulong, Action> > add_timer_list = new List<KeyValuePair<ulong, Action>>();
        private static readonly Dictionary<ulong, Action> timer = new Dictionary<ulong, Action>();

        private static ulong refresh()
        {
            return (ulong)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds;
        }

        public static void add_timer(ulong _tick, Action cb)
        {
            lock (add_timer_list)
            {
                tick = refresh();
                var tick_ = tick + _tick;
                add_timer_list.Add(KeyValuePair.Create(tick_, cb));
            }
        }
        public static void poll()
        {
            tick = refresh();

            lock (timer)
            {
                lock (add_timer_list)
                {
                    foreach (var (tick_, cb) in add_timer_list)
                    {
                        var _tick = tick_;
                        while (timer.ContainsKey(_tick)) { _tick++; }
                        timer.Add(_tick, cb);
                    }
                    add_timer_list.Clear();
                }

                var list = new List<ulong>();
                foreach (var item in timer)
				{
					if (item.Key <= tick)
					{
						list.Add(item.Key);
                        item.Value();
					}
                    else
                    {
                        break;
                    }
				}
                foreach (var item in list)
				{
					timer.Remove(item);
				}
            }
        }
    }

    public class MemoryStreamPool
    {
        public static RecyclableMemoryStreamManager mstMgr = new RecyclableMemoryStreamManager();
    }

    public interface Ichannel
    {
        void disconnect();
        bool is_xor_key_crypt();
        void normal_send_crypt(byte[] data);
        void send(byte[] data);
    }

    public class Icaller
    {
        public Icaller(string _module_name, Ichannel _ch)
        {
            module_name = _module_name;
            ch = _ch;

            serializer = MessagePackSerializer.Get<List<MsgPack.MessagePackObject>>();
        }

        public void reset_ch(Ichannel _ch)
        {
            ch = _ch;
        }

        public void call_module_method(string methodname, List<MsgPack.MessagePackObject> argvs)
        {
            var _event = new List<MsgPack.MessagePackObject>
            {
                methodname,
                MsgPack.MessagePackObject.FromObject(argvs)
            };

            try
            {
                using MemoryStream stream = MemoryStreamPool.mstMgr.GetStream(), send_st = MemoryStreamPool.mstMgr.GetStream();
                serializer.Pack(stream, _event);
                stream.Position = 0;
                var data = stream.ToArray();

                var _tmplenght = data.Length;
                send_st.WriteByte((byte)(_tmplenght & 0xff));
                send_st.WriteByte((byte)((_tmplenght >> 8) & 0xff));
                send_st.WriteByte((byte)((_tmplenght >> 16) & 0xff));
                send_st.WriteByte((byte)((_tmplenght >> 24) & 0xff));
                send_st.Write(data, 0, _tmplenght);
                send_st.Position = 0;
                var buf = send_st.ToArray();

                if (ch.is_xor_key_crypt())
                {
                    ch.normal_send_crypt(buf);
                }

                ch.send(buf);
            }
            catch (System.Exception ex)
            {
                throw new Abelkhan.Exception(string.Format("error argvs:{0}", ex));
            }
        }

        private Ichannel ch;
        protected readonly String module_name;
        private readonly MessagePackSerializer<List<MsgPack.MessagePackObject>> serializer;
    }

    public class Response : Icaller{
        public Response(String _module_name, Ichannel _ch) : base(_module_name, _ch){ 
        }
    }

    public class Imodule
    {
        protected Dictionary<string, Action<IList<MsgPack.MessagePackObject> > > events;

        public Imodule(string _module_name){
            module_name = _module_name;
            events = new Dictionary<string, Action<IList<MsgPack.MessagePackObject> > >();
            current_ch = new ThreadLocal<Ichannel>();
            rsp = new ThreadLocal<Response>(); ;
        }

		public ThreadLocal<Ichannel> current_ch;
        public ThreadLocal<Response> rsp;
		public string module_name;
    }

    public class modulemng
    {
		public modulemng()
		{
			method_set = new Dictionary<string, Tuple<Imodule, Action<IList<MsgPack.MessagePackObject> > > >();
		}

        public void reg_method(String method_name, Tuple<Imodule, Action<IList<MsgPack.MessagePackObject> > > method){
            method_set.Add(method_name, method);
        }

        public Action<Abelkhan.Ichannel> on_msg;
        public void process_event(Ichannel _ch, ArrayList _event){
            try{
                String method_name = ((MsgPack.MessagePackObject)_event[0]).AsString();
                if (method_set.TryGetValue(method_name, out Tuple<Imodule, Action<IList<MsgPack.MessagePackObject> > > _method))
                {
                    _method.Item1.current_ch.Value = _ch;
                    _method.Item2.Invoke(((MsgPack.MessagePackObject)_event[1]).AsList());
                    on_msg?.Invoke(_ch);
                    _method.Item1.current_ch.Value = null;
                }
                else
                {
                    throw new Abelkhan.Exception(string.Format("do not have a method named::{0}", method_name));
                }
            }
            catch (System.Exception e)
            {
                throw new Abelkhan.Exception(string.Format("System.Exception:{0}", e));
            }
        }

        private readonly Dictionary<string, Tuple<Imodule, Action<IList<MsgPack.MessagePackObject> > > > method_set;
    }
}