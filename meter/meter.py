# -*- coding: utf-8 -*-
import sys
import os
import json
import xlrd

def deleteNoneSpacelstrip(str):
    while(str.lstrip('\r') is not str):str = str.lstrip('\r')
    while(str.lstrip('\n') is not str):str = str.lstrip('\n')
    while(str.lstrip('\t') is not str):str = str.lstrip('\t')
    while(str.lstrip('\0') is not str):str = str.lstrip('\0')
    while(str.lstrip('\r') is not str):str = str.lstrip('\r')
    while(str.lstrip('\n') is not str):str = str.lstrip('\n')
    while(str.lstrip('\t') is not str):str = str.lstrip('\t')
    while(str.lstrip('\0') is not str):str = str.lstrip('\0')
    while(str.lstrip('\r') is not str):str = str.lstrip('\r')
    while(str.lstrip('\n') is not str):str = str.lstrip('\n')
    while(str.lstrip('\t') is not str):str = str.lstrip('\t')
    while(str.lstrip('\0') is not str):str = str.lstrip('\0')
    while(str.lstrip('\r') is not str):str = str.lstrip('\r')
    while(str.lstrip('\n') is not str):str = str.lstrip('\n')
    while(str.lstrip('\t') is not str):str = str.lstrip('\t')
    while(str.lstrip('\0') is not str):str = str.lstrip('\0')
    while(str.lstrip('	') is not str):str = str.lstrip('	')
    while(str.lstrip(' ') is not str):str = str.lstrip(' ')
    while(str.lstrip('	') is not str):str = str.lstrip('	')
    while(str.rstrip('\r') is not str):str = str.rstrip('\r')
    while(str.rstrip('\n') is not str):str = str.rstrip('\n')
    while(str.rstrip('\t') is not str):str = str.rstrip('\t')
    while(str.rstrip('\0') is not str):str = str.rstrip('\0')
    while(str.rstrip('\r') is not str):str = str.rstrip('\r')
    while(str.rstrip('\n') is not str):str = str.rstrip('\n')
    while(str.rstrip('\t') is not str):str = str.rstrip('\t')
    while(str.rstrip('\0') is not str):str = str.rstrip('\0')
    while(str.rstrip('\r') is not str):str = str.rstrip('\r')
    while(str.rstrip('\n') is not str):str = str.rstrip('\n')
    while(str.rstrip('\t') is not str):str = str.rstrip('\t')
    while(str.rstrip('\0') is not str):str = str.rstrip('\0')
    while(str.rstrip('\r') is not str):str = str.rstrip('\r')
    while(str.rstrip('\n') is not str):str = str.rstrip('\n')
    while(str.rstrip('\t') is not str):str = str.rstrip('\t')
    while(str.rstrip('\0') is not str):str = str.rstrip('\0')
    while(str.rstrip('	') is not str):str = str.rstrip('	')
    while(str.rstrip(' ') is not str):str = str.rstrip(' ')
    while(str.rstrip('	') is not str):str = str.rstrip('	')
    return str

def excel_meter(xlr, outdir):
    if not os.path.isdir(outdir):
        os.mkdir(outdir)

    print(xlr)

    data = xlrd.open_workbook(xlr)
    tables = data.sheets()

    for i in range(len(tables)):
        file_name = tables[i].name
        meta_name = tables[i].name

        elem = []
        for n in range(tables[i].ncols):
            k = tables[i].cell(0,n).value
            if type(k) == str:
                k = deleteNoneSpacelstrip(k)
            v = tables[i].cell(2,n).value
            if type(v) == str:
                v = deleteNoneSpacelstrip(v)
            print(k, v)
            elem.append((k, v))

        json_obj = {}
        for n in range(2, tables[i].nrows):
            json_sub = {}

            cell = tables[i].cell(n,0)
            ctype = cell.ctype
            value = cell.value

            if ctype == 2:
                json_obj[str(int(tables[i].cell(n,0).value))] = json_sub
            else:
                json_obj[str(tables[i].cell(n,0).value)] = json_sub
            for m in range(tables[i].ncols):
                k,v = elem[m]
                
                cell = tables[i].cell(n,m)
                ctype = cell.ctype
                value = cell.value

                if ctype == 1:
                    value = deleteNoneSpacelstrip(value)

                if v == "string":
                    if ctype == 3:
                        date = xlrd.xldate_as_tuple(value, 0)
                        value = str(date[0]) + "/" + str(date[1]) + "/" + str(date[2])
                    elif ctype == 2:
                        if value % 1 == 0.0:
                            value = str(int(value))
                        else:
                            value = str(value)
                    else:
                        value = str(value)
                if v == "int":
                    print(value)
                    if value == "":
                        value = 0
                    else:
                        value = int(value)
                if v == "bool":
                    if value == "":
                        value = False
                    else:
                        if value == "false":
                            value = False
                        elif value == "true":
                            value = True
                if v == "float":
                    if value == "":
                        value = 0.0
                    else:
                        value = float(value)
                
                json_sub[k] = value

        print(outdir)
        file_path = os.path.join(outdir, file_name + '.txt')
        print(file_path)
        file = open(file_path, 'w')
        json.dump(json_obj, file, indent=4)
        file.close()

if __name__=="__main__":
    input_file = sys.argv[1]
    output_dir = sys.argv[2]
    
    if not os.path.isdir(output_dir):
        os.mkdir(output_dir)

    excel_meter(input_file, output_dir)
        
        
