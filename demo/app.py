# coding: utf-8

import os
import sys
try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

import gzip

root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(root)

import tenjin
from tenjin.helpers import *  # tenjin: this is ugly...

from git.commits_graph import generate_graph_data
from commit import Commit


engine = tenjin.Engine()


def app(environ, start_response):
    status = '200 OK'
    headers = []
    path = environ['PATH_INFO']
    if path.endswith('.js'):
        headers.append(('content-type', 'application/javascript'))
        headers.append(('content-encoding', 'gzip'))
        buffer = StringIO()
        start_response(status, headers)
        content = open('..' + path).read()
        with gzip.GzipFile(mode='wb', compresslevel=6,
                           fileobj=buffer) as f:
            f.write(content)
        return [buffer.getvalue()]
    headers.append(('content-type', 'text/html'))
    start_response(status, headers)
    data = generate_graph_data(Commit.gets(root))
    return engine.render('index.html', {'data': data})
