using System;
using System.Threading;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace gate_svr
{
    class Program
    {
		static void Main(string[] args)
		{
            var _gate = new Gate.GateService(args[0], args[1]);

            Log.Log.trace("gate_svr start ok");

            _gate.run().Wait();
        }
	}
}
