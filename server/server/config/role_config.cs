using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using System.Diagnostics;

namespace config
{
    public class RoleConfig
    {
        public int Id;
        public string Name;
        public int SkillID;
        public int Stage;
        public int Level;
        public int Price;
        public int Attack;
        public int Hp;
        public int Fetters;
        public int Grade;
        public int ActiveState;
        public string Res;

        public static Dictionary<int, List<RoleConfig>> LoadGrade(Dictionary<int, RoleConfig> cfg)
        {
            var grade = new Dictionary<int, List<RoleConfig>>();

            foreach (var r in cfg.Values)
            {
                if (!grade.TryGetValue(r.Grade, out List<RoleConfig> roles))
                {
                    roles = new List<RoleConfig>();
                    grade[r.Grade] = roles;
                }

                roles.Add(r);
            }

            return grade;
        }

        public static Dictionary<int, List<RoleConfig> > LoadStage(Dictionary<int, RoleConfig> cfg)
        {
            var stage = new Dictionary<int, List<RoleConfig>>();

            foreach (var r in cfg.Values)
            {
                if (!stage.TryGetValue(r.Stage, out List<RoleConfig> roles))
                {
                    roles = new List<RoleConfig>();
                    stage[r.Stage] = roles;
                }

                roles.Add(r);
            }

            return stage;
        }

        public static Dictionary<int, RoleConfig> Load(string path)
        {
            var obj = new Dictionary<int, RoleConfig>();

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
                var rolec = new RoleConfig();
                rolec.Id = (int)o["Id"];
                rolec.Name = (string)o["Name"];
                rolec.SkillID = (int)o["Skill"];
                rolec.Stage = (int)o["Stage"];
                rolec.Price = (int)o["Price"];
                rolec.Attack = (int)o["Attack"];
                rolec.Hp = (int)o["Hp"];
                rolec.Fetters = (int)o["Fetters"];
                rolec.Grade = (int)o["Grade"]; 
                rolec.ActiveState = (int)o["ActiveState"];
                rolec.Res = (string)o["Res"];

                obj[rolec.Id] = rolec;
            }

            return obj;
        }
    }
}