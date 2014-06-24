#!/usr/bin/env python
import os
import sys
reload = reload(sys)
sys.setdefaultencoding('gb18030')

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DUSite.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
