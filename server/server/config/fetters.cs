using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Linq;

namespace config
{
    public class FettersConfig
    {
        public int Id;
        public string Name;
        public Priority Priority;
        public EMSkillEvent EffectTime;
        public Abelkhan.SkillEffectEM Effect;
        public List<int> RoleNum;
        public List<int> ObjCount;
        public EffectScope EffectScope;
        public int Stage1value_1;
        public int Stage1value_2;
        public int Stage2value_1;
        public int Stage2value_2;
        public int Stage3value_1;
        public int Stage3value_2;
        public int Stage4value_1;
        public int Stage4value_2;
        public int SummonId;
        public int SummonLevel;
        public int RefreshItemID;
        public int RefreshItemNum;

        public static Dictionary<int, FettersConfig> Load(string path)
        {
            var obj = new Dictionary<int, FettersConfig>();

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
                var fettersc = new FettersConfig();
                fettersc.Id = (int)o["Id"];
                fettersc.Name = (string)o["Name"];
                fettersc.EffectTime = (EMSkillEvent)o["EffectTime"];
                fettersc.Effect = (Abelkhan.SkillEffectEM)o["Effect"];
                
                var num = (string)o["RoleNum"];
                var roleNum = num.Split("|");
                fettersc.RoleNum = roleNum.Select(int.Parse).ToList();

                var count = (string)o["ObjCount"];
                var objCount = count.Split("|");
                fettersc.ObjCount = objCount.Select(int.Parse).ToList();

                fettersc.Priority = (Priority) o["Priority"];
                fettersc.EffectScope = (EffectScope)o["EffectScope"];
                fettersc.Stage1value_1 = (int)o["Stage1value_1"];
                fettersc.Stage1value_2 = (int)o["Stage1value_2"];
                fettersc.Stage2value_1 = (int)o["Stage2value_1"];
                fettersc.Stage2value_2 = (int)o["Stage2value_2"];
                fettersc.Stage3value_1 = (int)o["Stage3value_1"];
                fettersc.Stage3value_2 = (int)o["Stage3value_2"];
                fettersc.Stage4value_1 = (int)o["Stage4value_1"];
                fettersc.Stage4value_2 = (int)o["Stage4value_2"];
                fettersc.SummonId = (int)o["SummonId"];
                fettersc.SummonLevel = (int)o["SummonLevel"];
                fettersc.RefreshItemID = (int)o["RefreshItemID"];
                fettersc.RefreshItemNum = (int)o["RefreshItemNum"];

                obj[fettersc.Id] = fettersc;
            }

            return obj;
        }
    }
}