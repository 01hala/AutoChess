using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Newtonsoft.Json.Linq;

namespace config
{
    public class TaskConfig
    {
        public int ID;
        public string Name;
        public string Class;
        public string Lable;
        public string Condition;
        public int RewardGold;

        public static Dictionary<string, TaskConfig> Load(string path)
        {
            var obj = new Dictionary<string, TaskConfig>();

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

            var handle = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(System.Text.Encoding.Default.GetString(data));
            foreach (var o in handle.Values)
            {
                var taskc = new TaskConfig();
                taskc.ID = (int)o["ID"];
                taskc.Name = (string)o["Name"];
                taskc.Class = (string)o["Class"];
                taskc.Lable = (string)o["Lable"];
                taskc.Condition = (string)o["Condition"];

                var reward = (string)o["Reward"];
                var rewardList = JArray.Parse(reward);
                for (var index = 0; index < rewardList.Count;)
                {
                    var r = rewardList[index++];
                    if (r.Value<string>() == "Gold")
                    {
                        var gold = rewardList[index++];
                        taskc.RewardGold = gold.Value<int>();
                        break;
                    }
                }

                obj[taskc.Class] = taskc;
            }

            return obj;
        }
    }
}