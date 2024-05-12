using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Newtonsoft.Json.Linq;

namespace config
{
    public class RankRewardConfig
    {
        public int Rank;
        public Dictionary<string, int> Reward;

        public static Dictionary<int, RankRewardConfig> Load(string path)
        {
            var obj = new Dictionary<int, RankRewardConfig>();

            FileStream fs = File.OpenRead(path);
            byte[] data = new byte[fs.Length];
            int offset = 0;
            int remaining = data.Length;
            while (remaining > 0)
            {
                int read = fs.Read(data, offset, remaining);
                if (read <= 0)
                    throw new EndOfStreamException("file read at" + read.ToString() + " failed");

                remaining -= read;
                offset += read;
            }

            var handle = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<int, dynamic>>(System.Text.Encoding.Default.GetString(data));
            foreach (var o in handle.Values)
            {
                var rankc = new RankRewardConfig();
                rankc.Rank = (int)o["Rank"];
                rankc.Reward = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, int>>((string)o["Reward"]);

                obj[rankc.Rank] = rankc;
            }

            return obj;
        }
    }
}