using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class EquipConfig
    {
        public int Id;
        public string Name;
        public int Price;
        public int Type;
        public int Effect;
        public int Value;

        public static Dictionary<int, EquipConfig> Load(string path)
        {
            var obj = new Dictionary<int, EquipConfig>();

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
                var equipc = new EquipConfig();
                equipc.Id = (int)o["Id"];
                equipc.Name = (string)o["Name"];
                equipc.Price = (int)o["Price"];
                equipc.Type = (int)o["Type"];
                equipc.Effect = (int)o["Effect"];
                equipc.Value = (int)o["Value"];

                obj[equipc.Id] = equipc;
            }

            return obj;
        }
    }
}