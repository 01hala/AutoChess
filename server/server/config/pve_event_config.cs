using System;
using System.IO;
using System.Collections.Generic;
using System.Reflection.Metadata;
using Abelkhan;

namespace config
{
    public class PVEEventConfig
    {
        public int ID;
        public int RoleID;
        public int RoleAttack;
        public int RoleHP;
        public int RoleLevel;
        public int RoleEquip;

        public static Dictionary<int, PVEEventConfig> Load(string path)
        {
            var obj = new Dictionary<int, PVEEventConfig>();

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
                var peveventc = new PVEEventConfig();
                peveventc.ID = (int)o["ID"];
                peveventc.RoleID = (int)o["RoleID"];
                peveventc.RoleAttack = (int)o["RoleAttack"];
                peveventc.RoleHP = (int)o["RoleHP"];
                peveventc.RoleLevel = (int)o["RoleLevel"];
                peveventc.RoleEquip = (int)o["RoleEquip"];

                obj[peveventc.ID] = peveventc;
            }

            return obj;
        }
    }
}