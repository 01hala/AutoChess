using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace config
{
    public class SkillConfig
    {
        public int Id;
        public string Name;
        public string Type;
        public string Priority;
        public int EffectTime;
        public int Effect;
        public int ObjCount;
        public int ObjectDirection;
        public int Level1Value_1;
        public int Level1Value_2;
        public int Level2Value_1;
        public int Level2Value_2;
        public int Level3Value_1;
        public int Level3Value_2;
        public string SummonId;
        public int SummonLevel;
        public int ChangePositionType;
        public int SwapPropertiesType;
        public int AddBufferID;

        public static Dictionary<int, SkillConfig> Load(string path)
        {
            var obj = new Dictionary<int, SkillConfig>();

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
                var skillc = new SkillConfig();
                skillc.Id = (int)o["Id"];
                skillc.Name = (string)o["Name"];
                skillc.Type = (string)o["Type"];
                skillc.Priority = (string)o["Priority"];
                skillc.EffectTime = (int)o["EffectTime"];
                skillc.Effect = (int)o["Effect"];
                skillc.ObjCount = (int)o["ObjCount"];
                skillc.ObjectDirection = (int)o["ObjectDirection"];
                skillc.Level1Value_1 = (int)o["Level1Value_1"];
                skillc.Level1Value_2 = (int)o["Level1Value_2"];
                skillc.Level2Value_1 = (int)o["Level2Value_1"];
                skillc.Level2Value_2 = (int)o["Level2Value_2"];
                skillc.Level3Value_1 = (int)o["Level3Value_1"];
                skillc.Level3Value_2 = (int)o["Level3Value_2"];
                skillc.SummonId = (string)o["SummonId"];
                skillc.SummonLevel = (int)o["SummonLevel"];
                skillc.ChangePositionType = (int)o["ChangePositionType"];
                skillc.SwapPropertiesType = (int)o["SwapPropertiesType"];
                skillc.AddBufferID = (int)o["AddBufferID"];
                obj[skillc.Id] = skillc;
            }

            return obj;
        }
    }
}