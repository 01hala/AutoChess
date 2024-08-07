﻿using System;
using System.IO;

namespace Abelkhan
{
	public class Config
	{
		public Config(string file_path)
		{
			FileStream fs = File.OpenRead(file_path);
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

			handle = Newtonsoft.Json.Linq.JToken.Parse(System.Text.Encoding.Default.GetString(data));
		}

		private Config(Newtonsoft.Json.Linq.JToken sub_handle)
		{
			handle = sub_handle;
		}

		public bool has_key(string key)
		{
			return ((Newtonsoft.Json.Linq.JObject)handle).ContainsKey(key);
		}

		public bool get_value_bool(string key)
		{
			return (bool)(handle[key]);
		}

		public int get_value_int(string key)
		{
			return (int)(handle[key]);
		}

		public uint get_value_uint(string key)
		{
			return (uint)(handle[key]);
		}

		public float get_value_float(string key)
		{
			return (float)(handle[key]);
		}

		public string get_value_string(string key)
		{
			return (string)(handle[key]);
		}

		public Config get_value_dict(string key)
		{
			var _handle = (Newtonsoft.Json.Linq.JToken)(handle[key]);
			return new Config(_handle);
		}

		public Config get_value_list(string key)
		{
			var _handle = (handle[key]);
			return new Config(_handle);
		}

		public int get_list_size()
		{
			return ((Newtonsoft.Json.Linq.JArray)handle).Count;
		}

		public bool get_list_bool(int index)
		{
			return (bool)(((Newtonsoft.Json.Linq.JArray)handle)[index]);
		}

		public int get_list_int(int index)
		{
			return (int)(((Newtonsoft.Json.Linq.JArray)handle)[index]);
		}

		public uint get_list_uint(int index)
		{
			return (uint)(((Newtonsoft.Json.Linq.JArray)handle)[index]);
		}

		public float get_list_float(int index)
		{
			return (float)(((Newtonsoft.Json.Linq.JArray)handle)[index]);
		}

		public string get_list_string(int index)
		{
			return (string)(((Newtonsoft.Json.Linq.JArray)handle)[index]);
		}

		public Config get_list_list(int index)
		{
			var _handle = (Newtonsoft.Json.Linq.JToken)(((Newtonsoft.Json.Linq.JArray)handle)[index]);
			return new Config(_handle);
		}

		public Config get_list_dict(int index)
		{
			var _handle = (((Newtonsoft.Json.Linq.JArray)handle)[index]);
			return new Config(_handle);
		}

		private Newtonsoft.Json.Linq.JToken handle;
	}
}