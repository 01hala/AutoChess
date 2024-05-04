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
                if (o["ObjCount"] != null)
                {
                    skillc.ObjCount = (int)o["ObjCount"];
                }
                if (o["ObjectDirection"] != null)
                {
                    skillc.ObjectDirection = (int)o["ObjectDirection"];
                }
                if (o["Level1Value_1"] != null)
                {
                    skillc.Level1Value_1 = (int)o["Level1Value_1"];
                }
                if (o["Level1Value_2"] != null)
                {
                    skillc.Level1Value_2 = (int)o["Level1Value_2"];
                }
                if (o["Level2Value_1"] != null)
                {
                    skillc.Level2Value_1 = (int)o["Level2Value_1"];
                }
                if (o["Level2Value_2"] != null)
                {
                    skillc.Level2Value_2 = (int)o["Level2Value_2"];
                }
                if (o["Level3Value_1"] != null)
                {
                    skillc.Level3Value_1 = (int)o["Level3Value_1"];
                }
                if (o["Level3Value_2"] != null)
                {
                    skillc.Level3Value_2 = (int)o["Level3Value_2"];
                }
                if (o["SummonId"] != null)
                {
                    skillc.SummonId = (string)o["SummonId"];
                }
                if (o["SummonLevel"] != null)
                {
                    skillc.SummonLevel = (int)o["SummonLevel"];
                }
                if (o["ChangePositionType"] != null)
                {
                    skillc.ChangePositionType = (int)o["ChangePositionType"];
                }
                if (o["SwapPropertiesType"] != null)
                {
                    skillc.SwapPropertiesType = (int)o["SwapPropertiesType"];
                }
                if (o["AddBufferID"] != null)
                {
                    skillc.AddBufferID = (int)o["AddBufferID"];
                }
                obj[skillc.Id] = skillc;
            }

            return obj;
        }
    }
}