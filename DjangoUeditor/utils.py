#coding: utf-8

#修正输入的文件路径,输入路径的标准格式：abc,不需要前后置的路径符号
def FixFilePath(OutputPath):
    if callable(OutputPath):
        try:
            OutputPath=OutputPath()
        except Exception:
            OutputPath=""
    if len(OutputPath)>0:
        if OutputPath[-1]!="/":OutputPath="%s/" % OutputPath
    return OutputPath

#在上传的文件名后面追加一个日期时间+随机,如abc.jpg--> abc_20120801202409.jpg
def GenerateRndFilename(filename):
    import datetime
    import random
    from os.path import splitext
    f_name,f_ext=splitext(filename)
    return "%s_%s%s.%s" % (f_name, datetime.datetime.now().strftime("%Y%m%d_%H%M%S_"),random.randrange(10,99),f_ext)













