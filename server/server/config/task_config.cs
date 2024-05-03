using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class TaskConfig
    {
        public int Id;
        public string Name;
        public int Type;
        public int Value;
        public int Round;

        public static Dictionary<int, BufferConfig> Load(string path)
        {
            var obj = new Dictionary<int, BufferConfig>();

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
                var bufferc = new BufferConfig();
                bufferc.Id = (int)o["Id"];
                bufferc.Name = (string)o["Name"];
                bufferc.Type = (int)o["Type"];
                bufferc.Value = (int)o["Value"];
                bufferc.Round = (int)o["Round"];

                obj[bufferc.Id] = bufferc;
            }

            return obj;
        }
    }
}