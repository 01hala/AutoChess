using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class ShopSkillConfig
    {
        public int Id;
        public string Name;
        public string Type;
        public Priority Priority;
        public EMShopEvent EffectTime;
        public Abelkhan.ShopSkillEffectEM Effect;
        public int ObjCount;
        public Direction ObjectDirection;
        public EffectScope EffectScope;
        public int Level1Value_1;
        public int Level1Value_2;
        public int Level2Value_1;
        public int Level2Value_2;
        public int Level3Value_1;
        public int Level3Value_2;

        public static Dictionary<int, ShopSkillConfig> Load(string path)
        {
            var obj = new Dictionary<int, ShopSkillConfig>();

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
                var skillc = new ShopSkillConfig();
                skillc.Id = (int)o["Id"];
                skillc.Name = (string)o["Name"];
                skillc.Type = (string)o["Type"];
                skillc.Priority = (Priority)o["Priority"];
                skillc.EffectTime = (EMShopEvent)o["EffectTime"];
                skillc.Effect = (Abelkhan.ShopSkillEffectEM)o["Effect"];
                skillc.ObjCount = (int)o["ObjCount"];
                skillc.ObjectDirection = (Direction)o["ObjDirection"];
                skillc.EffectScope = (EffectScope)o["EffectScope"];
                skillc.Level1Value_1 = (int)o["Level1Value_1"];
                skillc.Level1Value_2 = (int)o["Level1Value_2"];
                skillc.Level2Value_1 = (int)o["Level2Value_1"];
                skillc.Level2Value_2 = (int)o["Level2Value_2"];
                skillc.Level3Value_1 = (int)o["Level3Value_1"];
                skillc.Level3Value_2 = (int)o["Level3Value_2"];

                obj[skillc.Id] = skillc;
            }

            return obj;
        }
    }
}